"""Production-specific settings for azurita_project.

Imported automatically by ``settings.py`` when ``DJANGO_ENV == 'production'``.
"""

from decouple import config as _config

# ---------------------------------------------------------------------------
# DEBUG — hardcoded to False, never from environment
# ---------------------------------------------------------------------------
DEBUG = False

# ---------------------------------------------------------------------------
# Required settings — fail fast if missing
# ---------------------------------------------------------------------------
if not _config('DJANGO_SECRET_KEY', default=''):
    raise ValueError('DJANGO_SECRET_KEY is required in production')
if not _config('DJANGO_ALLOWED_HOSTS', default=''):
    raise ValueError('DJANGO_ALLOWED_HOSTS is required in production')

# ---------------------------------------------------------------------------
# Security hardening
# ---------------------------------------------------------------------------
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31_536_000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
