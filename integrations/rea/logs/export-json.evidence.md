# REAP evidence log — PulseGrid Export JSON

- **Target:** PulseGrid monorepo (first-party, authorized)
- **Feature:** Export JSON / project payload
- **Started:** 2026-10-24
- **Authorization:** Own software (XC-V-365/pulsegrid)

## Map (CONFIRM)

| Claim | Evidence | Status |
|-------|----------|--------|
| Export button triggers download + clipboard | `step-sequencer.html` — `#btnExport` onclick builds `exportPayload()`, creates Blob download `pulsegrid-v4-*.json`, clipboard write | CONFIRM |
| Base payload fields | `exportPayload()` → `version`, `app`, `bpm`, `swing`, `activeBank`, `songMode`, `songChain`, `midiChannel`, `banks` | CONFIRM |
| v6 enhanced export | `exportPayloadV6()` / `window.__pgExport` adds `sampleNames`, `matrices` (velocity, probability, binaryMasks), `fx`, `connections` | CONFIRM |
| Banks shape | `banks.A` / `banks.B` via `normalizePattern`; tracks `kick,snare,hat,perc`; steps `StepCell { v, p }` | CONFIRM |
| Import inverse | `#btnImport` + `#fileImport` reads JSON; applies banks, bpm, swing, midiChannel, songChain, activeBank | CONFIRM |
| Public API | `window.PulseGrid.exportAll` → `__pgExport`; `importProject` / `setPattern` / `getPattern` (v13) | CONFIRM |
| Autosave path | `PG_STORAGE = "pulsegrid_v7"`; `saveLocal` / `loadLocal` in QOL block | CONFIRM |
| Ctrl+S export | Help table documents Ctrl+S → Export JSON download | CONFIRM (UI docs) |

## Call flow (Export button)

```
#btnExport click
  → exportPayload()  [or prefer window.__pgExport / exportPayloadV6 when present]
  → JSON.stringify
  → Blob download + optional clipboard
```

**Note:** Early `#btnExport` still calls `exportPayload()` (v4-shaped). Matrix/FX-rich export is on `window.__pgExport` / I/O hub / `exportAll`. **HYPOTHESIS:** some UI paths still use thinner payload — verify I/O Hub uses v6.

## Call flow (Import)

```
#btnImport → #fileImport.change
  → JSON.parse
  → normalizePattern(banks.A/B)
  → tempo/swing/midi/songChain
  → selectBank / syncGrid
```

## Side effects

- Downloads file to user disk  
- May write clipboard  
- Does not network-upload (CONFIRM — no fetch in export path for JSON)  
- Sample **buffers** not embedded in JSON; `sampleNames` only (CONFIRM in v6)

## Open questions

1. Unify `#btnExport` to always call `exportPayloadV6` / `__pgExport`  
2. Document schema version bump to 13 when seeds land  
3. Include `seedId` in export when loaded from genre seed  

## Next experiment

- Click Export after loading techno seed; confirm bpm 130 and kick mask  
- Diff `exportPayload` vs `__pgExport` output keys  

## Related first-party traces

- Sample kit drop-in · Web MIDI · Access gate · Matrices  
  (prompts in `integrations/rea/REAP_PROMPTS.md` §17)
