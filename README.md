# Práctica: Servidor HTTP Simple

Este ejercicio te ayudará a aprender cómo crear un servidor web básico con Node.js sin usar frameworks.

## 🎯 Objetivo

Crear un servidor HTTP que responda a diferentes rutas y devuelva información sobre frutas.

## 📋 Rutas a implementar

1. `/` → Mensaje de bienvenida
2. `/frutas/all` → Lista de todas las frutas
3. `/frutas/id/123` → Buscar una fruta por ID
4. `/frutas/nombre/manzana` → Buscar frutas por nombre
5. `/frutas/existe/manzana` → Verificar si existe una fruta
6. Cualquier otra ruta → Error 404

## 🚀 Cómo empezar

1. Forkea y Clona este repositorio
2. Instala las dependencias: `npm install`
3. Inicia el servidor: `npm start`
4. Ejecuta los tests: `npm test`

## 💡 Pistas

- Usa `url.parse(req.url).pathname` para obtener la ruta
- Lee el archivo JSON con `fs.readFileSync`
- La búsqueda por nombre debe:
  - Funcionar con parte del nombre ("man" encuentra "manzana")
  - Ignorar mayúsculas/minúsculas ("MAN" encuentra "manzana")
- Devuelve siempre respuestas en formato JSON

## ✅ Ejemplo de respuestas

```javascript
// GET /
{ "mensaje": "Bienvenido a la API de frutas" }

// GET /frutas/all
[{ "id": 1, "nombre": "Manzana", "color": "rojo" }, ...]

// GET /frutas/id/1
{ "id": 1, "nombre": "Manzana", "color": "rojo" }

// GET /frutas/nombre/man
[{ "id": 1, "nombre": "Manzana", "color": "rojo" }]

// GET /frutas/existe/manzana
{ "existe": true }

// GET /ruta/invalida
{ "error": "Ruta no encontrada" }
```