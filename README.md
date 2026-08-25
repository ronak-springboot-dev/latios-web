# Latios Web

Company site for Latios — React (CRA/craco) frontend, FastAPI + MongoDB backend, with an AI
assistant ("LATI") and an internal `/admin` sales dashboard. Production deploy target is
`https://laptoptrek.com` (single VM, Docker Compose + nginx — see [Production deploy](#production-deploy)).

## Prerequisites

- **Node.js 20 LTS** and **Yarn 1.x (Classic)** — `frontend/package.json` declares
  `"packageManager": "yarn@1.22.22"` and relies on Yarn's `resolutions` field to keep
  transitive dependency versions (e.g. `ajv`) consistent. **Do not use `npm install`** — npm
  silently ignores `resolutions`, which causes a broken install
  (`Cannot find module 'ajv/dist/compile/codegen'` on `start`). If Yarn isn't installed,
  `npx yarn@1.22.22 <command>` works without installing anything globally.
- **Python 3.11** (backend)
- The two `.env` files below, already filled in locally with real values (gitignored, never
  committed — see `.env.sample` in each folder if you need to recreate them)
- **Windows + PowerShell note**: if `npm`/`yarn` fail with `UnauthorizedAccess` /
  `running scripts is disabled on this system`, that's PowerShell's execution policy blocking
  the `.ps1` wrapper — either run commands from Git Bash instead, or once, in PowerShell:
  `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

## Run the backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows (PowerShell/cmd)
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

- `emergentintegrations` isn't on the public PyPI — the `pip install` above needs
  `--extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/` (Emergent's own package
  index) or it'll fail outright. Full command:
  `pip install --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/ -r requirements.txt`
- Reads config from `backend/.env` automatically (via `python-dotenv`), then layers
  `backend/.env.local` on top if present (gitignored, local-dev-only overrides — see Turnstile
  note below). No need to export anything manually.
- Serves the API at `http://localhost:8000/api/...`.
- `MONGO_URL`/`DB_NAME` in `backend/.env` point at your own MongoDB Atlas free-tier cluster
  (`latios-cluster.5nnpotw.mongodb.net`, database `latios`) — separate from whatever Emergent's
  own infra used. Atlas only accepts connections from IPs on its Network Access allowlist; if a
  request hangs for ~30s and times out, your current IP probably isn't allowlisted there yet
  (cloud.mongodb.com → Network Access → Add IP Address).
- `backend/.env`'s `CORS_ORIGINS` already includes `http://localhost:3000` alongside the
  production domain, so the locally-run frontend below can call it without CORS errors.

## Run the frontend

```bash
cd frontend
npx yarn@1.22.22 install    # or just `yarn install` if Yarn is installed globally
npx yarn@1.22.22 start      # or `yarn start`
```

- Opens `http://localhost:3000`.
- `frontend/.env.local` (gitignored, already created) sets `REACT_APP_BACKEND_URL=http://localhost:8000`
  for local dev — this overrides the empty value in `frontend/.env`, which is intentionally blank
  for the production build (same-origin deploy behind nginx, see below).
- Run the backend too (previous section) if you want the enquiry form, LATI chat, and `/admin`
  dashboard to actually work — without it those calls just fail, the rest of the site (pages,
  Compare tool, search) still renders fine on its own.
- `/admin` login password is in `backend/.env` → `ADMIN_PASSWORD`.

## Notes

- **Cloudflare Turnstile** bot-protection is verified server-side on the enquiry form and chat
  (`TURNSTILE_SECRET_KEY` / `REACT_APP_TURNSTILE_SITE_KEY`). The real widget only accepts
  requests from hostnames explicitly allowed in the Cloudflare dashboard (`laptoptrek.com`,
  `www.laptoptrek.com`) — **`localhost` is NOT allowed there**, so using the production key
  locally fails with a `110200` "Domain not authorized" error. Fix: `backend/.env.local` and
  `frontend/.env.local` (gitignored, already set up) override both keys with Cloudflare's
  official test keypair, which always validates and works on any hostname — see
  [Cloudflare's testing docs](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
  Don't touch the real widget's hostname list just to make local dev work.
- **LATI chat** calls Google's Gemini API directly (`google-genai` SDK, `GEMINI_API_KEY` from
  [Google AI Studio](https://aistudio.google.com/apikey)) — not through Emergent's proxy. It
  originally used Emergent's "Universal Key" routing, but that key's $1 budget cap was already
  exceeded, so `backend/server.py`'s `/api/chat` was switched to call Google directly.
  `gen_banner_video.py` (a separate, unrelated script) still uses `emergentintegrations` for
  video generation — that dependency stays in `requirements.txt`.
- **Email alerts** (`POST /api/enquiries`) still go through Emergent's managed email proxy
  (`EMERGENT_EMAIL_KEY`) — untouched, confirmed working.
- No local MongoDB server to install — `MONGO_URL` points at your hosted Atlas cluster (see
  above), same as production would.

## Production deploy

The production deploy (`https://laptoptrek.com`, single VM via Docker Compose + nginx) is
documented and scripted separately — see [`deploy.sh`](deploy.sh), [`docker-compose.yml`](docker-compose.yml),
and the [`deploy/`](deploy/) folder (nginx configs, cert renewal). Short version, run on the VM:

```bash
./deploy.sh --init   # first run on a fresh VM: installs Docker, builds, issues the TLS cert
./deploy.sh          # every redeploy after that
```
