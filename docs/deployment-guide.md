# Deployment Guide — azurita

Instructions for deploying azurita to production.

---

## Prerequisites

- Ubuntu/Debian with Python 3.12+, Nginx
- SSL certificate (Let's Encrypt via certbot)
- Domain: `azurita.projectapp.co`

---

## Deploy from main

```bash
cd /home/ryzepeck/webapps/azurita
git pull origin main

# Backend
cd backend
source ../venv/bin/activate
pip install -r ../requirements.txt
python ../manage.py migrate
python ../manage.py collectstatic --noinput

# Restart services
sudo systemctl restart azurita
sudo systemctl restart azurita-huey
```

## Environment Variables

All variables are loaded from `backend/.env` via `python-decouple`.
See `backend/.env.example` for the full list.
