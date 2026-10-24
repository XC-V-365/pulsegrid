/**
 * PulseGrid access engine — roles, trial quotas, human check, session gate
 */
(function (global) {
  const CFG = () => global.PulseGridAccess || {};
  const STORE = "pulsegrid_saas_v8";

  function normEmail(e) {
    return String(e || "").trim().toLowerCase();
  }

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORE) || "{}"); }
    catch { return {}; }
  }
  function saveState(s) {
    localStorage.setItem(STORE, JSON.stringify(s));
  }

  function getLicenseText() {
    const s = loadState();
    if (s.licenseOverride && CFG().license?.editableByAdmin) return s.licenseOverride;
    return CFG().license?.defaultText || "";
  }
  function setLicenseText(text, actorEmail) {
    if (!isAdmin(actorEmail)) throw new Error("Only admin can change licence");
    const s = loadState();
    s.licenseOverride = text;
    s.licenseUpdatedAt = Date.now();
    s.licenseUpdatedBy = normEmail(actorEmail);
    saveState(s);
  }

  function roleFor(email) {
    email = normEmail(email);
    if (!email) return "anonymous";
    const c = CFG();
    if ((c.adminEmails || []).map(normEmail).includes(email)) return "admin";
    if ((c.sponsorEmails || []).map(normEmail).includes(email)) return "sponsor";
    if ((c.donorEmails || []).map(normEmail).includes(email)) return "donor";
    return "trial";
  }

  function isAdmin(email) { return roleFor(email) === "admin"; }

  function currentUser() {
    const s = loadState();
    return s.user || null;
  }

  function login({ email, provider, humanToken }) {
    email = normEmail(email);
    if (!email || !email.includes("@")) throw new Error("Valid email required");
    if (CFG().humanCheck?.required && !humanToken) throw new Error("Human verification required");
    const role = roleFor(email);
    const s = loadState();
    s.user = {
      email, provider: provider || "email", role,
      loggedInAt: Date.now(),
      trial: s.user?.email === email ? s.user.trial : {
        edits: 0, exports: 0, generations: 0, sessions: 1, startedAt: Date.now()
      },
      generationGrant: s.user?.email === email ? s.user.generationGrant : null
    };
    // Auto grant for donor/sponsor/admin
    if (["admin", "donor", "sponsor"].includes(role)) {
      if (!s.user.generationGrant || s.user.generationGrant.expiresAt < Date.now()) {
        s.user.generationGrant = grantGeneration(role);
      }
    }
    saveState(s);
    return s.user;
  }

  function logout() {
    const s = loadState();
    s.user = null;
    saveState(s);
  }

  function grantGeneration(role) {
    const g = CFG().generationGrant || {};
    if (!(g.onlyFor || []).includes(role) && role !== "admin") {
      return null;
    }
    const days = g.durationDays || 7;
    return {
      role,
      startedAt: Date.now(),
      expiresAt: Date.now() + days * 86400000,
      remaining: g.maxGenerationsPerGrant || 50,
      note: g.note
    };
  }

  function activateDonor(email, kind) {
    // Demo: promote local list + grant (production: webhook from Stripe/Sponsors)
    email = normEmail(email);
    const s = loadState();
    if (!s.user || s.user.email !== email) throw new Error("Login first");
    s.user.role = kind === "sponsor" ? "sponsor" : "donor";
    s.user.generationGrant = grantGeneration(s.user.role);
    saveState(s);
    return s.user;
  }

  function can(action) {
    const u = currentUser();
    if (!u) return { ok: false, reason: "Sign in required" };
    if (u.role === "admin") return { ok: true, unlimited: true };

    const ft = CFG().freeTrial || {};
    const trial = u.trial || {};

    // Generation: only donor/sponsor/admin with active grant
    if (action === "generate") {
      const g = u.generationGrant;
      if (!g || g.expiresAt < Date.now() || g.remaining <= 0) {
        return {
          ok: false,
          reason: "Generation (7-day window) is only available to donators and sponsors. Free trial is very limited."
        };
      }
      return { ok: true, remaining: g.remaining, expiresAt: g.expiresAt };
    }

    const limits = {
      edit: ft.maxPatternEdits,
      export: ft.maxExports,
      bounce: ft.maxWavBounces,
      midi: ft.maxMidiExports,
      generation_trial: ft.maxGenerations
    };
    const counters = {
      edit: trial.edits,
      export: trial.exports,
      bounce: trial.exports,
      midi: trial.exports,
      generation_trial: trial.generations
    };

    if (action === "fx") return { ok: !!ft.allowFxLabs, reason: "FX Labs not in free trial" };
    if (action === "midiOut") return { ok: !!ft.allowMidiOut, reason: "MIDI out not in free trial" };
    if (action === "samples") return { ok: !!ft.allowSampleKit, reason: "Sample kit not in free trial" };
    if (action === "matrix") return { ok: !!ft.allowMatrix, reason: "Matrix not in free trial" };
    if (action === "song") return { ok: !!ft.allowSongMode, reason: "Song mode not in free trial" };
    if (action === "connections") return { ok: ft.allowConnections !== false, reason: "Connections blocked" };

    if (action in limits) {
      const max = limits[action] ?? 0;
      const used = counters[action] ?? 0;
      if (used >= max) return { ok: false, reason: `Free trial limit reached for ${action} (${max})` };
      return { ok: true, remaining: max - used };
    }
    return { ok: false, reason: "Unknown action" };
  }

  function consume(action) {
    const c = can(action);
    if (!c.ok) return c;
    const u = currentUser();
    if (!u || u.role === "admin") return c;
    const s = loadState();
    if (action === "generate" && s.user.generationGrant) {
      s.user.generationGrant.remaining = Math.max(0, s.user.generationGrant.remaining - 1);
    } else if (action === "edit") {
      s.user.trial.edits = (s.user.trial.edits || 0) + 1;
    } else if (action === "export" || action === "bounce" || action === "midi") {
      s.user.trial.exports = (s.user.trial.exports || 0) + 1;
    } else if (action === "generation_trial") {
      s.user.trial.generations = (s.user.trial.generations || 0) + 1;
    }
    saveState(s);
    return can(action);
  }

  /** Simple human checks (demo). Replace with Cloudflare Turnstile / hCaptcha in production. */
  function issueMathChallenge() {
    const a = 2 + Math.floor(Math.random() * 8);
    const b = 2 + Math.floor(Math.random() * 8);
    const token = btoa(JSON.stringify({ a, b, exp: Date.now() + 300000, sum: a + b }));
    return { prompt: `What is ${a} + ${b}?`, token };
  }
  function verifyHuman({ mode, token, answer, checkbox }) {
    if (mode === "checkbox") return !!checkbox ? "human_ok_" + Date.now() : null;
    if (mode === "math") {
      try {
        const p = JSON.parse(atob(token));
        if (p.exp < Date.now()) return null;
        if (+answer === p.sum) return "human_ok_" + Date.now();
      } catch { return null; }
    }
    return null;
  }

  /** Pull old sessions from everywhere (local keys + optional file import) */
  function pullLocalSessions() {
    const keys = CFG().sessions?.pullKeys || [];
    const found = [];
    keys.forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) found.push({ source: "localStorage", key: k, size: raw.length, preview: raw.slice(0, 120), data: JSON.parse(raw) });
      } catch {
        const raw = localStorage.getItem(k);
        if (raw) found.push({ source: "localStorage", key: k, size: raw.length, raw: true });
      }
    });
    // also scan any pulsegrid* keys
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && /pulsegrid|pg_/i.test(k) && !found.some(f => f.key === k)) {
        try {
          found.push({ source: "localStorage-scan", key: k, size: (localStorage.getItem(k) || "").length, data: JSON.parse(localStorage.getItem(k)) });
        } catch {
          found.push({ source: "localStorage-scan", key: k, size: (localStorage.getItem(k) || "").length });
        }
      }
    }
    return found;
  }

  function setAdminList(emails, actor) {
    if (!isAdmin(actor)) throw new Error("Admin only");
    // Client demo: persist override
    const s = loadState();
    s.adminEmailsOverride = emails.map(normEmail).filter(Boolean).slice(0, 13);
    saveState(s);
    // also patch live config
    CFG().adminEmails = s.adminEmailsOverride;
  }
  function effectiveAdminEmails() {
    const s = loadState();
    return s.adminEmailsOverride || CFG().adminEmails || [];
  }

  global.PulseGridAuth = {
    loadState, saveState, roleFor, isAdmin, currentUser, login, logout,
    can, consume, grantGeneration, activateDonor,
    issueMathChallenge, verifyHuman,
    pullLocalSessions, getLicenseText, setLicenseText,
    setAdminList, effectiveAdminEmails, normEmail
  };
})(typeof window !== "undefined" ? window : globalThis);
