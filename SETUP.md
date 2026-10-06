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

## Profile settings (manual)

- Name: Nguyen Anh Quoc  
- Bio: Senior Frontend Developer — architecture, performance, WebGL/3D  
- Location: Ho Chi Minh City  
- LinkedIn: `https://linkedin.com/in/anhquocit`  
- Website: optional (portfolio or radanhadat.vn)  
- Enable **Private contributions** on the contribution graph  
- Pin: profile repo only (or none)  
- Optional: archive old student public repos
