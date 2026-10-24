import type { Config, Context } from "@netlify/functions"
import { getPolicy, verifySession, limitsFor } from "./_allowlist.mjs"

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 })
  const auth = req.headers.get("authorization") || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  const policy = getPolicy()
  const payload = await verifySession(token, policy.sessionSecret)
  if (!payload || (payload.exp && payload.exp < Date.now())) {
    return Response.json({ ok: false, error: "invalid or expired session" }, { status: 401 })
  }
  const limits = limitsFor(payload.role, policy)
  return Response.json({
    ok: true,
    email: payload.email,
    role: payload.role,
    limits: {
      edits: limits.edits === Infinity ? null : limits.edits,
      exports: limits.exports === Infinity ? null : limits.exports,
      genDays: limits.genDays,
    },
    serverEnforced: true,
  })
}

export const config: Config = {
  path: "/api/access/verify",
  method: ["GET", "OPTIONS"],
}
