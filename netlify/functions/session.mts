import type { Config, Context } from "@netlify/functions"
import { getPolicy, roleFor, signSession, limitsFor } from "./_allowlist.mjs"

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 })
  }
  if (req.method !== "POST") {
    return Response.json({ error: "POST only" }, { status: 405 })
  }
  let body: { email?: string; humanOk?: boolean } = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 })
  }
  const email = String(body.email || "").trim().toLowerCase()
  if (!email || !email.includes("@")) {
    return Response.json({ error: "email required" }, { status: 400 })
  }
  if (!body.humanOk) {
    return Response.json({ error: "human check required" }, { status: 403 })
  }
  const policy = getPolicy()
  const role = roleFor(email, policy)
  const limits = limitsFor(role, policy)
  const exp = Date.now() + 7 * 24 * 3600 * 1000
  const payload = { email, role, exp, iat: Date.now() }
  const token = await signSession(payload, policy.sessionSecret)
  return Response.json({
    ok: true,
    token,
    email,
    role,
    limits: {
      edits: limits.edits === Infinity ? null : limits.edits,
      exports: limits.exports === Infinity ? null : limits.exports,
      genDays: limits.genDays,
    },
    serverEnforced: true,
    note: policy.sessionSecret
      ? "HMAC session"
      : "Set PULSEGRID_SESSION_SECRET for signed tokens; PULSEGRID_ADMIN_EMAILS for allowlist",
  })
}

export const config: Config = {
  path: "/api/access/session",
  method: ["POST", "OPTIONS"],
}
