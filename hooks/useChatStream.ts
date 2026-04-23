"use client"
import { useState, useCallback, useRef } from "react"

export type Message = {
  id: string
  role: "user" | "bot"
  text: string
  loading?: boolean
}

type UseChatStreamOptions = {
  slug: string
  sessionId: string
}

export function useChatStream({ slug, sessionId }: UseChatStreamOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isStreaming) return

      setError(null)

      // 1. Add user message immediately
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        text: userText.trim(),
      }

      // 2. Add empty bot message as placeholder (shows typing indicator)
      const botMsgId = `bot-${Date.now()}`
      const botMsg: Message = {
        id: botMsgId,
        role: "bot",
        text: "",
        loading: true,
      }

      setMessages((prev) => [...prev, userMsg, botMsg])
      setIsStreaming(true)

      // 3. Abort any previous request
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, message: userText.trim(), sessionId }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to get response")
        }

        // 4. Read SSE stream
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n").filter((l) => l.trim())

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue
            const data = line.slice(6)

            if (data === "[DONE]") break

            try {
              const parsed = JSON.parse(data)

              if (parsed.error) {
                throw new Error(parsed.error)
              }

              if (parsed.text) {
                accumulated += parsed.text
                // Update bot message in place as tokens arrive
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botMsgId
                      ? { ...m, text: accumulated, loading: false }
                      : m
                  )
                )
              }
            } catch (parseErr) {
              // Not valid JSON — skip
            }
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") return

        const errorMsg = err.message || "Something went wrong"
        setError(errorMsg)

        // Replace loading bot message with error
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? { ...m, text: "Sorry, I couldn't get a response. Please try again.", loading: false }
              : m
          )
        )
      } finally {
        setIsStreaming(false)
      }
    },
    [slug, sessionId, isStreaming]
  )

  const clearMessages = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    setIsStreaming(false)
  }, [])

  return { messages, isStreaming, error, sendMessage, clearMessages }
}