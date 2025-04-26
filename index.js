const http = require('http');
const url = require('url');

// Cambiar esta función por la lectura del archivo de frutas con fs
function leerFrutas() { 
  const frutasData = [
    { id: 1, nombre: 'manzana', color: 'rojo' },
    { id: 2, nombre: 'banana', color: 'amarillo' },
    { id: 3, nombre: 'naranja', color: 'naranja' },
    { id: 4, nombre: 'uva', color: 'morado' },
    { id: 5, nombre: 'fresa', color: 'rojo' },
    { id: 6, nombre: 'manzana verde', color: 'verde' }
  ];
  console.log("Simulando lectura de frutas...");
  return frutasData;
}

// Crear el servidor HTTP
const servidor = http.createServer((req, res) => {
  // Configurar el header de respuesta como JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Obtener la ruta de la URL
  const path = url.parse(req.url).pathname;
  
  // TODO: Implementar el manejo de las siguientes rutas:
  // 1. '/' - Mensaje de bienvenida
  // 2. '/frutas/all' - Devolver todas las frutas
  // 3. '/frutas/id/123' - Devolver una fruta por su ID
  // 4. '/frutas/nombre/manzana' - Buscar frutas por nombre (parcial)
  // 5. '/frutas/existe/manzana' - Verificar si existe una fruta
  // 6. Cualquier otra ruta - Error 404
  
  // Por ahora, devolvemos un 404 para todas las rutas
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

// Iniciar el servidor
const PUERTO = 3000;
servidor.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}/`);
  console.log(`Rutas disponibles:`);
  console.log(`- http://localhost:${PUERTO}/`);
  console.log(`- http://localhost:${PUERTO}/frutas/all`);
  console.log(`- http://localhost:${PUERTO}/frutas/id/:id`);
  console.log(`- http://localhost:${PUERTO}/frutas/nombre/:nombre`);
  console.log(`- http://localhost:${PUERTO}/frutas/existe/:nombre`);
});