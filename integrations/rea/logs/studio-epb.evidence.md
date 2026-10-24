# REAP evidence log — Studio Explore → Plan → Build

## Map (CONFIRM)

| Claim | Evidence | Status |
|-------|----------|--------|
| Hub phases | `saas/studio/index.html` Explore/Plan/Build/Ship | CONFIRM |
| Genre/style load | `saas/styles/genres.json` fetch | CONFIRM |
| Plan draft localStorage | key `pulsegrid_studio_plan` | CONFIRM |
| Sequencer fromStudio | `?fromStudio=1` + `loadSeedFromStudioPlan` | CONFIRM |
| Seeds data | `saas/styles/seeds/patterns.json` | CONFIRM |

## Data flow

```
genre select → seed plan → localStorage
→ step-sequencer.html?fromStudio=1 | ?seed=<id>
→ banks.A + bpm/swing + lastSeedId
→ Export v13 JSON includes seedId
```
