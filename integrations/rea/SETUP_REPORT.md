# REA setup report (approved + installed)

**Approval:** user **All** (2026-10-24) — executed as `APPROVE REA SETUP`  
**Package:** `rea-agents@6.7.0`  
**Node:** 22.23.4 via nvm (was 20.20.2)

## What ran

| Step | Result |
|------|--------|
| `nvm install 22 && nvm use 22` | OK — v22.23.4 |
| `npx rea-agents@latest doctor` | node healthy |
| `npx rea-agents@latest setup --yes --all-detected` | **status: ready** |
| appliedActions | `configured_grok_build`, `installed_skill` |
| doctor after setup | **healthy: true** · environment_healthy: false (no binary engines) |

## Configured

- **Grok Build MCP:** `/root/.grok/config.toml` → `[mcp_servers.rea]` · `npx -y rea-agents@6.7.0 mcp`
- **Skill:** `/root/.agents/skills/reverse-engineer-anything` · version **42** · **207** tools · state aligned

## Optional engines (not installed — by design)

Ghidra, IDA MCP, JADX, Kuna, Hopper require you to own/license them and set paths. REA does not download them.

```bash
# only if you already own these tools:
export GHIDRA_INSTALL_DIR=/path/to/ghidra_12.1
export REA_IDA_MCP_CONFIG=/path/to/ida-mcp.json
export REA_JADX_MCP_JAR=/path/to/jadx-headless-mcp.jar
export REA_KUNA_COMMAND=/path/to/kuna
npx rea-agents@latest doctor
```

## PulseGrid first-party (no engines required)

Use `integrations/rea/REAP_PROMPTS.md` + `integrations/rea/logs/*.evidence.md` for authorized static RE of PulseGrid itself.

## Restart note

Restart the Grok agent client if MCP tools do not appear after this setup.
