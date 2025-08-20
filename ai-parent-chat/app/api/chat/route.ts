import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { N8N_BASE_URL, N8N_CHAT_WEBHOOK_PATH, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE, isN8nConfigured } from "@/lib/config"

function getSessionId() {
	const cookieStore = cookies()
	let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
	if (!sessionId) {
		sessionId = crypto.randomUUID()
		cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
			maxAge: SESSION_COOKIE_MAX_AGE,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			sameSite: "lax",
		})
	}
	return sessionId
}

export async function POST(req: NextRequest) {
	const { messages = [] } = await req.json().catch(() => ({ messages: [] }))
	const sessionId = getSessionId()

	if (!isN8nConfigured()) {
		return NextResponse.json({
			reply:
				"Thanks for sharing. I’m here with you. While the chat brain isn’t connected yet, you can still explore the interface. Once the webhook is configured, I’ll provide personalized guidance on skin-to-skin care.",
		})
	}

	try {
		const url = new URL(N8N_CHAT_WEBHOOK_PATH, N8N_BASE_URL).toString()
		const lastMessage = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1] : null
		const n8nRes = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Session-Id": sessionId,
			},
			body: JSON.stringify({ sessionId, lastMessage, messages }),
		})

		if (!n8nRes.ok) {
			const text = await n8nRes.text()
			return NextResponse.json({ error: "Upstream error", detail: text }, { status: 502 })
		}

		const contentType = n8nRes.headers.get("content-type") || ""
		if (contentType.includes("application/json")) {
			const data = await n8nRes.json()
			return NextResponse.json(data)
		}
		const reply = await n8nRes.text()
		return NextResponse.json({ reply })
	} catch (err: any) {
		return NextResponse.json({ error: "Proxy failed", detail: String(err?.message || err) }, { status: 500 })
	}
}
