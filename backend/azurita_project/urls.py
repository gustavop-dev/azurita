import os

from django.conf import settings
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

from . import views


def health_check(request):
    # 'project'/'environment' let external probes verify WHO answered: a shared
    # codebase means the project name alone cannot tell prod from staging
    # (measured: /qa pilot #3).
    return JsonResponse({
        'status': 'ok',
        'project': settings.BASE_DIR.parent.name,
        # settings first: DJANGO_ENV lives in backend/.env and is read by
        # decouple, and the systemd units never export it, so os.getenv alone
        # would report 'development' in production.
        'environment': getattr(
            settings, 'DJANGO_ENV', os.getenv('DJANGO_ENV', 'development')
        ),
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health-check'),

    # Catch-all: todas las demás rutas van al frontend Vue
    path('', views.index, name='index'),
]

if getattr(settings, 'ENABLE_SILK', False):
    urlpatterns.insert(2, path('silk/', include('silk.urls', namespace='silk')))
