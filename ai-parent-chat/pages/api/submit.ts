import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const n8nWebhook = process.env.N8N_INTERNAL_WEBHOOK!;
  try {
    const upstream = await fetch(n8nWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json().catch(() => ({}));
    return res.status(upstream.status).json(data);
  } catch (e: any) {
    return res.status(502).json({ error: "Upstream error", detail: String(e?.message || e) });
  }
}


