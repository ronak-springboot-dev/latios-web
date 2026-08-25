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

- Reads config from `backend/.env` automatically (via `python-dotenv`) — no need to export
  anything manually.
- Serves the API at `http://localhost:8000/api/...`.
- Uses the same MongoDB Atlas cluster as production (`MONGO_URL` in `backend/.env`) — enquiries
  and chat messages you create while testing locally land in the same `test_database` database
  that production uses. Fine for now (it's the same shared instance the whole project already
  uses), just be aware test submissions aren't isolated from real ones.
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

- Cloudflare Turnstile bot-protection is live on the enquiry form and chat (`TURNSTILE_SECRET_KEY`
  / `REACT_APP_TURNSTILE_SITE_KEY` in the `.env` files). The Turnstile widget only accepts requests
  from hostnames explicitly allowed in the Cloudflare dashboard — `localhost` is normally
  pre-allowed by Cloudflare Turnstile for dev, but if you see "Unable to connect to website" on
  the widget locally, check the widget's allowed hostnames in Cloudflare (Turnstile → widget
  `0x4AAAAAAD0Wk...` → Settings → Hostnames).
- No local MongoDB needed — both frontend and backend point at the same hosted resources
  production uses (Atlas, Emergent's LLM/email proxy). There's nothing else to stand up locally.

## Production deploy

The production deploy (`https://laptoptrek.com`, single VM via Docker Compose + nginx) is
documented and scripted separately — see [`deploy.sh`](deploy.sh), [`docker-compose.yml`](docker-compose.yml),
and the [`deploy/`](deploy/) folder (nginx configs, cert renewal). Short version, run on the VM:

```bash
./deploy.sh --init   # first run on a fresh VM: installs Docker, builds, issues the TLS cert
./deploy.sh          # every redeploy after that
```
