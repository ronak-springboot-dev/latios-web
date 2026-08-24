#!/usr/bin/env bash
# Renews the Let's Encrypt cert (Certbot) and reloads nginx. Certs auto-renew only
# if something actually runs this periodically — set up a cron job on the VM:
#   0 3 * * * /path/to/repo/deploy/renew.sh >> /var/log/latios-renew.log 2>&1

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

docker compose run --rm --entrypoint "certbot renew --webroot -w /var/www/certbot" certbot
docker compose exec nginx nginx -s reload
