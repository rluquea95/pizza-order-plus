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
const Pedido = require('./models/Pedido');
const Usuario = require('./models/Usuario');

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
    await Pedido.deleteMany();
    await Producto.deleteMany();
    await Ingrediente.deleteMany();
    await Alergeno.deleteMany();
    await Usuario.deleteMany();
    console.log('🧹 Base de datos limpiada.');

    // ==========================================
    // 1. IMPORTAR USUARIOS POR DEFECTO
    // ==========================================
    console.log('👤 Creando usuarios por defecto (Admin y Cliente)...');
    const usuariosPorDefecto = [
      {
        nombre: 'Admin',
        apellidos: 'Principal',
        fecha_nacimiento: new Date('1990-01-01'),
        telefono: '600000000',
        email: 'admin@pizzaorder.com',
        password: 'Password123*',
        rol: 'ADMIN',
        direccion: [{
          tipo_via: 'Calle',
          calle: 'Principal',
          numero: '1',
          codigo_postal: '41580',
          ciudad: 'Casariche'
        }]
      },
      {
        nombre: 'Cliente',
        apellidos: 'De Prueba',
        fecha_nacimiento: new Date('1995-05-05'),
        telefono: '611111111',
        email: 'cliente@pizzaorder.com',
        password: 'Password123*',
        rol: 'CLIENTE',
        direccion: [{
          tipo_via: 'Avenida',
          calle: 'Secundaria',
          numero: '2',
          codigo_postal: '41580',
          ciudad: 'Casariche'
        }]
      }
    ];

    await Usuario.create(usuariosPorDefecto);
    console.log('✅ Usuarios de prueba creados con éxito.');

    // ==========================================
    // 2. IMPORTAR ALÉRGENOS
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
    // 3. IMPORTAR INGREDIENTES
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
    // 4. IMPORTAR PRODUCTOS
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

      // Si la categoría es PIZZA, añade los alérgenos base a la fuerza
      if (producto.categoria === 'PIZZA') {
        const alergenosBaseObligatorios = ['gluten', 'frutos secos', 'altramuces', 'cacahuete', 'sésamo'];
        
        alergenosBaseObligatorios.forEach(nombreAlergeno => {
          const idAlergeno = mapaAlergenos[nombreAlergeno];
          // Si el alérgeno existe en la BBDD y no está ya en la lista de esta pizza, lo incluye
          if (idAlergeno && !alergenosIds.includes(idAlergeno)) {
            alergenosIds.push(idAlergeno);
          }
        });
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