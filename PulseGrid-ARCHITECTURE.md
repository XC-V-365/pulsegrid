# PulseGrid v8 Architecture

## Layers

1. **Portal / SaaS** (`index.html`, `saas/`) — auth, human check, roles, licence, generators, sessions  
2. **Sequencer** (`step-sequencer.html`) — v7 engine + v8 access banners/gates  
3. **Native** (`native/`) — C++/Rust scaffolds  
4. **Docs** — functions, modules, SaaS access  

## Roles

admin (owner+12) · sponsor · donor · trial · anonymous  

## Generation

Only `donor` | `sponsor` | `admin` get a **7-day** generation grant. Free trial is explicitly excluded.

## Config

`saas/access-config.js` is the live control plane for demos. Admin UI can override admin emails + licence text in localStorage.
