#!/usr/bin/env bash
# Build and deploy the storefront to Cloudflare Pages.
#
#   ./deploy-pages.sh
#
# Use this rather than a bare `craco build` + `wrangler pages deploy`. The
# production values below MUST be passed explicitly, because frontend/.env.local
# exists on this machine for local development and sets:
#
#   REACT_APP_BACKEND_URL=http://localhost:8000
#   REACT_APP_TURNSTILE_SITE_KEY=1x00000000000000000000AA   (Cloudflare test key)
#
# Both of those shipped to production once and broke the site in ways that were
# invisible from the outside:
#
#   - The chat widget and the enquiry form POSTed to http://localhost:8000 from
#     a public HTTPS page. The requests never left the visitor's machine, so
#     Cloud Run logged nothing at all and the UI just said "Connection issue".
#   - Turnstile's "always passes" test key made the widget show a green tick,
#     issue a dummy token, and get rejected by the backend against the REAL
#     secret: 400 "Security check failed".
#
# craco.config.js used to load .env.local with `override: true`, which discarded
# real environment variables and made this impossible to fix from the command
# line. That is now fixed (shell > .env.local > .env), which is what lets the
# assignments below win.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# Empty on purpose: the app then calls /api/* as relative paths, and the Pages
# Function in frontend/functions/api/[[path]].js proxies them to Cloud Run on
# the same origin. No CORS, no backend hostname in the bundle.
export REACT_APP_BACKEND_URL=""
export REACT_APP_TURNSTILE_SITE_KEY="0x4AAAAAAD0Wkle1pzYPdSz5"
export GENERATE_SOURCEMAP="false"

export CLOUDFLARE_ACCOUNT_ID="b6fc4c1046c31137d720a93467d290f6"
if [[ -f .cloudflare-token ]]; then
  CLOUDFLARE_API_TOKEN="$(cat .cloudflare-token)"
  export CLOUDFLARE_API_TOKEN
else
  echo "  .cloudflare-token missing — create a token with Account > Cloudflare Pages > Edit" >&2
  exit 1
fi

echo "==> [1/3] Building"
# yarn is not installed on every machine; node_modules is already resolved, so
# build with the local craco binary rather than reinstalling. Do NOT `npm
# install` here — package.json relies on Yarn's `resolutions` field and npm
# ignores it, producing a broken build (see README.md).
( cd frontend && ./node_modules/.bin/craco build )

echo "==> [2/3] Checking the bundle for local-dev leakage"
node - <<'JS'
const fs = require("fs");
const dir = "frontend/build/static/js";
const file = fs.readdirSync(dir).find(f => /^main\..*\.js$/.test(f));
const src = fs.readFileSync(`${dir}/${file}`, "utf8");
const bad = [
  ["http://localhost:8000",       "local backend URL"],
  ["1x00000000000000000000AA",    "Turnstile TEST site key"],
];
let failed = false;
for (const [needle, what] of bad) {
  if (src.includes(needle)) { console.error(`    FAIL: ${what} is in ${file}`); failed = true; }
}
if (!src.includes("0x4AAAAAAD0Wkle1pzYPdSz5")) {
  console.error("    FAIL: production Turnstile site key is missing"); failed = true;
}
if (failed) { console.error("  Refusing to deploy a bundle built from .env.local values."); process.exit(1); }
console.log(`    ${file} is clean`);
JS

echo "==> [3/3] Deploying to Cloudflare Pages"
# Run wrangler from frontend/ so it picks up ./functions alongside ./build —
# from the repo root it would upload the assets without the /api proxy.
( cd frontend && npx --yes wrangler@latest pages deploy build \
    --project-name=latios-web --branch=master --commit-dirty=true )

echo
echo "==> Done — https://latios-web.pages.dev"
