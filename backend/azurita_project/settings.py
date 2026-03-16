"""Django base settings for azurita_project.

Shared settings used by both development and production environments.
Environment-specific overrides are auto-imported at the end of this file
from ``settings_dev.py`` or ``settings_prod.py`` based on the
``DJANGO_ENV`` environment variable.
"""

import os
from pathlib import Path

from decouple import Csv, config
from huey import RedisHuey

BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# Environment detection
# ---------------------------------------------------------------------------
DJANGO_ENV = config('DJANGO_ENV', default='development')
IS_PRODUCTION = DJANGO_ENV == 'production'

# ---------------------------------------------------------------------------
# Core Django settings
# ---------------------------------------------------------------------------
SECRET_KEY = config('DJANGO_SECRET_KEY', default='change-me')
DEBUG = config('DJANGO_DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('DJANGO_ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Operations
    'dbbackup',
    'huey.contrib.djhuey',
    'azurita_project.apps.AzuritaProjectConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'azurita_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'azurita_project.wsgi.application'


# Database — SQLite (azurita is a lightweight project)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static files
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']

STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
    },
    'dbbackup': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
        'OPTIONS': {
            'location': config('BACKUP_STORAGE_PATH', default='/var/backups/azurita'),
        },
    },
}

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------------------------------------------------------------
# Huey — task queue
# ---------------------------------------------------------------------------
HUEY = RedisHuey(
    name='azurita',
    url=config('REDIS_URL', default='redis://localhost:6379/6'),
    immediate=not IS_PRODUCTION,
)

# ---------------------------------------------------------------------------
# Backups (django-dbbackup) — SQLite supported
# ---------------------------------------------------------------------------
# Storage is configured via STORAGES['dbbackup'] above (new-style API).
DBBACKUP_CLEANUP_KEEP = 4

# ---------------------------------------------------------------------------
# Silk profiling (conditional)
# ---------------------------------------------------------------------------
ENABLE_SILK = config('ENABLE_SILK', default=False, cast=bool)

if ENABLE_SILK:
    INSTALLED_APPS.append('silk')
    MIDDLEWARE.insert(0, 'silk.middleware.SilkyMiddleware')

    SILKY_PYTHON_PROFILER = False
    SILKY_PYTHON_PROFILER_BINARY = False
    SILKY_META = False
    SILKY_ANALYZE_QUERIES = True

    SILKY_AUTHENTICATION = True
    SILKY_AUTHORISATION = True

    def silk_permissions(user):
        return user.is_staff

    SILKY_PERMISSIONS = silk_permissions

    SILKY_MAX_RECORDED_REQUESTS = 10_000
    SILKY_IGNORE_PATHS = ['/admin/', '/static/', '/media/', '/silk/']
    SILKY_MAX_REQUEST_BODY_SIZE = 0
    SILKY_MAX_RESPONSE_BODY_SIZE = 0

    SLOW_QUERY_THRESHOLD_MS = 500
    N_PLUS_ONE_THRESHOLD = 10

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
LOG_LEVEL = config('DJANGO_LOG_LEVEL', default='INFO')

(BASE_DIR / 'logs').mkdir(exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'backup_file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'backups.log',
            'maxBytes': 5 * 1024 * 1024,
            'backupCount': 3,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': LOG_LEVEL,
        },
        'backups': {
            'handlers': ['backup_file', 'console'],
            'level': 'INFO',
        },
    },
}


# ---------------------------------------------------------------------------
# Environment-specific settings (auto-imported)
# ---------------------------------------------------------------------------
if IS_PRODUCTION:
    from .settings_prod import *  # noqa: F401, F403
else:
    from .settings_dev import *  # noqa: F401, F403
