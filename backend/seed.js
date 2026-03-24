const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Carga variables de entorno
dotenv.config();

// Importa el modelo
const Producto = require('./models/Producto'); 

// Conecta a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Conectado a MongoDB para poblar la BBDD'))
  .catch(err => {
    console.error('🔴 Error de conexión:', err);
    process.exit(1);
  });

const importarDatos = async () => {
  try {
    // 1. Borra todos los productos que hubiera antes (para no duplicar si ejecutas el script varias veces)
    await Producto.deleteMany();
    console.log('🧹 Base de datos limpiada.');

    // 2. Lee el archivo JSON
    const rutaArchivo = path.join(__dirname, 'data', 'productos.json');
    const datosJSON = fs.readFileSync(rutaArchivo, 'utf-8');
    let productos = JSON.parse(datosJSON);

    // 3. Borra el campo fecha_registro de los datos del JSON 
    // para obligar a Mongoose a usar su fecha automática (Date.now)
    productos = productos.map(producto => {
      delete producto.fecha_registro;
      return producto;
    });

    // 4. Inserta los datos en MongoDB usando el modelo
    await Producto.insertMany(productos);
    console.log('🍕 ¡Todos los productos han sido importados con éxito!');

    // 5. Desconecta y sale
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error('❌ Error importando los datos:', error);
    process.exit(1);
  }
};

// 6. Ejecuta la función
importarDatos();