# Azurita - Calendario de Adviento Interactivo 🎄

Proyecto especial de calendario de adviento con puzzles diarios del 28 de noviembre al 13 de diciembre.

## Estructura del Proyecto

- **advent-calendar/** - Frontend Vue 3 + TypeScript + Tailwind CSS
- **backend/** - Backend Django + Django REST Framework
- **puzzles/** - App Django para gestión de puzzles

## Frontend (Vue)

### Características
- Cuenta regresiva interactiva hasta el 1 de diciembre de 2025
- Tarjetas arrastrables con física GSAP
- Cursor personalizado estilo Apple
- Colisiones entre elementos
- Diseño flat 2D con colores navideños

### Instalación
```bash
cd advent-calendar
npm install
npm run dev
```

## Backend (Django)

### Características
- API REST para gestión de puzzles
- Control de progreso de puzzles completados
- CORS configurado para desarrollo

### Instalación
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Desarrollo

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## Tecnologías

- Vue 3 + TypeScript
- Tailwind CSS
- GSAP (animaciones)
- Django 5.2
- Django REST Framework
