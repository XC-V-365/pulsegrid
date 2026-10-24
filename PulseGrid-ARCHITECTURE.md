# PulseGrid v9 Architecture

## Command Center

`saas/dashboard/index.html` unifies:

| Dashboard | Content |
|-----------|---------|
| Overview | Metrics, quick launch, coverage |
| Artifacts | Full file catalog + GitHub links |
| Grok integrations | All connected services → PulseGrid hooks |
| Creator | Loop, sessions, publish paths |
| Admin | Access, licence, deploy |
| Pipelines | P1–P8 |
| Activity | Local health + catalog summary |

## Layers

1. Portal / SaaS access  
2. Sequencer engine  
3. Generators + sessions  
4. **Command Center dashboards**  
5. Integrations (creative + Grok + Composio)  
6. Native C++/Rust  
7. Docs  

## Grok publish (from chat)

Ask Grok to push GitHub, Notion pages, Drive uploads, Buffer posts, Gmail, Vercel deploys — tools are connected on the operator account.

## Config

- `saas/access-config.js` — emails, trial, gen, licence  
- `integrations/grok/CONNECTED_SERVICES.json` — service map  
- `saas/artifacts/catalog.json` — artifact inventory  
