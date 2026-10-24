# Continue item complete: seed → sequencer (+ Export evidence)

## What shipped

1. **Seed bar** on `step-sequencer.html` — Techno / House / Trap / DnB / Lo-fi  
2. **From Studio plan** — reads `localStorage.pulsegrid_studio_plan`  
3. **URL** — `?seed=techno` · `?fromStudio=1`  
4. **API** — `PulseGrid.loadGenreSeed`, `loadSeedFromStudioPlan`, `importProject`  
5. **Data** — `saas/styles/seeds/patterns.json`  
6. **REAP** — `integrations/rea/logs/export-json.evidence.md`  

## How to use

```bash
python3 -m http.server 8765
# http://localhost:8765/step-sequencer.html?seed=house
# Studio → seed plan → Sequencer ?fromStudio=1
```

## Next continue candidates

- Unify Export button to v6 payload always  
- Auto-include `seedId` on export  
- Wire remaining genres in seeds JSON  
- Tone.js optional shim  
