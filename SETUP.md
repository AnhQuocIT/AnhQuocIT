# AnhQuocIT profile repo — setup

## Local build

```bash
cd github-profile
python3 -m venv .venv
.venv/bin/pip install fonttools brotli
# Place JetBrains Mono + IBM Plex Sans TTF under assets/fonts/src/ (see scripts/subset-fonts.sh)
npm install
npm run build   # fonts + cards
open preview/index.html
```

## Create / push (already scripted in agent run)

Repo must be named **`AnhQuocIT/AnhQuocIT`** (same as username) and **public**.

## METRICS_TOKEN

1. GitHub → Settings → Developer settings → Personal access tokens → **Classic**
2. Scopes: `repo`, `read:user`
3. Repo → Settings → Secrets and variables → Actions → New secret  
   Name: `METRICS_TOKEN`
4. Actions → **Metrics** → Run workflow

Do **not** enable metrics plugins that list private repo names (`repositories`, `notable`, `projects`).

## Profile settings (manual — CLI token lacks `user` scope)

Open https://github.com/settings/profile and set:

- **Name:** Nguyen Anh Quoc  
- **Bio:** Senior Frontend Developer — architecture, performance, production WebGL/3D  
- **Location:** Ho Chi Minh City, Vietnam  
- **URL:** `https://linkedin.com/in/anhquocit` (or portfolio)  
- **Social accounts:** add LinkedIn  

Then:

1. https://github.com/settings/profile → **Contributions** → enable **Private contributions**  
2. https://github.com/AnhQuocIT → Customize pins → pin **AnhQuocIT** only (or leave empty)  
3. Optional: archive student repos (`MusicApp-Android-Studio`, `Java-Lab-example`, `covid-app`, old e-commerce labs, `DGHOME`, …)  
4. Create classic PAT (`repo` + `read:user`) → repo secret `METRICS_TOKEN` → run **Metrics** workflow  

Live profile: https://github.com/AnhQuocIT
