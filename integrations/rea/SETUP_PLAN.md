# REA setup plan — approval required before install

**Status:** PLAN ONLY — do not run install until you approve.  
**Target agent:** Grok / coding agent connected to this workspace  
**Policy:** Authorized reverse engineering only (see `README.md` ethics).

---

## What REA is

- Product: [REA — Reverse Engineer Anything](https://rea.tools/)
- Agent connector (public docs): `npx rea-agents@latest setup`
- Prompt gallery: https://madewithrea.com/prompts
- PulseGrid pack (already in repo): `integrations/rea/REAP_PROMPTS.md`

---

## Installation plan (for your approval)

### Step 0 — Preconditions

| Check | Why |
|-------|-----|
| Node.js 18+ and npm available | `npx` runner |
| Network allowed for npm registry | package fetch |
| You own / are authorized to analyze targets | legal / ToS |
| You accept REA’s own license & telemetry (if any) | vendor terms |

**This environment may block `npx` network or global writes.** If blocked, install on your local machine and paste findings back into PulseGrid evidence logs.

### Step 1 — Dry run (no install)

```bash
# Show package metadata only (no setup)
npm view rea-agents version
npm view rea-agents description
```

### Step 2 — Interactive setup (only after approval)

```bash
npx rea-agents@latest setup
```

Expected: wizard or printed plan for:

- Agent config path(s) (e.g. MCP / tool manifest / env)
- Binary or sidecar install location
- Permissions requested (filesystem, process, debug)

**Stop and report the plan** if the tool prints configuration changes — do not apply until you say **APPROVE**.

### Step 3 — Configuration changes to review

After setup prints a plan, review:

| Item | Approve? |
|------|----------|
| Files created/modified under home / project | ☐ |
| New MCP or agent tool entries | ☐ |
| Shell aliases / PATH | ☐ |
| Auto-update | ☐ |

### Step 4 — Verify connection

```text
# Paste to agent after setup:
Verify the REA connection and list the available tools and workflows.
Do not analyze any third-party binary until I name an authorized target.
```

### Step 5 — First authorized exercise

Prefer first-party:

```text
Use REA (if connected) or static reading to map PulseGrid Export JSON
as in integrations/rea/logs/export-json.evidence.md.
```

Or REA’s own sample (from REAP pack):

```text
Download https://rea.tools/examples/notes-example.zip …
```

### Step 6 — Record in PulseGrid

- Append checkpoint to `integrations/rea/evidence-log.template.md` copy  
- Or new file under `integrations/rea/logs/`

---

## Explicit non-goals (this plan)

- No install without your **APPROVE** message  
- No third-party crack / online cheat / unauthorized target  
- No silent global npm root installs  

---

## How to approve

Reply with one of:

- **`APPROVE REA SETUP`** — agent may run Steps 1–4 in an environment where npm works  
- **`APPROVE REA SETUP LOCAL ONLY`** — agent only emits the commands for you to run locally  
- **`REJECT`** — leave plan on disk; no install  

---

## Commands checklist (copy when approved)

```bash
node -v
npm -v
npm view rea-agents version
npx rea-agents@latest setup
# then: verify tools list in agent
```

## PulseGrid links

| Doc | Path |
|-----|------|
| REAP prompts | `integrations/rea/REAP_PROMPTS.md` |
| Hub UI | `integrations/rea/index.html` |
| Export evidence | `integrations/rea/logs/export-json.evidence.md` |
| Ethics | `integrations/rea/README.md` |
