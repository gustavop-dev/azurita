# Instrucciones de Build para Producción

## Compilar Frontend Vue

1. Navegar a la carpeta del frontend:
```bash
cd advent-calendar
```

2. Instalar dependencias (si no lo has hecho):
```bash
npm install
```

3. Compilar para producción:
```bash
npm run build
```

Esto generará:
- **`static/frontend/`** - Archivos JS, CSS y assets con hash
- **`templates/index.html`** - Template Django con sintaxis `{% load static %}`

## Ejecutar Django

1. Volver a la raíz del proyecto:
```bash
cd ..
```

2. Activar entorno virtual:
```bash
source venv/bin/activate
```

3. Aplicar migraciones (primera vez):
```bash
python manage.py migrate
```

4. Ejecutar servidor:
```bash
python manage.py runserver
```

5. Abrir en navegador:
```
http://127.0.0.1:8000/
```

## Estructura de Archivos

```
azurita/
├── advent-calendar/          # Frontend Vue
│   ├── src/
│   ├── vite.config.ts       # Configuración de build
│   └── vite-plugin-django.ts # Plugin para Django templates
├── backend/                  # Django settings
├── static/
│   └── frontend/            # Assets compilados (generado)
│       ├── assets/          # JS, CSS con hash
│       └── manifest.json    # Mapeo de archivos
├── templates/
│   └── index.html           # Template Django (generado)
└── manage.py
```

## Notas

- Los archivos en `static/frontend/` y `templates/index.html` son generados automáticamente
- No editar estos archivos manualmente
- Están en `.gitignore` para no subirlos al repositorio
- El plugin `vite-plugin-django.ts` convierte automáticamente las rutas a sintaxis Django
