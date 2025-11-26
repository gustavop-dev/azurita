import type { Plugin } from 'vite'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'

export default function viteDjangoPlugin(): Plugin {
  return {
    name: 'vite-django-plugin',
    apply: 'build',
    closeBundle() {
      // Leer el index.html generado
      const distPath = resolve(__dirname, '../static/frontend/index.html')
      const templatesPath = resolve(__dirname, '../templates/index.html')
      
      try {
        let html = readFileSync(distPath, 'utf-8')
        
        // Agregar {% load static %} al inicio
        html = html.replace(
          '<!DOCTYPE html>',
          '{% load static %}\n<!DOCTYPE html>'
        )
        
        // Reemplazar rutas de assets con {% static %}
        // Para CSS
        html = html.replace(
          /href="\/static\/frontend\/assets\/(.*?)"/g,
          'href="{% static \'frontend/assets/$1\' %}"'
        )
        
        // Para JS
        html = html.replace(
          /src="\/static\/frontend\/assets\/(.*?)"/g,
          'src="{% static \'frontend/assets/$1\' %}"'
        )
        
        // Para modulepreload
        html = html.replace(
          /href="\/static\/frontend\/assets\/(.*?)"/g,
          'href="{% static \'frontend/assets/$1\' %}"'
        )
        
        // Crear directorio templates si no existe
        mkdirSync(dirname(templatesPath), { recursive: true })
        
        // Guardar en templates/
        writeFileSync(templatesPath, html)
        console.log('✅ index.html movido a templates/ con sintaxis Django')
        
      } catch (error) {
        console.error('Error procesando index.html:', error)
      }
    }
  }
}
