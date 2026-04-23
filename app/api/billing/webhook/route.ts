import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("[WEBHOOK] Invalid signature:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log(`[WEBHOOK] Event: ${event.type}`)

  try {
    switch (event.type) {

      // ── Subscription created or updated ──────────────────────────────────
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const status = subscription.status

        // Active or trialing = pro plan
        const isPro = status === "active" || status === "trialing"

        await prisma.user.updateMany({
          where: { stripeId: customerId },
          data: { plan: isPro ? "pro" : "free" },
        })

        console.log(`[WEBHOOK] Subscription ${status} → plan: ${isPro ? "pro" : "free"}`)
        break
      }

      // ── Subscription cancelled / ended ────────────────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await prisma.user.updateMany({
          where: { stripeId: customerId },
          data: { plan: "free" },
        })

        console.log(`[WEBHOOK] Subscription deleted → plan: free`)
        break
      }

      // ── Payment succeeded ─────────────────────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Ensure plan is set to pro on successful payment
        await prisma.user.updateMany({
          where: { stripeId: customerId },
          data: { plan: "pro" },
        })

        console.log(`[WEBHOOK] Payment succeeded → plan: pro`)
        break
      }

      // ── Payment failed ────────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        console.log(`[WEBHOOK] Payment failed for customer: ${customerId}`)
        // Don't downgrade immediately — Stripe will retry
        // You could send an email here
        break
      }

      // ── Checkout completed ────────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string

        if (session.payment_status === "paid") {
          await prisma.user.updateMany({
            where: { stripeId: customerId },
            data: { plan: "pro" },
          })
          console.log(`[WEBHOOK] Checkout completed → plan: pro`)
        }
        break
      }

      default:
        console.log(`[WEBHOOK] Unhandled event: ${event.type}`)
    }
  } catch (error) {
    console.error("[WEBHOOK] Processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}