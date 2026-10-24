# Deploy PulseGrid (static)

PulseGrid is static HTML/JS/JSON. No server required for the sequencer demo.

## Options

### A · Python local
```bash
cd pulsegrid
python3 -m http.server 8765
```

### B · Netlify drop / CLI
- Publish directory: repo root
- No build command
- Connected tool: Netlify (Grok) when user asks to deploy

### C · Vercel
- Framework: Other
- Output: `.` (static)
- Connected tool: Vercel when user asks

### D · GitHub Pages
- Settings → Pages → branch `main` / root
- Or `/docs` if you move site later

## Post-deploy checks

1. `/step-sequencer.html?seed=phonk` loads seeds (same origin)  
2. `/saas/studio/index.html` Explore works  
3. `/integrations/claude/README.md` readable  
4. Export still client-side only  

## Secrets

OAuth / Composio API keys stay **out** of static files. Use dashboard + agent session.
