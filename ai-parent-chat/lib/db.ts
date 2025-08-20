import { Pool, PoolConfig } from "pg"

let pool: Pool | null = null

function getPoolConfig(): PoolConfig | null {
	const databaseUrl = process.env.DATABASE_URL
	if (databaseUrl && databaseUrl.trim()) {
		const sslMode = process.env.PGSSLMODE || ""
		return {
			connectionString: databaseUrl,
			ssl: sslMode && sslMode !== "disable" ? { rejectUnauthorized: false } : undefined,
		}
	}

	const host = process.env.PGHOST
	const user = process.env.PGUSER
	const password = process.env.PGPASSWORD
	const database = process.env.PGDATABASE
	const port = Number(process.env.PGPORT || 5432)

	if (host && user && database) {
		const sslMode = process.env.PGSSLMODE || ""
		return {
			host,
			user,
			password,
			database,
			port,
			ssl: sslMode && sslMode !== "disable" ? { rejectUnauthorized: false } : undefined,
		}
	}

	return null
}

export function isDbConfigured(): boolean {
	return getPoolConfig() !== null
}

export function getDbPool(): Pool {
	if (!pool) {
		const config = getPoolConfig()
		if (!config) {
			throw new Error("Database is not configured")
		}
		pool = new Pool(config)
	}
	return pool
}

export async function getOrCreateUserIdByExternalId(externalId: string): Promise<string> {
	const client = await getDbPool().connect()
	try {
		const result = await client.query(
			`INSERT INTO users (external_id)
			 VALUES ($1)
			 ON CONFLICT (external_id) DO UPDATE SET external_id = EXCLUDED.external_id
			 RETURNING id`,
			[externalId],
		)
		return result.rows[0].id as string
	} finally {
		client.release()
	}
}

export async function getOrCreateActiveConversationId(userId: string): Promise<string> {
	const client = await getDbPool().connect()
	try {
		const existing = await client.query(
			`SELECT id FROM conversations
			 WHERE user_id = $1 AND is_active = true
			 ORDER BY updated_at DESC
			 LIMIT 1`,
			[userId],
		)
		if (existing.rowCount && existing.rows[0]?.id) return existing.rows[0].id as string

		const inserted = await client.query(
			`INSERT INTO conversations (user_id, title)
			 VALUES ($1, $2)
			 RETURNING id`,
			[userId, "Session"],
		)
		return inserted.rows[0].id as string
	} finally {
		client.release()
	}
}

export async function insertMessage(conversationId: string, role: "user" | "ai" | "system", content: string): Promise<void> {
	const client = await getDbPool().connect()
	try {
		await client.query(
			`INSERT INTO messages (conversation_id, role, content)
			 VALUES ($1, $2, $3)`,
			[conversationId, role, content],
		)
	} finally {
		client.release()
	}
}


