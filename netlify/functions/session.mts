import type { Config, Context } from "@netlify/functions"
import {
  getPolicy,
  roleFor,
  signSession,
  remainingFromPayload,
  publicLimits,
  baseLimits,
} from "./_allowlist.mjs"
import { json, noContent } from "./_cors.mjs"

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return noContent()
  if (req.method !== "POST") return json({ error: "POST only" }, 405)

  let body: { email?: string; humanOk?: boolean } = {}
  try {
    body = await req.json()
  } catch {
    return json({ error: "invalid JSON" }, 400)
  }

  const email = String(body.email || "").trim().toLowerCase()
  if (!email || !email.includes("@")) return json({ error: "email required" }, 400)
  if (!body.humanOk) return json({ error: "human check required" }, 403)

  const policy = getPolicy()
  if (policy.requireSecret && !policy.sessionSecret) {
    return json({ error: "server misconfigured: PULSEGRID_SESSION_SECRET required" }, 503)
  }

  const role = roleFor(email, policy)
  const base = baseLimits(role, policy)
  const exp = Date.now() + 7 * 24 * 3600 * 1000
  const genExpiresAt =
    base.genDays > 0 ? Date.now() + base.genDays * 24 * 3600 * 1000 : 0

  const payload = {
    email,
    role,
    exp,
    iat: Date.now(),
    used: { edits: 0, exports: 0, gens: 0 },
    genExpiresAt,
    v: 17,
  }
  const token = await signSession(payload, policy.sessionSecret)
  const remaining = remainingFromPayload(payload, policy)

  return json({
    ok: true,
    token,
    email,
    role,
    limits: publicLimits(remaining),
    remaining,
    genExpiresAt: genExpiresAt || null,
    serverEnforced: true,
    note: policy.sessionSecret
      ? "HMAC session v17 — quotas tracked in signed token; use /api/access/consume"
      : "Set PULSEGRID_SESSION_SECRET for signed tokens; PULSEGRID_ADMIN_EMAILS for allowlist",
  })
}

export const config: Config = {
  path: "/api/access/session",
  method: ["POST", "OPTIONS"],
}
