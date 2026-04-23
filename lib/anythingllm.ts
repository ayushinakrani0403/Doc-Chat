const BASE_URL = process.env.ANYTHINGLLM_BASE_URL!
const API_KEY = process.env.ANYTHINGLLM_API_KEY!

const headers = {
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
}


export async function createWorkspace(name: string) {
  const res = await fetch(`${BASE_URL}/api/v1/workspace/new`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error(`AnythingLLM error: ${res.status}`)
  return res.json()
}

// Get workspace info
export async function getWorkspace(slug: string) {
  const res = await fetch(`${BASE_URL}/api/v1/workspace/${slug}`, {
    headers,
  })
  return res.json()
}

// Delete workspace
export async function deleteWorkspace(slug: string) {
  const res = await fetch(`${BASE_URL}/api/v1/workspace/${slug}`, {
    method: "DELETE",
    headers,
  })
  return res.json()
}

// Stream chat
export async function streamChat(slug: string, message: string, sessionId: string) {
  const res = await fetch(`${BASE_URL}/api/v1/workspace/${slug}/stream-chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message,
      mode: "chat",
      sessionId,
    }),
  })
  return res
}


