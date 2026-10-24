/** Server allowlist — env first, then saas/access-config.js fallback (included_files). */
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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

/** Parse window.PulseGridAccess.adminEmails from access-config.js text */
function parseAccessConfig() {
  const candidates = [
    join(process.cwd(), "saas", "access-config.js"),
    join(dirname(fileURLToPath(import.meta.url)), "..", "..", "saas", "access-config.js"),
  ];
  for (const p of candidates) {
    try {
      if (!existsSync(p)) continue;
      const src = readFileSync(p, "utf8");
      const pull = (key) => {
        const re = new RegExp(key + "\\s*:\\s*\\[([\\s\\S]*?)\\]", "m");
        const m = src.match(re);
        if (!m) return [];
        return [...m[1].matchAll(/["']([^"']+@[^"']+)["']/g)].map((x) =>
          x[1].trim().toLowerCase()
        );
      };
      return {
        admin: pull("adminEmails"),
        donor: pull("donorEmails"),
        sponsor: pull("sponsorEmails"),
      };
    } catch (_) {}
  }
  return { admin: [], donor: [], sponsor: [] };
}

let _fileCfg = null;
function fileCfg() {
  if (!_fileCfg) _fileCfg = parseAccessConfig();
  return _fileCfg;
}

export function getPolicy() {
  const file = fileCfg();
  const admin = splitEmails(env("PULSEGRID_ADMIN_EMAILS"));
  const donor = splitEmails(env("PULSEGRID_DONOR_EMAILS"));
  const sponsor = splitEmails(env("PULSEGRID_SPONSOR_EMAILS"));
  const trialEdits = parseInt(env("PULSEGRID_TRIAL_EDITS") || "25", 10);
  const trialExports = parseInt(env("PULSEGRID_TRIAL_EXPORTS") || "5", 10);
  const donorGenDays = parseInt(env("PULSEGRID_DONOR_GEN_DAYS") || "7", 10);
  const sessionSecret = env("PULSEGRID_SESSION_SECRET") || "";
  const requireSecret = env("PULSEGRID_REQUIRE_SECRET") === "1";
  return {
    admin: admin.length ? admin : file.admin,
    donor: donor.length ? donor : file.donor,
    sponsor: sponsor.length ? sponsor : file.sponsor,
    trialEdits,
    trialExports,
    donorGenDays,
    sessionSecret,
    requireSecret,
    sources: {
      admin: admin.length ? "env" : "access-config.js",
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

export function baseLimits(role, policy) {
  if (role === "admin") return { edits: null, exports: null, genDays: 3650, genQuota: null };
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
  const b = baseLimits(role, policy);
  return {
    edits: b.edits === null ? Infinity : b.edits,
    exports: b.exports === null ? Infinity : b.exports,
    genDays: b.genDays,
  };
}

export function remainingFromPayload(payload, policy) {
  const role = payload.role || "anonymous";
  const base = baseLimits(role, policy);
  const used = payload.used || { edits: 0, exports: 0, gens: 0 };
  const rem = (max, usedN) => (max === null ? null : Math.max(0, max - (usedN || 0)));
  return {
    edits: rem(base.edits, used.edits),
    exports: rem(base.exports, used.exports),
    genDays: base.genDays,
    genQuota: rem(base.genQuota, used.gens),
    used,
    role,
  };
}

export function publicLimits(limits) {
  return {
    edits: limits.edits === Infinity || limits.edits === null ? null : limits.edits,
    exports: limits.exports === Infinity || limits.exports === null ? null : limits.exports,
    genDays: limits.genDays,
    genQuota: limits.genQuota === undefined ? undefined : limits.genQuota,
  };
}

export const ACTIONS = {
  edit: "edits",
  export: "exports",
  bounce: "exports",
  midi: "exports",
  generate: "gens",
  generation: "gens",
};
