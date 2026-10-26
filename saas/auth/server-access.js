/**
 * Server access bridge v17 — prefers /.netlify/functions when deployed
 * createSession → verify → consume (edit|export|generate)
 */
(function (g) {
  const KEY = "pulsegrid_server_session_v17";
  const LEGACY = "pulsegrid_server_session_v16";

  function store(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
    try { localStorage.removeItem(LEGACY); } catch (_) {}
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY) || localStorage.getItem(LEGACY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  function clear() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY);
  }

  /** code: the access code for admin/sponsor/donor; without it the server grants trial */
  async function createSession(email, humanOk, code) {
    const r = await fetch("/api/access/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, humanOk: !!humanOk, code: code || undefined }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || "session failed");
    store(data);
    return data;
  }

  async function verify() {
    const stored = load();
    if (!stored || !stored.token) return null;
    try {
      const r = await fetch("/api/access/verify", {
        headers: { Authorization: "Bearer " + stored.token },
      });
      if (!r.ok) {
        if (r.status === 401) clear();
        return null;
      }
      const data = await r.json();
      store({ ...stored, ...data, token: stored.token });
      return data;
    } catch {
      return null; // offline / pure static
    }
  }

  /**
   * Consume quota server-side. Returns { ok, remaining, token, ... }
   * Updates stored token when server re-signs.
   */
  async function consume(action, n) {
    const stored = load();
    if (!stored || !stored.token) throw new Error("no server session");
    const r = await fetch("/api/access/consume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + stored.token,
      },
      body: JSON.stringify({ action, n: n || 1 }),
    });
    const data = await r.json().catch(() => ({}));
    if (data.token) store({ ...stored, ...data, token: data.token });
    if (!r.ok) {
      const err = new Error(data.error || "consume failed");
      err.status = r.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  async function status() {
    try {
      const r = await fetch("/api/access/status");
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  }

  function getStored() {
    return load();
  }

  g.PulseGridServerAccess = {
    createSession,
    verify,
    consume,
    status,
    getStored,
    clear,
    KEY,
  };
})(typeof window !== "undefined" ? window : globalThis);
