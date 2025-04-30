const http = require('http');
const assert = require('assert');

// Función para hacer peticiones HTTP
function realizarPeticion (path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // Intentar parsear siempre, incluso si es un error, ya que la API devuelve JSON en errores 400/404
          const body = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        } catch (error) {
          // Si no se puede parsear JSON, rechazar con un error que incluya los datos brutos
          reject(new Error(`Error parseando JSON de ${path}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

// Ejecutar los tests
async function ejecutarTests () {
  console.log('Iniciando tests de la API de Frutas...\n');
  let testsPasados = 0;
  // Actualizar el total de tests esperados
  const totalTests = 15;

  try {
    // --- Tests de la ruta '/' ---
    console.log('--- Test: Ruta Principal ---');
    try {
      const res = await realizarPeticion('/');
      assert.strictEqual(res.statusCode, 200, 'Test /: Status code debe ser 200');
      assert(res.body && typeof res.body.mensaje === 'string', 'Test /: Body debe contener un mensaje');
      console.log('✅ Ruta principal OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Ruta principal falló:', error.message);
    }
    console.log(''); // Espacio en blanco para mejor legibilidad

    // --- Tests de la ruta '/frutas/all' ---
    console.log('--- Test: Obtener Todas las Frutas ---');
    try {
      const res = await realizarPeticion('/frutas/all');
      assert.strictEqual(res.statusCode, 200, 'Test /frutas/all: Status code debe ser 200');
      assert(Array.isArray(res.body), 'Test /frutas/all: Body debe ser un array');
      assert(res.body.length > 0, 'Test /frutas/all: El array no debe estar vacío');
      console.log('✅ Obtener todas las frutas OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Obtener todas las frutas falló:', error.message);
    }
    console.log('');

    // --- Tests de la ruta '/frutas/id/:id' ---
    console.log('--- Test: Obtener Fruta por ID ---');
    try {
      // Test: ID existente
      const res = await realizarPeticion('/frutas/id/1');
      assert.strictEqual(res.statusCode, 200, 'Test /frutas/id/1: Status code debe ser 200');
      assert.strictEqual(res.body.id, 1, 'Test /frutas/id/1: El ID de la fruta debe ser 1');
      assert(typeof res.body.nombre === 'string', 'Test /frutas/id/1: Body debe ser un objeto fruta');
      console.log('✅ Obtener fruta por ID existente OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Obtener fruta por ID existente falló:', error.message);
    }

    try {
      // Test: ID no existente
      const res = await realizarPeticion('/frutas/id/999');
      assert.strictEqual(res.statusCode, 404, 'Test /frutas/id/999: Status code debe ser 404');
      assert(res.body && typeof res.body.error === 'string', 'Test /frutas/id/999: Body debe contener un mensaje de error');
      console.log('✅ Obtener fruta por ID no existente OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Obtener fruta por ID no existente falló:', error.message);
    }

    try {
      // Test: ID no numérico
      const res = await realizarPeticion('/frutas/id/invalid-id');
      assert.strictEqual(res.statusCode, 400, 'Test /frutas/id/invalid-id: Status code debe ser 400');
      assert(res.body && typeof res.body.error === 'string', 'Test /frutas/id/invalid-id: Body debe contener un mensaje de error');
      console.log('✅ Obtener fruta por ID no numérico OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Obtener fruta por ID no numérico falló:', error.message);
    }
    console.log('');

    // --- Tests de la ruta '/frutas/nombre/:nombre' ---
    console.log('--- Test: Buscar Frutas por Nombre (Parcial) ---');
    try {
      // Test: Búsqueda que encuentra múltiples resultados
      const res = await realizarPeticion('/frutas/nombre/a');
      assert.strictEqual(res.statusCode, 200, 'Test /frutas/nombre/a: Status code debe ser 200');
      assert(Array.isArray(res.body), 'Test /frutas/nombre/a: Body debe ser un array');
      assert(res.body.length > 1, 'Test /frutas/nombre/a: Debe encontrar más de una fruta'); // Esperamos más de 1 para 'a'
      console.log('✅ Buscar por nombre (múltiples resultados) OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Buscar por nombre (múltiples resultados) falló:', error.message);
    }

    try {
      // Test: Búsqueda que encuentra un resultado
      const res = await realizarPeticion('/frutas/nombre/banana');
      assert.strictEqual(res.statusCode, 200, 'Test /frutas/nombre/banana: Status code debe ser 200');
      assert(Array.isArray(res.body), 'Test /frutas/nombre/banana: Body debe ser un array');
      assert.strictEqual(res.body.length, 1, 'Test /frutas/nombre/banana: Debe encontrar exactamente una fruta');
      assert.strictEqual(res.body[0].nombre, 'banana', 'Test /frutas/nombre/banana: La fruta encontrada debe ser "banana"');
      console.log('✅ Buscar por nombre (un resultado) OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Buscar por nombre (un resultado) falló:', error.message);
    }


    try {
      // Test: Búsqueda parcial case-insensitive
      const res = await realizarPeticion('/frutas/nombre/MANZ');
      assert.strictEqual(res.statusCode, 200, 'Test /frutas/nombre/MANZ: Status code debe ser 200');
      assert(Array.isArray(res.body), 'Test /frutas/nombre/MANZ: Body debe ser un array');
      assert(res.body.length > 0, 'Test /frutas/nombre/MANZ: Debe encontrar frutas (manzana, manzana verde)');
      console.log('✅ Buscar por nombre (case-insensitive) OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Buscar por nombre (case-insensitive) falló:', error.message);
    }

    try {
      // Test: Búsqueda que no encuentra resultados
      const res = await realizarPeticion('/frutas/nombre/platano');
      assert.strictEqual(res.statusCode, 200, 'Test /frutas/nombre/platano: Status code debe ser 200'); // Esperamos 200 con array vacío
      assert(Array.isArray(res.body), 'Test /frutas/nombre/platano: Body debe ser un array');
      assert.strictEqual(res.body.length, 0, 'Test /frutas/nombre/platano: El array debe estar vacío');
      console.log('✅ Buscar por nombre (sin resultados) OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Buscar por nombre (sin resultados) falló:', error.message);
    }
    console.log('');

    // --- Tests de la ruta '/frutas/existe/:nombre' ---
    console.log('--- Test: Verificar Existencia de Fruta ---');
    try {
      // Test: Existe (nombre exacto)
      const res = await realizarPeticion('/frutas/existe/manzana');
      assert.strictEqual(res.statusCode, 200, 'Test /frutas/existe/manzana: Status code debe ser 200');
      assert.strictEqual(typeof res.body.existe, 'boolean', 'Test /frutas/existe/manzana: Body debe tener propiedad "existe" booleana');
      assert.strictEqual(res.body.existe, true, 'Test /frutas/existe/manzana: La propiedad "existe" debe ser true');
      console.log('✅ Verificar existencia (existe) OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Verificar existencia (existe) falló:', error.message);
    }

    try {
      // Test: Existe (nombre exacto case-insensitive)
      const res = await realizarPeticion('/frutas/existe/BaNaNa');
      assert.strictEqual(res.statusCode, 200, 'Test /frutas/existe/BaNaNa: Status code debe ser 200');
      assert.strictEqual(typeof res.body.existe, 'boolean', 'Test /frutas/existe/BaNaNa: Body debe tener propiedad "existe" booleana');
      assert.strictEqual(res.body.existe, true, 'Test /frutas/existe/BaNaNa: La propiedad "existe" debe ser true');
      console.log('✅ Verificar existencia (case-insensitive) OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Verificar existencia (case-insensitive) falló:', error.message);
    }

    try {
      // Test: No existe
      const res = await realizarPeticion('/frutas/existe/kiwi');
      assert.strictEqual(res.statusCode, 200, 'Test /frutas/existe/kiwi: Status code debe ser 200');
      assert.strictEqual(typeof res.body.existe, 'boolean', 'Test /frutas/existe/kiwi: Body debe tener propiedad "existe" booleana');
      assert.strictEqual(res.body.existe, false, 'Test /frutas/existe/kiwi: La propiedad "existe" debe ser false');
      console.log('✅ Verificar existencia (no existe) OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Verificar existencia (no existe) falló:', error.message);
    }

    try {
      // Test: Búsqueda exacta con nombre parcial existente en datos
      const res = await realizarPeticion('/frutas/existe/manz');
      assert.strictEqual(res.statusCode, 200, 'Test /frutas/existe/manz: Status code debe ser 200');
      assert.strictEqual(typeof res.body.existe, 'boolean', 'Test /frutas/existe/manz: Body debe tener propiedad "existe" booleana');
      assert.strictEqual(res.body.existe, false, 'Test /frutas/existe/manz: La propiedad "existe" debe ser false (búsqueda exacta)');
      console.log('✅ Verificar existencia (nombre parcial, búsqueda exacta) OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Verificar existencia (nombre parcial, búsqueda exacta) falló:', error.message);
    }
    console.log('');

    // --- Tests de rutas no existentes (404) ---
    console.log('--- Test: Rutas No Existentes ---');
    try {
      // Test: Ruta inexistente general
      const res = await realizarPeticion('/ruta/invalida');
      assert.strictEqual(res.statusCode, 404, 'Test /ruta/invalida: Status code debe ser 404');
      assert(res.body && typeof res.body.error === 'string', 'Test /ruta/invalida: Body debe contener un mensaje de error');
      console.log('✅ Manejo de ruta no existente general OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Manejo de ruta no existente general falló:', error.message);
    }

    try {
      // Test: Ruta con prefijo /frutas/ pero inexistente
      const res = await realizarPeticion('/frutas/otro/camino');
      assert.strictEqual(res.statusCode, 404, 'Test /frutas/otro/camino: Status code debe ser 404');
      assert(res.body && typeof res.body.error === 'string', 'Test /frutas/otro/camino: Body debe contener un mensaje de error');
      console.log('✅ Manejo de ruta /frutas/ inexistente OK');
      testsPasados++;
    } catch (error) {
      console.error('❌ Manejo de ruta /frutas/ inexistente falló:', error.message);
    }

  } catch (error) {
    console.error('Error general ejecutando los tests:', error);
  }

  // Mostrar resumen
  console.log(`\n--- Resumen: ${testsPasados} de ${totalTests} tests pasados ---`);
  // Terminar el proceso para asegurar que el script finaliza
  process.exit(testsPasados === totalTests ? 0 : 1); // Salir con código 0 si todos pasaron, 1 si falló alguno
}

// Esperar un poco para asegurar que el servidor esté completamente listo antes de iniciar los tests
// Este timeout puede necesitar ajustarse dependiendo de tu sistema y la carga.
setTimeout(ejecutarTests, 1000);