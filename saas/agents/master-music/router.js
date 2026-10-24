/**
 * Master Music LLM router — local orchestration over matrices + agent prompts.
 * In production, send `buildMessages()` to your hosted LLM endpoint.
 */
(function (g) {
  function loadConstitution() {
    return "PulseGrid Master Music LLM — see constitution.md. No slop. Matrices first. Honest scores.";
  }

  function buildMessages({ mode, pattern, bpm, swing, packageText, userAsk }) {
    const M = g.PulseGridMatrices;
    const appraisal = pattern && M ? M.autoAppraisePattern(pattern, bpm) : null;
    const slop = packageText && M ? M.scoreAntiSlop(packageText) : null;
    const system = [
      loadConstitution(),
      "Mode: " + (mode || "critique"),
      appraisal ? ("Appraisal: " + JSON.stringify(appraisal.scores) + " total=" + appraisal.total) : "",
      slop ? ("AntiSlop: " + slop.grade + " score=" + slop.score + " hits=" + JSON.stringify(slop.hits)) : ""
    ].filter(Boolean).join("\n");

    const user = [
      userAsk || "Critique and improve.",
      bpm != null ? "BPM: " + bpm : "",
      swing != null ? "Swing: " + swing : "",
      pattern ? "Pattern JSON:\n" + JSON.stringify(pattern).slice(0, 4000) : "",
      packageText ? "Package:\n" + packageText.slice(0, 3000) : ""
    ].filter(Boolean).join("\n\n");

    return {
      model: "pulsegrid-master-music-v1",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      tools_hint: ["appraisal", "antiSlop", "awesome", "export", "pattern"]
    };
  }

  /** Local deterministic "LLM" response for offline demo */
  function localInfer(payload) {
    const M = g.PulseGridMatrices;
    const lines = ["## Intent", "Local Master Music pass (deterministic scaffold).", ""];
    const user = payload.messages?.find(m => m.role === "user")?.content || "";
    let pattern = null, bpm = 120;
    try {
      const m = user.match(/Pattern JSON:\n(\{[\s\S]*)/);
      if (m) pattern = JSON.parse(m[1].slice(0, m[1].lastIndexOf("}") + 1));
    } catch (_) {}
    const bpmM = user.match(/BPM:\s*(\d+)/);
    if (bpmM) bpm = +bpmM[1];

    if (pattern && M) {
      const a = M.autoAppraisePattern(pattern.banks ? pattern : { banks: { A: pattern } }, bpm);
      lines.push("## Matrix scores", "Appraisal " + a.total + "/" + a.max + " (" + a.pct + "%)", JSON.stringify(a.scores, null, 2), "");
    }
    const pkg = user.match(/Package:\n([\s\S]+)/);
    if (pkg && M) {
      const s = M.scoreAntiSlop(pkg[1]);
      lines.push("Anti-Slop: " + s.grade + " (" + s.score + ")", s.hits.map(h => "- " + h.label).join("\n") || "- clean", "");
      if (!s.clean) {
        const r = M.rewriteAntiSlop(pkg[1], bpm);
        lines.push("## De-slop draft", r.text, "", r.note, "");
      }
    }
    lines.push("## Actions", "1. Raise velocity variety if dynamics < 3", "2. Ensure snare on steps 5 & 13 for rock/electro grid", "3. Re-run Awesome matrix before feature", "");
    lines.push("## Risks / next", "Wire hosted LLM endpoint to buildMessages() for full generative compose.");
    return { model: "pulsegrid-master-music-local", content: lines.join("\n") };
  }

  g.PulseGridMasterMusic = { buildMessages, localInfer, loadConstitution };
})(typeof window !== "undefined" ? window : globalThis);
