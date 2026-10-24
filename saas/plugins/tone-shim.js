/**
 * PulseGrid optional Tone.js plugin shim (v14.1)
 * Loads Tone from CDN only when requested — does not replace Web Audio core.
 * Usage: PulseGridPlugins.loadTone().then(Tone => { ... })
 */
(function (g) {
  const CDN = "https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js";
  let loading = null;
  async function loadTone() {
    if (g.Tone) return g.Tone;
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = CDN;
      s.async = true;
      s.onload = () => (g.Tone ? resolve(g.Tone) : reject(new Error("Tone global missing")));
      s.onerror = () => reject(new Error("Tone CDN failed"));
      document.head.appendChild(s);
    });
    return loading;
  }
  async function demoBeep() {
    const Tone = await loadTone();
    await Tone.start();
    const synth = new Tone.MembraneSynth().toDestination();
    synth.triggerAttackRelease("C1", "8n");
    return "ok";
  }
  g.PulseGridPlugins = g.PulseGridPlugins || {};
  g.PulseGridPlugins.loadTone = loadTone;
  g.PulseGridPlugins.demoBeep = demoBeep;
  g.PulseGridPlugins.toneCdn = CDN;
})(typeof window !== "undefined" ? window : globalThis);
