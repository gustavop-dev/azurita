from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints irán aquí
    
    # Catch-all: todas las demás rutas van al frontend Vue
    path('', views.index, name='index'),
]
