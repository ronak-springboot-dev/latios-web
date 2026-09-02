#!/usr/bin/env bash
# Latios Web — single-command deploy / redeploy script.
#
#   First run on a fresh VM:   ./deploy.sh --init
#   Every redeploy after that: ./deploy.sh
#
# Idempotent: safe to re-run. Run from the repo root, on the target VM.

set -euo pipefail

DOMAIN="laptoptrek.com"
WWW_DOMAIN="www.laptoptrek.com"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-sales@latios.in}"

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

INIT=false
BUILD_FRONTEND=true
for arg in "$@"; do
  case "$arg" in
    --init)     INIT=true ;;
    # Use an existing frontend/build instead of compiling on this machine.
    # Building here costs ~719MB of node_modules on disk and a CRA webpack pass
    # that peaks well past a gigabyte of RAM — which is what forces a 4GB VM for
    # a site that only needs to RUN nginx plus one Python container. Build in CI
    # or on a workstation, rsync frontend/build up, then deploy with this flag
    # and the box can drop a tier.
    --no-build) BUILD_FRONTEND=false ;;
    *) echo "usage: $0 [--init] [--no-build]" >&2; exit 1 ;;
  esac
done

echo "==> [1/7] Checking Docker"
if ! command -v docker &> /dev/null; then
  echo "Docker not found — installing..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER" || true
fi
if ! docker compose version &> /dev/null; then
  echo "Docker Compose plugin not found — installing..."
  sudo apt-get update -y
  sudo apt-get install -y docker-compose-plugin
fi

echo "==> [2/7] Pulling latest code"
if [[ -d .git ]]; then
  git pull --ff-only || echo "  (skipped — not on a trackable branch, or local changes present)"
fi

echo "==> [3/7] Checking env files"
for f in backend/.env frontend/.env; do
  if [[ ! -f "$f" ]]; then
    echo "Missing $f — copy $f.sample to $f and fill in real values first." >&2
    exit 1
  fi
done

if $BUILD_FRONTEND; then
  echo "==> [4/7] Building frontend"
  # Yarn, not npm: frontend/package.json relies on Yarn's `resolutions` field to keep
  # transitive deps (e.g. ajv) consistent. `npm install`/`npm ci` ignore that field and
  # produce a broken build (missing ajv submodules) — see README.md.
  if ! command -v yarn &> /dev/null; then
    npm install -g yarn
  fi
  # GENERATE_SOURCEMAP=false: CRA ships .map files by default. They are pure
  # cost here — several MB added to the deploy, more peak build memory, and the
  # whole unminified source published to anyone who asks for it. Nothing in this
  # project debugs against production maps.
  ( cd frontend && yarn install --frozen-lockfile && GENERATE_SOURCEMAP=false yarn build )
else
  echo "==> [4/7] Skipping frontend build (--no-build)"
  if [[ ! -f frontend/build/index.html ]]; then
    echo "  frontend/build/index.html is missing — rsync a build up first, or drop --no-build." >&2
    exit 1
  fi
  echo "  Using existing frontend/build ($(du -sh frontend/build | cut -f1))"
fi

mkdir -p deploy/certbot-www

if $INIT; then
  echo "==> [5/7] First-time init: bringing up nginx in HTTP-only bootstrap mode"
  cp deploy/nginx.initial.conf deploy/nginx.active.conf
  docker compose up -d --build backend nginx

  echo "==> [6/7] Requesting TLS certificate via Let's Encrypt"
  docker compose run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
      -d $DOMAIN -d $WWW_DOMAIN \
      --email $CERTBOT_EMAIL --agree-tos --no-eff-email" certbot

  echo "==> Switching nginx to full HTTPS config"
  cp deploy/nginx.conf deploy/nginx.active.conf
  docker compose restart nginx
else
  echo "==> [5/7] Rebuilding and restarting services"
  cp deploy/nginx.conf deploy/nginx.active.conf
  docker compose up -d --build
  echo "==> [6/7] (skipped cert issuance — not an init run)"
fi

echo "==> [7/7] Health check"
docker compose ps
sleep 2
if curl -sf "https://$DOMAIN/api/" > /dev/null; then
  echo "OK: https://$DOMAIN/api/ is responding"
else
  echo "WARNING: health check failed — check: docker compose logs backend / docker compose logs nginx" >&2
fi

# Reclaim disk. Every redeploy rebuilds the backend image, and the superseded
# layers plus the build cache are what silently fill a small VM's disk — the
# 695MB dependency layer is rewritten whenever requirements.txt changes.
echo "==> Reclaiming disk"
docker image prune -f >/dev/null 2>&1 || true
docker builder prune -f --keep-storage 2GB >/dev/null 2>&1 || true
df -h / | awk 'NR==2 {print "  root filesystem: " $4 " free of " $2}'

echo "Done."
