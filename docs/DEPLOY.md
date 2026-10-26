# Deploy PulseGrid (static + functions)

PulseGrid is static HTML/JS/JSON plus optional Netlify Functions for access.

## Live site

- **Netlify:** https://pulsegrid-xc-v365.netlify.app  
- Site ID: `ef7289ab-e206-4eeb-a2eb-6d654960484e`  
- Repo: https://github.com/XC-V-365/pulsegrid

## Options

### A · Python local
```bash
cd pulsegrid
python3 -m http.server 8765
```

### B · Netlify CLI / connected deploy
- Publish directory: repo root
- Functions: `netlify/functions`
- Env (Functions scope): see `docs/SERVER_ACCESS.md`

### C · Vercel
- Framework: Other
- Output: `.` (static)
- Serverless: map `api/` if you port functions later

### D · GitHub Pages
- Static only (no `/api/access/*` functions)

## Post-deploy checks

1. `/` portal loads  
2. `/step-sequencer.html?seed=phonk` loads seeds  
3. `/saas/studio/index.html` Explore works  
4. `GET /api/access/status` → `{ ok: true, version: 19, ... }`  
5. `POST /api/access/session` with humanOk + email returns a trial token; add `code` (from `PULSEGRID_ADMIN_CODE`) for admin  

## Secrets

OAuth / Composio / `PULSEGRID_SESSION_SECRET` / `PULSEGRID_*_CODE` stay **out** of static files.
