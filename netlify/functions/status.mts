/** Public status — policy shape without secrets or email lists contents */
import type { Config, Context } from "@netlify/functions"
import { getPolicy } from "./_allowlist.mjs"
import { json, noContent } from "./_cors.mjs"

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return noContent()
  const policy = getPolicy()
  return json({
    ok: true,
    product: "PulseGrid",
    version: 18,
    serverEnforced: true,
    hmacConfigured: !!policy.sessionSecret,
    requireSecret: policy.requireSecret,
    adminSlotsConfigured: policy.admin.length,
    donorSlotsConfigured: policy.donor.length,
    sponsorSlotsConfigured: policy.sponsor.length,
    trialDefaults: {
      edits: policy.trialEdits,
      exports: policy.trialExports,
    },
    donorGenDays: policy.donorGenDays,
    sources: policy.sources || null,
    endpoints: [
      "POST /api/access/session",
      "GET  /api/access/verify",
      "POST /api/access/consume",
      "GET  /api/access/status",
    ],
  })
}

export const config: Config = {
  path: "/api/access/status",
  method: ["GET", "OPTIONS"],
}
