/** Server allowlist — override via env (Functions scope). Client access-config is demos only. */
function splitEmails(s) {
  return String(s || "")
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getPolicy() {
  const admin = splitEmails(Netlify.env.get("PULSEGRID_ADMIN_EMAILS"));
  const donor = splitEmails(Netlify.env.get("PULSEGRID_DONOR_EMAILS"));
  const sponsor = splitEmails(Netlify.env.get("PULSEGRID_SPONSOR_EMAILS"));
  const trialEdits = parseInt(Netlify.env.get("PULSEGRID_TRIAL_EDITS") || "25", 10);
  const trialExports = parseInt(Netlify.env.get("PULSEGRID_TRIAL_EXPORTS") || "5", 10);
  const donorGenDays = parseInt(Netlify.env.get("PULSEGRID_DONOR_GEN_DAYS") || "7", 10);
  const sessionSecret = Netlify.env.get("PULSEGRID_SESSION_SECRET") || "";
  return { admin, donor, sponsor, trialEdits, trialExports, donorGenDays, sessionSecret };
}

export function roleFor(email, policy) {
  const e = String(email || "").trim().toLowerCase();
  if (!e) return "anonymous";
  if (policy.admin.includes(e)) return "admin";
  if (policy.sponsor.includes(e)) return "sponsor";
  if (policy.donor.includes(e)) return "donor";
  return "trial";
}

/** HMAC-ish token without crypto deps heavy — use Web Crypto if available */
export async function signSession(payload, secret) {
  if (!secret) {
    // unsigned demo token (still server-issued)
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
      if (p.u && !secret) return p; // unsigned only if no secret configured
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

export function limitsFor(role, policy) {
  if (role === "admin") return { edits: Infinity, exports: Infinity, genDays: 3650 };
  if (role === "sponsor" || role === "donor")
    return { edits: 500, exports: 100, genDays: policy.donorGenDays };
  if (role === "trial")
    return { edits: policy.trialEdits, exports: policy.trialExports, genDays: 0 };
  return { edits: 0, exports: 0, genDays: 0 };
}
