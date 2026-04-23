import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
})

const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

// POST /api/billing/checkout — create Stripe checkout session
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Already on pro
    if (user.plan === "pro") {
      return NextResponse.json({ error: "Already on Pro plan" }, { status: 400 })
    }

    // Create or reuse Stripe customer
    let customerId = user.stripeId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      })
      customerId = customer.id

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeId: customerId },
      })
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
      mode: "subscription",
      success_url: `${APP_URL}/dashboard/settings?tab=plan&upgraded=true`,
      cancel_url: `${APP_URL}/dashboard/settings?tab=plan`,
      metadata: { userId: user.id },
      subscription_data: {
        metadata: { userId: user.id },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("[BILLING CHECKOUT]", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

// GET /api/billing/checkout — get billing portal URL (manage subscription)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user?.stripeId) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 })
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeId,
      return_url: `${APP_URL}/dashboard/settings?tab=plan`,
    })

    return NextResponse.json({ url: portal.url })
  } catch (error) {
    console.error("[BILLING PORTAL]", error)
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 })
  }
}