const http = require('http');
const url = require('url');
const fs = require('fs');

// Leer y parsear frutas.json una sola vez al inicio
const frutas = JSON.parse(fs.readFileSync('./frutas.json', 'utf-8'));

// Crear servidor
const servidor = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  res.setHeader('Content-Type', 'application/json');

  // Ruta de bienvenida
  if (pathname === '/') {
    res.statusCode = 200;
    res.end(JSON.stringify({ mensaje: 'Bienvenido al servidor de frutas 🍉🍌🍎' }));
    return;
  }

  // Ruta /frutas/all => devuelve todo
  if (pathname === '/frutas/all') {
    res.statusCode = 200;
    res.end(JSON.stringify(frutas));
    return;
  }

  // Ruta /frutas/id/:numero
  if (pathname.startsWith('/frutas/id/')) {
    const partes = pathname.split('/');
    const id = parseInt(partes[3]);
    const fruta = frutas.find(f => f.id === id);
    if (fruta) {
      res.statusCode = 200;
      res.end(JSON.stringify(fruta));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: `No existe fruta con id ${id}` }));
    }
    return;
  }

  // Ruta /frutas/nombre/:nombre (búsqueda parcial, case insensitive)
  if (pathname.startsWith('/frutas/nombre/')) {
    const partes = pathname.split('/');
    const nombreBuscado = decodeURIComponent(partes[3]).toLowerCase();
    const coincidencias = frutas.filter(f => f.nombre.toLowerCase().includes(nombreBuscado));
    res.statusCode = 200;
    res.end(JSON.stringify(coincidencias));
    return;
  }

  // Ruta /frutas/existe/:nombre (exacto, case insensitive)
  if (pathname.startsWith('/frutas/existe/')) {
    const partes = pathname.split('/');
    const nombreBuscado = decodeURIComponent(partes[3]).toLowerCase();
    const existe = frutas.some(f => f.nombre.toLowerCase() === nombreBuscado);
    res.statusCode = 200;
    res.end(JSON.stringify({ existe }));
    return;
  }

  // Cualquier otra ruta
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

// Iniciar servidor
const PORT = 3000;
servidor.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Rutas:');
  console.log('- /frutas/all');
  console.log('- /frutas/id/:id');
  console.log('- /frutas/nombre/:nombre');
  console.log('- /frutas/existe/:nombre');
});