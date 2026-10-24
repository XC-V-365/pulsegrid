/**
 * PulseGrid Matrices — Appraisal · Anti-Slop · Awesome
 * Pure functions; usable from UI or agents.
 */
(function (g) {
  /** Appraisal matrix: craft quality of a drum pattern / package */
  const APPRAISAL = {
    id: "appraisal-v1",
    axes: [
      { id: "structure", label: "Structure", desc: "Clear kick/snare skeleton, sensible phrasing" },
      { id: "dynamics", label: "Dynamics", desc: "Velocity variety, accents, not flat" },
      { id: "groove", label: "Groove", desc: "Swing, off-beat hats, pocket" },
      { id: "density", label: "Density balance", desc: "Not empty, not cluttered for genre" },
      { id: "identity", label: "Identity", desc: "Memorable motif / signature fill" },
      { id: "export_ready", label: "Export-ready", desc: "BPM/style concrete enough for DAW/AI" }
    ],
    scale: { min: 0, max: 5 }
  };

  /** Anti-slop matrix: detect generic AI / empty prose / lazy production */
  const ANTI_SLOP = {
    id: "anti-slop-v1",
    rules: [
      { id: "generic_vibe", label: "Generic vibe words only", weight: 2, patterns: /\b(epic|cinematic|ethereal|vibes?|fire|banger|lit|soulful journey|emotional rollercoaster)\b/gi },
      { id: "no_bpm", label: "Missing BPM / tempo", weight: 2, test: (t) => !/\b\d{2,3}\s*(bpm|BPM)\b/.test(t) },
      { id: "no_structure", label: "No form tags", weight: 1, test: (t) => !/\[(verse|chorus|intro|outro|drop|break|instrumental)\]/i.test(t) },
      { id: "word_salad", label: "Adjective pile-up", weight: 2, test: (t) => (t.match(/\b\w+ly\b/g) || []).length > 6 },
      { id: "placeholder", label: "Placeholder / lorem", weight: 3, patterns: /\b(lorem ipsum|placeholder|todo|tbd|xxx|as an ai)\b/gi },
      { id: "hype_no_detail", label: "Hype without instruments", weight: 2, test: (t) => /\b(amazing|incredible|masterpiece)\b/i.test(t) && !/\b(kick|snare|hat|bass|synth|808|rim|tom|clap)\b/i.test(t) },
      { id: "same_line_repeat", label: "Repeated lines", weight: 2, test: (t) => { const lines = t.split(/\n/).map(s=>s.trim()).filter(Boolean); const set = new Set(lines); return lines.length > 3 && set.size < lines.length * 0.7; } },
      { id: "emoji_spam", label: "Emoji spam", weight: 1, test: (t) => ((t.match(/[\u{1F300}-\u{1FAFF}]/gu) || []).length > 8) }
    ],
    maxScore: 20 // higher = more slop
  };

  /** Awesome matrix: excellence / portfolio bar */
  const AWESOME = {
    id: "awesome-v1",
    cells: [
      { id: "hook", label: "Hook in 4 bars", weight: 1.2 },
      { id: "contrast", label: "A/B contrast", weight: 1.0 },
      { id: "space", label: "Intentional space", weight: 1.0 },
      { id: "sound_design", label: "Sound / kit character", weight: 1.1 },
      { id: "mix_intent", label: "Mix / FX intent", weight: 0.9 },
      { id: "shareability", label: "Share / social pack clarity", weight: 0.8 },
      { id: "originality", label: "Original twist", weight: 1.3 },
      { id: "finish", label: "Finished thought (not sketch-only)", weight: 1.0 }
    ],
    scale: { min: 0, max: 5 },
    awesomeThreshold: 32 // weighted sum
  };

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  /** Heuristic pattern stats from PulseGrid banks shape */
  function patternStats(patternObj) {
    // patternObj: { kick:[{v,p}…], … } or full export with banks.A
    let tracks = patternObj;
    if (patternObj?.banks?.A) tracks = patternObj.banks.A;
    const ids = ["kick", "snare", "hat", "perc"];
    let hits = 0, velSum = 0, velN = 0, probs = [];
    const rowHits = {};
    ids.forEach(id => {
      const row = tracks?.[id] || [];
      rowHits[id] = 0;
      row.forEach(c => {
        const v = c?.v ?? c?.vel ?? 0;
        if (v > 0) {
          hits++; rowHits[id]++;
          velSum += v; velN++;
          probs.push(c?.p ?? c?.prob ?? 100);
        }
      });
    });
    const dens = hits / (16 * 4);
    const velVar = velN ? (velSum / velN) : 0;
    const uniqueVel = new Set((tracks?.kick || []).concat(tracks?.snare || [], tracks?.hat || [], tracks?.perc || []).filter(c => (c?.v||0)>0).map(c => c.v)).size;
    return { hits, dens, avgVel: velVar, uniqueVel, rowHits, probs };
  }

  function autoAppraisePattern(patternObj, bpm) {
    const s = patternStats(patternObj);
    const scores = {};
    // structure: kick on quarters + snare on 2/4-ish
    const kick = (patternObj?.banks?.A?.kick || patternObj?.kick || []);
    const snare = (patternObj?.banks?.A?.snare || patternObj?.snare || []);
    let struct = 2;
    if (kick[0]?.v || kick[4]?.v || kick[8]?.v) struct += 1;
    if (snare[4]?.v || snare[12]?.v) struct += 1;
    if (s.rowHits.hat > 2) struct += 0.5;
    scores.structure = clamp(Math.round(struct), 0, 5);

    scores.dynamics = clamp(s.uniqueVel >= 3 ? 5 : s.uniqueVel === 2 ? 3 : s.hits ? 2 : 0, 0, 5);
    scores.groove = clamp(s.dens > 0.15 && s.dens < 0.55 ? 4 : s.dens >= 0.55 ? 3 : 2, 0, 5);
    if ((patternObj?.swing || 0) > 5) scores.groove = clamp(scores.groove + 1, 0, 5);

    scores.density = clamp(s.dens < 0.08 ? 1 : s.dens > 0.75 ? 2 : 4, 0, 5);
    scores.identity = clamp(s.rowHits.perc > 0 || s.uniqueVel >= 2 ? 3 : 2, 0, 5);
    scores.export_ready = bpm && bpm >= 60 && bpm <= 200 ? 4 : 2;
    if (s.hits >= 6) scores.export_ready = clamp(scores.export_ready + 1, 0, 5);

    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const max = APPRAISAL.axes.length * 5;
    return { matrix: APPRAISAL.id, scores, total, max, pct: Math.round(100 * total / max), stats: s };
  }

  function scoreAntiSlop(text) {
    const t = String(text || "");
    const hits = [];
    let score = 0;
    ANTI_SLOP.rules.forEach(r => {
      let hit = false;
      if (r.patterns) {
        const m = t.match(r.patterns);
        if (m && m.length) { hit = true; hits.push({ id: r.id, label: r.label, count: m.length, weight: r.weight }); score += r.weight * Math.min(3, m.length); }
      }
      if (r.test && r.test(t)) {
        hit = true;
        if (!hits.find(h => h.id === r.id)) hits.push({ id: r.id, label: r.label, count: 1, weight: r.weight });
        score += r.weight;
      }
    });
    const clean = score === 0;
    const grade = score === 0 ? "CLEAN" : score <= 4 ? "MILD" : score <= 10 ? "SLOPPY" : "SLOP";
    return { matrix: ANTI_SLOP.id, score, max: ANTI_SLOP.maxScore, grade, hits, clean };
  }

  function scoreAwesome(manualScores) {
    // manualScores: { hook: 0-5, ... }
    let total = 0, max = 0;
    const detail = [];
    AWESOME.cells.forEach(c => {
      const v = clamp(+(manualScores?.[c.id] ?? 0), 0, 5);
      const w = c.weight * v;
      total += w;
      max += c.weight * 5;
      detail.push({ id: c.id, label: c.label, score: v, weighted: +w.toFixed(2) });
    });
    const isAwesome = total >= AWESOME.awesomeThreshold;
    return { matrix: AWESOME.id, total: +total.toFixed(2), max: +max.toFixed(2), pct: Math.round(100 * total / max), isAwesome, threshold: AWESOME.awesomeThreshold, detail };
  }

  function rewriteAntiSlop(text, bpm, dens) {
    const as = scoreAntiSlop(text);
    let out = text.trim();
    if (!/\b\d{2,3}\s*(bpm|BPM)\b/.test(out)) out = `${bpm || 120} BPM\n` + out;
    if (!/\[instrumental\]/i.test(out)) out += "\n[Instrumental]";
    // strip worst offenders lightly
    out = out.replace(/\b(as an ai|lorem ipsum)\b/gi, "");
    out = out.replace(/\b(epic|fire|banger|lit)\b/gi, "").replace(/  +/g, " ");
    const note = as.clean ? "Already clean." : "Hardened: BPM + instrumental tag; trimmed hype tokens. Re-score recommended.";
    return { text: out.trim(), note, before: as };
  }

  g.PulseGridMatrices = {
    APPRAISAL, ANTI_SLOP, AWESOME,
    patternStats, autoAppraisePattern, scoreAntiSlop, scoreAwesome, rewriteAntiSlop
  };
})(typeof window !== "undefined" ? window : globalThis);
