export type ChatMessage = {
	id: string
	content: string
	sender: "user" | "ai"
	timestamp?: string | number | Date
}

function tryExtractReply(data: any): string | null {
	if (!data) return null
	// Common fields
	const direct = data.reply ?? data.message ?? data.text ?? data.content ?? data.output
	if (typeof direct === "string" && direct.trim()) return direct

	// OpenAI-like shapes
	try {
		const choice = data.choices?.[0]
		const maybe = choice?.message?.content ?? choice?.text
		if (typeof maybe === "string" && maybe.trim()) return maybe
	} catch {}

	// Messages array with assistant last
	try {
		const msgs = data.messages || data.history || data.chat || []
		if (Array.isArray(msgs)) {
			const assistant = [...msgs].reverse().find((m) => (m.role === "assistant" || m.sender === "ai") && typeof m.content === "string")
			if (assistant?.content) return assistant.content
		}
	} catch {}

	return null
}

export async function sendChat(messages: ChatMessage[], timeoutMs: number = 60000): Promise<string> {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), timeoutMs)
	try {
		const res = await fetch("/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ messages }),
			signal: controller.signal,
		})
		if (!res.ok) {
			const detail = await res.text().catch(() => "")
			throw new Error(`Chat API error: ${res.status} ${detail}`)
		}

		const contentType = res.headers.get("content-type") || ""
		if (contentType.includes("application/json")) {
			const data = await res.json()
			const reply = tryExtractReply(data)
			if (reply) return reply
			throw new Error("Invalid response from assistant")
		}

		// Treat non-JSON as plain text reply
		const text = await res.text()
		if (text && text.trim()) return text
		throw new Error("Empty response from assistant")
	} finally {
		clearTimeout(timeout)
	}
}
