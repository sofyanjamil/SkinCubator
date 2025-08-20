#!/usr/bin/env bash
set -euo pipefail
mkdir -p ./data/pg-backups
docker compose exec -T postgres \
  pg_dump -U "${DB_POSTGRESDB_USER}" -d "${DB_POSTGRESDB_DATABASE}" \
  | gzip > ./data/pg-backups/backup-$(date +%F).sql.gz
echo "Backup written to ./data/pg-backups"


