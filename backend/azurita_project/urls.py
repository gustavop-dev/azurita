from django.conf import settings
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

from . import views


def health_check(request):
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health-check'),

    # Catch-all: todas las demás rutas van al frontend Vue
    path('', views.index, name='index'),
]

if getattr(settings, 'ENABLE_SILK', False):
    urlpatterns.insert(2, path('silk/', include('silk.urls', namespace='silk')))
