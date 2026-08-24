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
if [[ "${1:-}" == "--init" ]]; then
  INIT=true
fi

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

echo "==> [4/7] Building frontend"
( cd frontend && npm ci && npm run build )

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

echo "Done."
