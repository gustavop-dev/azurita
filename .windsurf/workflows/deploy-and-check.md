---
description: Deploy latest main to production server for azurita
---

# Deploy azurita to Production

Run these steps on the production server at `/home/ryzepeck/webapps/azurita` to deploy the latest `main` branch.

## Pre-Deploy

// turbo
1. Quick status snapshot before deploy:
```bash
bash /home/ryzepeck/webapps/ops/vps/scripts/diagnostics/quick-status.sh
```

## Deploy Steps

// turbo
2. Pull the latest code from master:
```bash
cd /home/ryzepeck/webapps/azurita && git pull origin main
```

3. Install backend dependencies and run migrations:
```bash
cd /home/ryzepeck/webapps/azurita && source venv/bin/activate && pip install -r requirements.txt && python manage.py migrate
```

4. Collect static files:
```bash
cd /home/ryzepeck/webapps/azurita && source venv/bin/activate && python manage.py collectstatic --noinput
```

5. Restart services:
```bash
sudo systemctl restart azurita && sudo systemctl restart azurita-huey
```

## Post-Deploy Verification

// turbo
6. Run post-deploy check:
```bash
bash /home/ryzepeck/webapps/ops/vps/scripts/deployment/post-deploy-check.sh azurita
```

7. If something fails, check the logs:
```bash
sudo journalctl -u azurita --no-pager -n 30
sudo journalctl -u azurita-huey --no-pager -n 30
sudo tail -20 /var/log/nginx/error.log
```

## Architecture Reference

- **Domain**: `azurita.projectapp.co`
- **Backend**: Django (`azurita_project` module), settings via `DJANGO_SETTINGS_MODULE=azurita_project.settings`
- **Frontend**: No separate frontend (Django templates)
- **Services**: `azurita.service` (Gunicorn via socket), `azurita-huey.service`
- **Nginx**: `/etc/nginx/sites-available/azurita`
- **Socket**: `/home/ryzepeck/webapps/azurita/azurita.sock`
- **Database**: SQLite (`backend/db.sqlite3`)
- **Resource limits**: MemoryMax=250MB, CPUQuota=40%, OOMScoreAdjust=300
- **Redis DB**: /6

## Notes

- VPS operations scripts live in `/home/ryzepeck/webapps/ops/vps/scripts/`.
- azurita uses SQLite (lightweight project), not MySQL.
- `manage.py` is at the repo root, not in `backend/`.
- WorkingDirectory for gunicorn is `/home/ryzepeck/webapps/azurita/backend`.
