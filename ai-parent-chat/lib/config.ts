export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SkinCubator"

export const N8N_BASE_URL = process.env.N8N_BASE_URL || ""
export const N8N_CHAT_WEBHOOK_PATH = process.env.N8N_CHAT_WEBHOOK_PATH || ""
export const N8N_CHAT_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL || ""

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "sc_session"
export const SESSION_COOKIE_MAX_AGE = Number(process.env.SESSION_COOKIE_MAX_AGE || 60 * 60 * 24 * 90)

export function isN8nConfigured(): boolean {
	return Boolean(
		N8N_CHAT_WEBHOOK_URL ||
		(N8N_BASE_URL && N8N_CHAT_WEBHOOK_PATH)
	)
}
