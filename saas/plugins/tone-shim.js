(function (g) {
  const CDN = "https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js";
  let loading = null;
  async function loadTone() {
    if (g.Tone) return g.Tone;
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = CDN; s.async = true;
      s.onload = () => (g.Tone ? resolve(g.Tone) : reject(new Error("Tone missing")));
      s.onerror = () => reject(new Error("Tone CDN failed"));
      document.head.appendChild(s);
    });
    return loading;
  }
  g.PulseGridPlugins = Object.assign(g.PulseGridPlugins || {}, {
    loadTone, toneCdn: CDN,
    demoBeep: async () => {
      const Tone = await loadTone(); await Tone.start();
      new Tone.MembraneSynth().toDestination().triggerAttackRelease("C1", "8n");
      return "ok";
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
