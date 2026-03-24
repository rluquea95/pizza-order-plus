// Importa las librerías
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Para poder leer el archivo .env

// Importa el archivo de rutas de productos
const productosRoutes = require('./routes/productos');

// Inicializa la app de Express
const app = express();

// Middlewares 
app.use(cors()); // Permite que el frontend (React) se comunique con este backend
app.use(express.json()); // Permite que nuestro servidor entienda datos en formato JSON

// Le decimos a Express que use nuestras rutas cuando alguien visite /api/productos (NUEVO)
app.use('/api/productos', productosRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 ¡Conectado a la base de datos MongoDB!'))
  .catch((err) => console.error('🔴 Error conectando a MongoDB:', err));

// Ruta de prueba (Tu primer endpoint)
app.get('/', (req, res) => {
  res.send('🍕 ¡Bienvenida a la API de PizzaOrder+!');
});

// Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});