/**
 * Server access bridge — prefers /.netlify/functions when deployed
 */
(function (g) {
  const KEY = "pulsegrid_server_session_v16";
  async function createSession(email, humanOk) {
    const r = await fetch("/api/access/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, humanOk: !!humanOk }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || "session failed");
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  }
  async function verify() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    let stored;
    try { stored = JSON.parse(raw); } catch { return null; }
    if (!stored.token) return null;
    try {
      const r = await fetch("/api/access/verify", {
        headers: { Authorization: "Bearer " + stored.token },
      });
      if (!r.ok) return null;
      const data = await r.json();
      return data;
    } catch {
      return null; // offline / pure static
    }
  }
  g.PulseGridServerAccess = { createSession, verify, KEY };
})(typeof window !== "undefined" ? window : globalThis);
