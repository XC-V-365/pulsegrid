import type { Config, Context } from "@netlify/functions"
import { getPolicy, verifySession, remainingFromPayload, publicLimits } from "./_allowlist.mjs"
import { json, noContent } from "./_cors.mjs"

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return noContent()
  const auth = req.headers.get("authorization") || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  const policy = getPolicy()
  const payload = await verifySession(token, policy.sessionSecret)
  if (!payload || (payload.exp && payload.exp < Date.now())) {
    return json({ ok: false, error: "invalid or expired session" }, 401)
  }
  const remaining = remainingFromPayload(payload, policy)
  return json({
    ok: true,
    email: payload.email,
    role: payload.role,
    limits: publicLimits(remaining),
    remaining,
    used: payload.used || { edits: 0, exports: 0, gens: 0 },
    genExpiresAt: payload.genExpiresAt || null,
    serverEnforced: true,
  })
}

export const config: Config = {
  path: "/api/access/verify",
  method: ["GET", "OPTIONS"],
}
