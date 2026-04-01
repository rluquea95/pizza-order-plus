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

// Función que convierte una cadena de texto en un array de Strings ("tomate, queso" -> ["tomate", "queso"])
const transformarArray = (texto) => {
  if (!texto || typeof texto !== 'string') return [];
  return texto.split(',').map(item => item.trim().toLowerCase()).filter(item => item !== "");
};

const importarDatos = async () => {
  try {
    //Borra todos los productos que hubiera antes (para no duplicar si se ejecuta varias veces el script)
    await Producto.deleteMany();
    await Ingrediente.deleteMany();
    await Alergeno.deleteMany();
    console.log('🧹 Base de datos limpiada.');

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
    const alergenosInsertados = await Alergeno.insertMany(alergenos);
    console.log('⚠️ ¡Todos los alérgenos han sido importados con éxito!');

    // Almacena el ID del alérgeno generado en MongoDB: { "gluten": "60d5ec...", "apio": "60d5ed..." }
    const mapaAlergenos = {};
    alergenosInsertados.forEach(a => {
      mapaAlergenos[a.alergeno.toLowerCase()] = a._id;
    });


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
      
      // 1. Relacionar Alergenos
      // Sustituye el nombre de los alergenos por la referencia en Alergenos
      const arrayAlergenos = transformarArray(ingrediente.alergenos);
      ingrediente.alergenos = arrayAlergenos.map(nombre => mapaAlergenos[nombre]).filter(id => id);

      return ingrediente;
    });

    // Inserta los ingredientes en MongoDB
    const ingredientesInsertados = await Ingrediente.insertMany(ingredientes);
    console.log('🧅 ¡Todos los ingredientes han sido importados con éxito!');

    // Almacena el ID del ingrediente generado en MongoDB: : { "salsa de tomate": "60d...", "mozzarella": "60e..." }
    const mapaIngredientes = {};
    ingredientesInsertados.forEach(i => {
      mapaIngredientes[i.ingrediente.toLowerCase()] = i._id;
    });

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

      // 1. Relacionar INGREDIENTES
      // Sustituye el nombre de los ingredientes por la referencia en Ingredientes
      const arrayIngredientes = transformarArray(producto.ingredientes);
      producto.ingredientes = arrayIngredientes.map(nombre => mapaIngredientes[nombre]).filter(id => id);

      // 2. Relacionar ALÉRGENOS
      // Sustituye el nombre de los alergenos por la referencia en Alergenos
      const arrayAlergenos = transformarArray(producto.alergenos);
      let alergenosIds = arrayAlergenos.map(nombre => mapaAlergenos[nombre]).filter(id => id);

      // Si la categoría es PIZZA y existe el alérgeno gluten en nuestro diccionario...
      if (producto.categoria === 'PIZZA' && mapaAlergenos['gluten']) {
        const idGluten = mapaAlergenos['gluten'];
        // Si la pizza no tiene ya el gluten en su lista, se lo añadimos a la fuerza
        if (!alergenosIds.includes(idGluten)) {
          alergenosIds.push(idGluten);
        }
      }
      
      // Guardamos la lista definitiva de IDs de alérgenos en el producto
      producto.alergenos = alergenosIds;

      return producto;
    });

    // Inserta los productos en MongoDB
    await Producto.insertMany(productos);
    console.log('🍕 ¡Todos los productos han sido importados con éxito!');

    // Desconecta y sale
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error('❌ Error importando los datos:', error);
    process.exit(1);
  }
};

// Ejecuta la función
importarDatos();