#!/usr/bin/env bash
set -euo pipefail

# Ensure folders exist
mkdir -p ./data/letsencrypt ./data/postgres ./data/n8n

# Pull latest images & start
docker compose pull
docker compose up -d

echo "Open https://n8n.${DOMAIN} to finish n8n setup."
echo "Open https://app.${DOMAIN} to view the app."


