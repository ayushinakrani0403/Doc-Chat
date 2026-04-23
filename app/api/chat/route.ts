// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"
// import { NextResponse } from "next/server"

// const ANYTHINGLLM_BASE_URL = process.env.ANYTHINGLLM_BASE_URL!
// const ANYTHINGLLM_API_KEY = process.env.ANYTHINGLLM_API_KEY!

// // ─── CORS helper (needed so embed.js on client sites can call this) ───────────
// function corsHeaders(origin: string = "*") {
//   return {
//     // "Access-Control-Allow-Origin": origin,
//     "Access-Control-Allow-Origin": "*",

//     "Access-Control-Allow-Methods": "POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   }
// }

// // Pre-flight request from browser
// export async function OPTIONS() {
//   return new Response(null, { status: 204, headers: corsHeaders() })
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const { slug, message, sessionId } = body as {
//       slug: string
//       message: string
//       sessionId: string
//     }

//     // ── Validate input ────────────────────────────────────────────────────────
//     if (!slug || !message || !sessionId) {
//       return NextResponse.json(
//         { error: "slug, message and sessionId are required" },
//         { status: 400 }
//       )
//     }

//     if (message.trim().length === 0) {
//       return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 })
//     }

//     // ── Auth check ────────────────────────────────────────────────────────────
//     // For embed widget requests the session won't exist — that's fine.
//     // For dashboard preview requests the session must exist.
//     const session = await getServerSession(authOptions)

//     // ── Check workspace exists in DB ──────────────────────────────────────────
//     const workspace = await prisma.workspace.findUnique({
//       where: { slug },
//     })

//     if (!workspace) {
//       return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
//     }

//     // ── Free plan usage limit (100 messages/month) ────────────────────────────
//     if (workspace.userId) {
//       const user = await prisma.user.findUnique({ where: { id: workspace.userId } })

//       if (user?.plan === "free") {
//         const startOfMonth = new Date()
//         startOfMonth.setDate(1)
//         startOfMonth.setHours(0, 0, 0, 0)

//         const msgCount = await prisma.chatLog.count({
//           where: {
//             workspaceId: workspace.id,
//             createdAt: { gte: startOfMonth },
//           },
//         })

//         if (msgCount >= 100) {
//           return NextResponse.json(
//             { error: "Monthly message limit reached. Please upgrade to Pro." },
//             { status: 429 }
//           )
//         }
//       }
//     }

//     // ── Forward to AnythingLLM stream-chat ────────────────────────────────────
//     const llmRes = await fetch(
//       `${ANYTHINGLLM_BASE_URL}/api/v1/workspace/${slug}/stream-chat`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${ANYTHINGLLM_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: message.trim(),
//           mode: "chat",
//           sessionId,
//         }),
//       }
//     )

//     if (!llmRes.ok) {
//       const errText = await llmRes.text()
//       console.error("[CHAT] AnythingLLM error:", llmRes.status, errText)
//       return NextResponse.json(
//         { error: "AI engine error. Please try again." },
//         { status: 502 }
//       )
//     }

//     // ── Collect full response text (for saving to DB) ─────────────────────────
//     // We pipe the stream to the browser AND collect the full text in parallel.
//     let fullResponse = ""

//     const encoder = new TextEncoder()

//     const stream = new ReadableStream({
//       async start(controller) {
//         const reader = llmRes.body!.getReader()
//         const decoder = new TextDecoder()

//         try {
//           while (true) {
//             const { done, value } = await reader.read()
//             if (done) break

//             const chunk = decoder.decode(value, { stream: true })

//             // AnythingLLM sends newline-delimited JSON lines like:
//             // data: {"id":"...","type":"textResponseChunk","textResponse":"Hello","close":false}
//             const lines = chunk.split("\n").filter((l) => l.trim())

//             for (const line of lines) {
//               // Strip "data: " prefix if present
//               const data = line.startsWith("data: ") ? line.slice(6) : line

//               try {
//                 const parsed = JSON.parse(data)

//                 if (parsed.type === "textResponseChunk" && parsed.textResponse) {
//                   fullResponse += parsed.textResponse
//                   // Forward chunk to client as SSE
//                   controller.enqueue(
//                     encoder.encode(`data: ${JSON.stringify({ text: parsed.textResponse })}\n\n`)
//                   )
//                 }

//                 if (parsed.type === "textResponse" && parsed.textResponse) {
//                   // Some AnythingLLM versions send the full text in one go
//                   fullResponse = parsed.textResponse
//                   controller.enqueue(
//                     encoder.encode(`data: ${JSON.stringify({ text: parsed.textResponse })}\n\n`)
//                   )
//                 }

//                 // Signal stream end
//                 if (parsed.close === true) {
//                   controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
//                 }
//               } catch {
//                 // Not valid JSON — skip
//               }
//             }
//           }
//         } catch (err) {
//           console.error("[CHAT STREAM] Read error:", err)
//           controller.enqueue(
//             encoder.encode(
//               `data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`
//             )
//           )
//         } finally {
//           // ── Save to DB after streaming completes ────────────────────────────
//           if (fullResponse) {
//             try {
//               await prisma.chatLog.create({
//                 data: {
//                   workspaceId: workspace.id,
//                   sessionId,
//                   message: message.trim(),
//                   response: fullResponse,
//                   role: "user",
//                 },
//               })
//             } catch (dbErr) {
//               console.error("[CHAT] DB save error:", dbErr)
//               // Non-fatal — don't break the stream
//             }
//           }

//           controller.close()
//         }
//       },
//     })

//     // ── Return SSE stream with CORS headers ───────────────────────────────────
//     return new Response(stream, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache, no-transform",
//         Connection: "keep-alive",
//         ...corsHeaders(req.headers.get("origin") ?? "*"),
//       },
//     })
//   } catch (err) {
//     console.error("[CHAT POST]", err)
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { canSendMessage } from "@/lib/plan-limits"

const ANYTHINGLLM_BASE_URL = process.env.ANYTHINGLLM_BASE_URL!
const ANYTHINGLLM_API_KEY  = process.env.ANYTHINGLLM_API_KEY!

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { slug, message, sessionId } = body as {
      slug: string
      message: string
      sessionId: string
    }

    if (!slug || !message || !sessionId) {
      return NextResponse.json(
        { error: "slug, message and sessionId are required" },
        { status: 400, headers: corsHeaders() }
      )
    }

    // ── Find workspace ────────────────────────────────────────────────────
    const workspace = await prisma.workspace.findUnique({ where: { slug } })
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404, headers: corsHeaders() }
      )
    }

    // ── Check plan limits ─────────────────────────────────────────────────
    const { allowed, reason } = await canSendMessage(workspace.userId, workspace.id)
    if (!allowed) {
      return NextResponse.json(
        { error: reason, upgradeRequired: true },
        { status: 429, headers: corsHeaders() }
      )
    }

    // ── Forward to AnythingLLM ────────────────────────────────────────────
   
   const startTime = Date.now()

    const llmRes = await fetch(
      `${ANYTHINGLLM_BASE_URL}/api/v1/workspace/${slug}/stream-chat`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ANYTHINGLLM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message.trim(), mode: "chat", sessionId }),
      }
    )

    if (!llmRes.ok) {
      console.error("[CHAT] AnythingLLM error:", llmRes.status)
      return NextResponse.json(
        { error: "AI engine error. Please try again." },
        { status: 502, headers: corsHeaders() }
      )
    }

    // ── Stream back to browser ────────────────────────────────────────────
    let fullResponse = ""
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        const reader  = llmRes.body!.getReader()
        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const lines = decoder.decode(value, { stream: true }).split("\n").filter((l) => l.trim())

            for (const line of lines) {
              const data = line.startsWith("data: ") ? line.slice(6) : line
              try {
                const parsed = JSON.parse(data)

                if (parsed.type === "textResponseChunk" && parsed.textResponse) {
                  fullResponse += parsed.textResponse
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.textResponse })}\n\n`))
                }

                if (parsed.type === "textResponse" && parsed.textResponse) {
                  fullResponse = parsed.textResponse
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.textResponse })}\n\n`))
                }

                if (parsed.close === true) {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"))
                }
              } catch { /* skip */ }
            }
          }
        } catch (err) {
          console.error("[CHAT STREAM] error:", err)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`))
        } finally {
          if (fullResponse) {
            // await prisma.chatLog.create({
            //   data: {
            //     workspaceId: workspace.id,
            //     sessionId,
            //     message: message.trim(),
            //     response: fullResponse,
            //     role: "user",
            //   },
            // }).catch((e) => console.error("[CHAT] DB save failed:", e))

            const responseMs = Date.now() - startTime

const unansweredPhrases = [
  "i don't know",
  "i do not know", 
  "no information",
  "not found",
  "cannot find",
  "don't have",
  "no relevant",
  "unable to find",
]
const answered = !unansweredPhrases.some(p =>
  fullResponse.toLowerCase().includes(p)
)

await prisma.chatLog.create({
  data: {
    workspaceId: workspace.id,
    sessionId,
    message: message.trim(),
    response: fullResponse,
    role: "user",
    answered,
    responseMs,
  },
}).catch((e) => console.error("[CHAT] DB save failed:", e))


          }
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type":  "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection":    "keep-alive",
        ...corsHeaders(),
      },
    })
  } catch (err) {
    console.error("[CHAT POST]", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}