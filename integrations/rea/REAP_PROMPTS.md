# REAP — Reverse Engineering Investigation Prompts

Paste into your coding agent. Replace `<angle brackets>`. **One feature per request.**  
Tooling: [REA](https://rea.tools/) · Gallery: [madewithrea.com/prompts](https://madewithrea.com/prompts)

> **Ethics:** Only software you own or are authorized to test. Separate **confirmed facts** from **hypotheses**. Cite evidence.  
> Security sections (anti-cheat, DMA, DRM, vulns) = **defensive / bounty / own-product** only — not bypass guides for third-party or online cheats.

---

## 0. Install & verify

```text
Install REA and connect it to this agent using: npx rea-agents@latest setup

First, show me the installation plan and the configuration changes for my
approval. After the install, verify the connection and list the available
tools and workflows.
```

---

## 1. Getting started

### First exercise — trace a CSV export

```text
Download https://rea.tools/examples/notes-example.zip into a new folder and
extract the contents.

Use REA to investigate what happens when I click "Export notes". Trace the
flow from the button to the file write.

Show where notes.csv is created, which fields it contains, and the files and
functions that prove each step.
```

### First look at an unfamiliar app

```text
Use REA to give me a map of <program>: its main parts, entry points and the
three features worth investigating first. Keep it short and point to evidence
for each claim.
```

---

## 2. Feature tracing (any program)

### Explain one feature

```text
Use REA to investigate how <FEATURE> works in <PATH TO APPLICATION>.

Identify the entry point, the functions involved, the data flow, the
dependencies and the observable side effects.

For every claim, cite file path + function/symbol (or address) as evidence.
Label CONFIRM vs HYPOTHESIS.
```

### Trace user action → effect

```text
In <PATH>, when the user does <ACTION>, what exact code path runs?

List: UI/event hook → handlers → core logic → I/O or network.
Include call order and any async/queue boundaries. Evidence required.
```

### Find configuration & feature flags

```text
Locate how <FEATURE> is enabled/disabled in <PATH>.
Find config files, env vars, registry/plist keys, remote flags, or compile-time switches.
Show read sites and default values with evidence.
```

---

## 3. Native binary exploration

```text
Use REA on <BINARY PATH> (I own / am authorized to analyze).

Map: file type, arch, linked libraries, entry point, interesting exports/imports.
Then deep-dive ONE feature: <FEATURE>.
Produce a short call graph and CONFIRM/HYPOTHESIS table.
```

```text
In <BINARY>, find strings and cross-refs related to <KEYWORD>.
Show xrefs, owning functions, and how the string is used. Evidence only.
```

---

## 4. Software & feature cloning (legal reimplementation)

```text
I am authorized to study <PATH> for interoperability / clean-room notes.

Document the EXTERNAL behavior of <FEATURE> only: inputs, outputs, formats,
error cases, timing constraints. Do not copy proprietary code.

Propose a clean-room design for my own implementation with a test plan.
```

---

## 5. Games (single-player / own builds)

```text
Map the architecture of <GAME PATH I OWN>: render, input, sim, assets, save.
Pick the three best entry points for understanding <MECHANIC>.
Evidence for each. No online multiplayer cheat discussion.
```

```text
Trace how <GAME> loads assets for <SYSTEM>. Formats, paths, decompressors.
Cite evidence. Authorized copy only.
```

---

## 6. Game portability to WASM

```text
Assess <ENGINE/BINARY I OWN> for WASM portability: language, APIs, threads,
filesystem, rendering backend, audio. List blockers and a phased port plan.
```

---

## 7. Firmware & embedded

```text
Analyze <FIRMWARE IMAGE I AM AUTHORIZED TO TEST>: base address, ISA, vectors,
interesting peripherals, boot flow. Then trace <FEATURE> with evidence.
```

---

## 8. Android

```text
For <APK I OWN / AUTHORIZED>, map package structure, entry activities, native
libs, network endpoints related to <FEATURE>. Evidence from smali/java/so.
```

---

## 9. Kernel analysis (research)

```text
Authorized lab only. Map <KERNEL MODULE / IMAGE> related to <SUBSYSTEM>.
Entry points, IOCTL/syscalls of interest, data structures. Facts vs hypotheses.
No exploit chain production unless this is a paid bounty scope with rules.
```

---

## 10. Vulnerability research (responsible)

```text
Authorized target <PATH/SCOPE>. Hunt for <CLASS e.g. path traversal> in
<COMPONENT>. For each finding: severity, reachability, PoC outline for
the maintainer, and a fix suggestion. No public weaponization.
```

---

## 11. Electron & JavaScript

```text
Map Electron app at <PATH>: main, preload, renderer, IPC channels, nodeIntegration,
contextIsolation. Trace <FEATURE> across process boundary with evidence.
```

```text
In JS/TS project <PATH>, find the production bundle map for <FEATURE>
(source maps if present). List modules, state stores, and network calls.
```

---

## 12. Anti-cheat & protection research (defensive)

```text
I am hardening MY product / authorized lab. Using REA, document how protection
in <MY BUILD> detects <CLASS of tamper>. List checks, trust boundaries, and
gaps. Recommend defenses. Do not produce a bypass for third-party online games.
```

---

## 13. DMA & hardware-assisted research (defensive)

```text
Defensive research only for systems I own. Summarize DMA attack surface relevant
to <MY APP/DRIVER>, detection ideas, and hardening checklist.
No step-by-step guide to cheat online games via DMA hardware.
```

---

## 14. License / protection research (own software)

```text
Analyze licensing/protection in <MY PRODUCT BUILD>. Document license check
flow, failure modes, and offline behavior with evidence.
Goal: improve robustness and support—not crack third-party software.
```

---

## 15. Version comparison & crash work

```text
Diff <VERSION_A> vs <VERSION_B> of <PROGRAM I OWN> focusing on <FEATURE>.
List changed functions/symbols with evidence. Hypothesize regression risks.
```

```text
I have crash dump / repro for <PROGRAM I OWN>. Use REA to locate likely
faulting path for <SYMPTOM>. CONFIRM vs HYPOTHESIS; suggest instrumentation.
```

---

## 16. Long-running investigations

```text
Start a multi-session investigation of <SYSTEM I AM AUTHORIZED TO ANALYZE>.
Create: scope.md, evidence log, open questions, next experiments.
After each session, append a checkpoint. Prefer durable notes over re-browsing.
```

---

## Wildcard (start here)

```text
I own / am authorized to analyze <TARGET>. Goal: <ONE GOAL>.

Use REA. One feature at a time. Evidence for every claim.
Output: map → deep-dive → facts table → next prompt suggestion.
```

---

## 17. PulseGrid first-party (authorized — this repo)

### Map PulseGrid

```text
Map the PulseGrid monorepo at <repo root>: portal, sequencer, studio EPB,
agents, matrices, SaaS access, native cpp/rust, integrations.
List entry points and the three best features to investigate next.
Evidence = file paths.
```

### Trace Export JSON

```text
In step-sequencer.html, investigate how Export JSON works.
Entry points (buttons), data shape (banks A/B, StepCell), download path.
Cite function names / line regions. CONFIRM vs HYPOTHESIS.
```

### Trace sample kit drop-in

```text
Trace sample kit load: file picker, drag-drop, name guessing, buffer map,
synth fallback. Evidence from step-sequencer.html.
```

### Trace Web MIDI out + clock

```text
Trace Web MIDI enable, device select, GM drum map, velocity, MIDI clock
start/stop while playing. Evidence required.
```

### Trace SaaS access gate

```text
Trace portal auth → role (admin / trial / donor) → limits.
Files: index.html, saas/access-config.js, auth helpers.
```

### Trace Studio plan draft

```text
Trace Explore → Plan seed: genre → localStorage pulsegrid_studio_plan.
Files under saas/studio and related catalogs.
```

### Trace matrices pipeline

```text
Trace Appraisal, Anti-Slop, Awesome from saas/matrices/engines.js through
UI and Master Music localInfer. Show score fields and verdict rules.
```

### Native parity

```text
Compare StepCell / pattern / clock models across web, native/cpp, native/rust.
List parity gaps with file evidence.
```

---

## Prompt-writing tips

1. **One feature** per prompt  
2. **Replace** every `<placeholder>`  
3. Demand **evidence** (path + symbol)  
4. Force **CONFIRM vs HYPOTHESIS**  
5. Prefer **authorized first-party** targets when learning  

## Next steps

- Official gallery: https://madewithrea.com/prompts  
- REA tools: https://rea.tools/  
- PulseGrid pack: this file + `catalog.json` + `workflows.json`  
