/** Server allowlist — env → access-config.js → bundled defaults */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_ADMIN_EMAILS,
  DEFAULT_DONOR_EMAILS,
  DEFAULT_SPONSOR_EMAILS,
  DEFAULT_TRIAL,
} from "./_defaults.mjs";

function splitEmails(s) {
  return String(s || "")
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function env(key) {
  try {
    if (typeof Netlify !== "undefined" && Netlify.env?.get) {
      return Netlify.env.get(key) || "";
    }
  } catch (_) {}
  return process.env[key] || "";
}

function parseAccessConfig() {
  const candidates = [
    join(process.cwd(), "saas", "access-config.js"),
    join(dirname(fileURLToPath(import.meta.url)), "..", "..", "saas", "access-config.js"),
    join(dirname(fileURLToPath(import.meta.url)), "saas", "access-config.js"),
  ];
  for (const p of candidates) {
    try {
      if (!existsSync(p)) continue;
      const raw = readFileSync(p, "utf8");
      const src = raw.replace(/\/\/.*$/gm, "");
      const pull = (key) => {
        const re = new RegExp(key + "\\s*:\\s*\\[([\\s\\S]*?)\\]", "m");
        const m = src.match(re);
        if (!m) return [];
        return [...m[1].matchAll(/["']([^"']+@[^"']+)["']/g)].map((x) =>
          x[1].trim().toLowerCase()
        );
      };
      const admin = pull("adminEmails");
      if (!admin.length) continue;
      return {
        admin,
        donor: pull("donorEmails"),
        sponsor: pull("sponsorEmails"),
      };
    } catch (_) {}
  }
  return null;
}

let _fileCfg = undefined;
function fileCfg() {
  if (_fileCfg === undefined) _fileCfg = parseAccessConfig();
  return _fileCfg;
}

export function getPolicy() {
  const file = fileCfg();
  const adminEnv = splitEmails(env("PULSEGRID_ADMIN_EMAILS"));
  const donorEnv = splitEmails(env("PULSEGRID_DONOR_EMAILS"));
  const sponsorEnv = splitEmails(env("PULSEGRID_SPONSOR_EMAILS"));
  const trialEdits = parseInt(env("PULSEGRID_TRIAL_EDITS") || String(DEFAULT_TRIAL.edits), 10);
  const trialExports = parseInt(env("PULSEGRID_TRIAL_EXPORTS") || String(DEFAULT_TRIAL.exports), 10);
  const donorGenDays = parseInt(
    env("PULSEGRID_DONOR_GEN_DAYS") || String(DEFAULT_TRIAL.donorGenDays),
    10
  );
  const sessionSecret = env("PULSEGRID_SESSION_SECRET") || "";
  const requireSecret = env("PULSEGRID_REQUIRE_SECRET") === "1";

  let admin, donor, sponsor, adminSource;
  if (adminEnv.length) {
    admin = adminEnv;
    adminSource = "env";
  } else if (file?.admin?.length) {
    admin = file.admin;
    adminSource = "access-config.js";
  } else {
    admin = DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase());
    adminSource = "bundled-defaults";
  }
  if (donorEnv.length) donor = donorEnv;
  else if (file?.donor) donor = file.donor;
  else donor = DEFAULT_DONOR_EMAILS.map((e) => e.toLowerCase());
  if (sponsorEnv.length) sponsor = sponsorEnv;
  else if (file?.sponsor) sponsor = file.sponsor;
  else sponsor = DEFAULT_SPONSOR_EMAILS.map((e) => e.toLowerCase());

  return {
    admin,
    donor,
    sponsor,
    trialEdits,
    trialExports,
    donorGenDays,
    sessionSecret,
    requireSecret,
    sources: {
      admin: adminSource,
      secret: sessionSecret ? "env" : "unsigned",
    },
  };
}

export function roleFor(email, policy) {
  const e = String(email || "").trim().toLowerCase();
  if (!e) return "anonymous";
  if (policy.admin.includes(e)) return "admin";
  if (policy.sponsor.includes(e)) return "sponsor";
  if (policy.donor.includes(e)) return "donor";
  return "trial";
}

export async function signSession(payload, secret) {
  if (!secret) {
    return "pg." + btoa(JSON.stringify({ ...payload, u: true }));
  }
  const data = JSON.stringify(payload);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return "pg." + btoa(data) + "." + b64;
}

export async function verifySession(token, secret) {
  if (!token || !token.startsWith("pg.")) return null;
  const parts = token.slice(3).split(".");
  if (parts.length === 1) {
    try {
      const p = JSON.parse(atob(parts[0]));
      if (p.u && !secret) return p;
      return null;
    } catch {
      return null;
    }
  }
  if (parts.length !== 2 || !secret) return null;
  const [dataB64, sigB64] = parts;
  try {
    const data = atob(dataB64);
    const payload = JSON.parse(data);
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sig = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      sig,
      new TextEncoder().encode(data)
    );
    return ok ? payload : null;
  } catch {
    return null;
  }
}

/** Base limits by role (Infinity for unlimited) */
export function baseLimits(role, policy) {
  if (role === "admin")
    return { edits: Infinity, exports: Infinity, genDays: 3650, genQuota: Infinity };
  if (role === "sponsor" || role === "donor")
    return { edits: 500, exports: 100, genDays: policy.donorGenDays, genQuota: 50 };
  if (role === "trial")
    return {
      edits: policy.trialEdits,
      exports: policy.trialExports,
      genDays: 0,
      genQuota: 0,
    };
  return { edits: 0, exports: 0, genDays: 0, genQuota: 0 };
}

export function limitsFor(role, policy) {
  return baseLimits(role, policy);
}

/** Remaining after used counters in payload */
export function remainingFromPayload(payload, policy) {
  const role = payload?.role || "anonymous";
  const base = baseLimits(role, policy);
  const used = payload?.used || { edits: 0, exports: 0, gens: 0 };
  const genExpired = payload?.genExpiresAt && payload.genExpiresAt < Date.now();
  let genQuota = base.genQuota;
  if (role === "admin") genQuota = Infinity;
  else if (role === "trial" || role === "anonymous") genQuota = 0;
  else if (genExpired) genQuota = 0;
  else genQuota = Math.max(0, (base.genQuota === Infinity ? 0 : base.genQuota) - (used.gens || 0));

  return {
    edits:
      base.edits === Infinity ? null : Math.max(0, base.edits - (used.edits || 0)),
    exports:
      base.exports === Infinity ? null : Math.max(0, base.exports - (used.exports || 0)),
    genDays: base.genDays,
    genQuota: base.genQuota === Infinity ? null : genQuota,
    used,
    role,
  };
}

/** JSON-safe limits (Infinity → null) */
export function publicLimits(limits) {
  return {
    edits: limits.edits === Infinity ? null : limits.edits,
    exports: limits.exports === Infinity ? null : limits.exports,
    genDays: limits.genDays,
    genQuota: limits.genQuota === Infinity ? null : limits.genQuota,
  };
}

/** Map client actions → used counter keys */
export const ACTIONS = {
  edit: "edits",
  export: "exports",
  bounce: "exports",
  midi: "exports",
  generate: "gens",
  generation: "gens",
};
