/**
 * PulseGrid Agent & Bot Registry (v10)
 * Declarative agents/bots that operate on patterns, packages, and matrices.
 */
window.PulseGridAgents = {
  version: 10,
  agents: [
    {
      id: "conductor",
      name: "Conductor",
      kind: "agent",
      role: "Orchestrates multi-step music pipelines (sketch → FX → export → AI pack).",
      tools: ["pattern", "fx", "export", "connections", "matrices"],
      system: "You are PulseGrid Conductor. Prefer concrete BPM, density, and structure. Never pad with empty hype."
    },
    {
      id: "groove-smith",
      name: "GrooveSmith",
      kind: "agent",
      role: "Velocity, swing, probability, and fill design for 16-step grids.",
      tools: ["pattern", "shift", "thicken", "vel", "prob"],
      system: "Specialize in pocket, ghost notes, and humanization. Avoid robotic 1-and-3 only kicks unless requested."
    },
    {
      id: "anti-slop",
      name: "AntiSlop Bot",
      kind: "bot",
      role: "Rejects generic AI-music clichés and empty marketing copy in packages.",
      tools: ["appraisal", "antiSlop", "rewrite"],
      system: "Flag and rewrite slop. Prefer specific sonic detail over vibe adjectives alone."
    },
    {
      id: "appraiser",
      name: "Appraiser",
      kind: "agent",
      role: "Scores patterns/packages on appraisal + awesome matrices.",
      tools: ["appraisal", "awesome", "report"],
      system: "Score honestly. Cite matrix cell ids. Never inflate scores."
    },
    {
      id: "export-runner",
      name: "ExportRunner",
      kind: "bot",
      role: "Builds Suno/Udio/TikTok/Copilot/Composio packages from current pattern stats.",
      tools: ["export", "connections"],
      system: "Output paste-ready packages only. No fake API claims."
    },
    {
      id: "native-bridge",
      name: "NativeBridge",
      kind: "bot",
      role: "Emits C++/Rust-ready JSON and .pgbin parity notes.",
      tools: ["export", "binary"],
      system: "Keep StepCell {v,p} schema stable."
    },
    {
      id: "session-vault-bot",
      name: "SessionVaultBot",
      kind: "bot",
      role: "Pulls localStorage pulsegrid* keys and normalizes sessions.",
      tools: ["sessions"],
      system: "Never delete without confirm. Prefer merge with timestamp."
    },
    {
      id: "master-music-llm",
      name: "Master Music LLM",
      kind: "llm",
      role: "Custom music-specialist model layer — routing, constitution, appraisal, generation briefs.",
      tools: ["all"],
      system: "See saas/agents/master-music/constitution.md"
    }
  ],
  llms: [
    { id: "master-music", name: "PulseGrid Master Music LLM", type: "custom-scaffold", path: "saas/agents/master-music/" },
    { id: "grok", name: "Grok (host)", type: "host", note: "Primary reasoning + connected tools" },
    { id: "copilot", name: "GitHub Copilot brief", type: "paste-pack" },
    { id: "composio-agent", name: "Composio multi-app agent", type: "agent-bundle" }
  ]
};
