const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Carga variables de entorno
dotenv.config();

// Importa los modelos
const Producto = require('./models/Producto');
const Ingrediente = require('./models/Ingrediente');
const Alergeno = require('./models/Alergeno');

// Conecta a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Conectado a MongoDB para poblar la BBDD'))
  .catch(err => {
    console.error('🔴 Error de conexión:', err);
    process.exit(1);
  });

const importarDatos = async () => {
  try {
    //Borra todos los productos que hubiera antes (para no duplicar si ejecutas el script varias veces)
    await Producto.deleteMany();
    await Ingrediente.deleteMany();
    await Alergeno.deleteMany(); 
    console.log('🧹 Base de datos limpiada.');

    // ==========================================
    // IMPORTAR PRODUCTOS
    // ==========================================
    const rutaProductos = path.join(__dirname, 'data', 'productos.json');
    const datosProductos = fs.readFileSync(rutaProductos, 'utf-8');
    let productos = JSON.parse(datosProductos);

    // Borra el campo fecha_registro de los datos del JSON 
    // para obligar a Mongoose a usar su fecha automática (Date.now)
    productos = productos.map(producto => {
      delete producto.fecha_registro;
      return producto;
    });

    // Inserta los productos en MongoDB
    await Producto.insertMany(productos);
    console.log('🍕 ¡Todos los productos han sido importados con éxito!');

    // ==========================================
    // IMPORTAR INGREDIENTES
    // ==========================================
    const rutaIngredientes = path.join(__dirname, 'data', 'ingredientes.json');
    const datosIngredientes = fs.readFileSync(rutaIngredientes, 'utf-8');
    let ingredientes = JSON.parse(datosIngredientes);

    // Borra el campo fecha_registro de los datos del JSON 
    // para obligar a Mongoose a usar su fecha automática (Date.now)
    ingredientes = ingredientes.map(ingrediente => {
      delete ingrediente.fecha_registro;
      return ingrediente;
    });

    // Inserta los ingredientes en MongoDB
    await Ingrediente.insertMany(ingredientes);
    console.log('🧅 ¡Todos los ingredientes han sido importados con éxito!');

    // ==========================================
    // IMPORTAR ALÉRGENOS
    // ==========================================
    const rutaAlergenos = path.join(__dirname, 'data', 'alergenos.json');
    const datosAlergenos = fs.readFileSync(rutaAlergenos, 'utf-8');
    let alergenos = JSON.parse(datosAlergenos);

    // Borra el campo fecha_registro de los datos del JSON 
    // para obligar a Mongoose a usar su fecha automática (Date.now)
    alergenos = alergenos.map(alergeno => {
      delete alergeno.fecha_registro;
      return alergeno;
    });

    // Inserta los alergenos en MongoDB
    await Alergeno.insertMany(alergenos);
    console.log('⚠️ ¡Todos los alérgenos han sido importados con éxito!');

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