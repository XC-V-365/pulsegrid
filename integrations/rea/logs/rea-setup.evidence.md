# Evidence — REA setup (v18)

| Field | Value |
|-------|-------|
| Date | 2026-10-24 |
| Approval | All → APPROVE REA SETUP |
| Package | rea-agents@6.7.0 |
| Node | 22.23.4 (nvm) |
| Actions | configured_grok_build, installed_skill |
| Doctor healthy | true |
| Skill | reverse-engineer-anything v42 / 207 tools |
| Ethics | Authorized RE only; no third-party crack targets |

Commands:

```bash
nvm install 22 && nvm use 22
npx rea-agents@latest setup --yes --all-detected
npx rea-agents@latest doctor
```
