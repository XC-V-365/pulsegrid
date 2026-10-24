/**
 * Server-side quota consume — re-signs session with incremented used counters.
 * Actions: edit | export | bounce | midi | generate
 */
import type { Config, Context } from "@netlify/functions"
import {
  getPolicy,
  verifySession,
  signSession,
  remainingFromPayload,
  publicLimits,
  ACTIONS,
} from "./_allowlist.mjs"
import { json, noContent } from "./_cors.mjs"

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return noContent()
  if (req.method !== "POST") return json({ error: "POST only" }, 405)

  const auth = req.headers.get("authorization") || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  const policy = getPolicy()
  const payload = await verifySession(token, policy.sessionSecret)
  if (!payload || (payload.exp && payload.exp < Date.now())) {
    return json({ ok: false, error: "invalid or expired session" }, 401)
  }

  let body: { action?: string; n?: number } = {}
  try {
    body = await req.json()
  } catch {
    return json({ error: "invalid JSON" }, 400)
  }

  const action = String(body.action || "").toLowerCase()
  const counterKey = ACTIONS[action as keyof typeof ACTIONS]
  if (!counterKey) {
    return json({ error: "unknown action", allowed: Object.keys(ACTIONS) }, 400)
  }

  const n = Math.max(1, Math.min(20, parseInt(String(body.n || "1"), 10) || 1))
  const used = {
    edits: payload.used?.edits || 0,
    exports: payload.used?.exports || 0,
    gens: payload.used?.gens || 0,
  }

  // Generation window for donor/sponsor
  if (counterKey === "gens") {
    if (payload.role === "trial" || payload.role === "anonymous") {
      return json(
        {
          ok: false,
          error: "generation only for donor/sponsor/admin",
          remaining: remainingFromPayload(payload, policy),
        },
        403
      )
    }
    if (payload.role !== "admin" && payload.genExpiresAt && payload.genExpiresAt < Date.now()) {
      return json(
        {
          ok: false,
          error: "generation grant expired",
          remaining: remainingFromPayload(payload, policy),
        },
        403
      )
    }
  }

  const preview = remainingFromPayload({ ...payload, used }, policy)
  const field =
    counterKey === "edits" ? "edits" : counterKey === "exports" ? "exports" : "genQuota"
  const rem = preview[field as "edits" | "exports" | "genQuota"]
  if (rem !== null && rem !== undefined && rem < n && payload.role !== "admin") {
    return json(
      {
        ok: false,
        error: `quota exceeded for ${action}`,
        remaining: preview,
      },
      429
    )
  }

  if (payload.role !== "admin") {
    used[counterKey as "edits" | "exports" | "gens"] += n
  }

  const nextPayload = {
    ...payload,
    used,
    iat: payload.iat || Date.now(),
  }
  const newToken = await signSession(nextPayload, policy.sessionSecret)
  const remaining = remainingFromPayload(nextPayload, policy)

  return json({
    ok: true,
    action,
    consumed: n,
    token: newToken,
    email: payload.email,
    role: payload.role,
    limits: publicLimits(remaining),
    remaining,
    used,
    serverEnforced: true,
  })
}

export const config: Config = {
  path: "/api/access/consume",
  method: ["POST", "OPTIONS"],
}
