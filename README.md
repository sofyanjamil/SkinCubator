# Production deployment: Next.js + n8n + Postgres + Traefik (TLS)

This repository is set up to deploy a production stack on a single VPS using Docker Compose.

- Next.js app at `https://app.yourdomain.com`
- n8n at `https://n8n.yourdomain.com`
- PostgreSQL 16 with persistent storage
- Traefik reverse proxy with automatic HTTPS via Let's Encrypt
- Next.js API proxy that forwards to n8n so the browser never talks to n8n directly

## Folder structure

```
/deploy
  ├─ .env.example
  ├─ docker-compose.yml
  ├─ traefik/
  │  └─ dynamic.yml
  ├─ scripts/
  │  ├─ bootstrap.sh
  │  └─ backup_db.sh
  ├─ nextjs/
  │  └─ Dockerfile
  └─ data/
     ├─ postgres/            # persisted DB (created at runtime)
     └─ n8n/                 # persisted n8n data (created at runtime)
```

Your Next.js app lives in `ai-parent-chat/`. The compose file is configured accordingly.

## DNS requirements

Create A records pointing to your VPS IP:

- `app.yourdomain.com`
- `n8n.yourdomain.com`

## VPS one-time install (Docker & Compose)

On Ubuntu 22.04+:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo \"$UBUNTU_CODENAME\") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

## Deploy

```bash
# on the VPS
git clone <your-repo> /srv/stack
cd /srv/stack/deploy
cp .env.example .env   # then edit secrets and domains
./scripts/bootstrap.sh
```

Open:

- `https://n8n.yourdomain.com` to finish n8n setup
- `https://app.yourdomain.com` to view the app

## Environment variables

Copy `deploy/.env.example` to `deploy/.env` and set:

- `DOMAIN`, `EMAIL`
- `DB_POSTGRESDB_PASSWORD`
- `N8N_ENCRYPTION_KEY`
- `N8N_INTERNAL_WEBHOOK` secret path
- Optional: timezone and other values

Never commit production `.env`.

## Backup

```bash
cd /srv/stack/deploy
./scripts/backup_db.sh
```

Backups are written to `deploy/data/pg-backups/`.

## Security checklist

- Rotate `N8N_ENCRYPTION_KEY` (long random) before first run
- Use a strong `DB_POSTGRESDB_PASSWORD`
- Restrict n8n credentials to least privilege
- Keep `EMAIL` valid (used by Let's Encrypt)
- Backups: cron `backup_db.sh` daily
- Updates periodically: `docker compose pull && docker compose up -d`
- Traefik dashboard is not exposed by default

## Optional: GitHub Action to build & push Next.js image

A workflow is included at `.github/workflows/nextjs-build.yml` that builds and pushes a Next.js image to GHCR on changes under `deploy/nextjs/**`.

To switch compose to pull the registry image instead of building locally, change the `nextjs` service in `deploy/docker-compose.yml` from `build:` to `image: ghcr.io/<owner>/your-nextjs:latest`.

## API proxy route

The Next.js API route at `ai-parent-chat/pages/api/submit.ts` forwards POST bodies to n8n using `process.env.N8N_INTERNAL_WEBHOOK`.

## Created files (diff summary)

- `deploy/.env.example`
- `deploy/traefik/dynamic.yml`
- `deploy/docker-compose.yml`
- `deploy/nextjs/Dockerfile`
- `deploy/scripts/bootstrap.sh`
- `deploy/scripts/backup_db.sh`
- `ai-parent-chat/pages/api/submit.ts`
- `.github/workflows/nextjs-build.yml`

Additionally, `ai-parent-chat/package.json` start script was set to `next start -p 3000`.


