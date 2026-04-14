// Importa las librerías
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Para poder leer el archivo .env

// Importa los archivos de rutas
const productosRoutes = require('./routes/productos');
const ingredientesRoutes = require('./routes/ingredientes'); 
const alergenosRoutes = require('./routes/alergenos');

// Inicializa la app de Express
const app = express();

// Middlewares 
app.use(cors()); // Permite que el frontend (React) se comunique con este backend
app.use(express.json()); // Permite que nuestro servidor entienda datos en formato JSON

// Le decimos a Express que use nuestras rutas cuando alguien visite /api/{...}
app.use('/api/productos', productosRoutes);
app.use('/api/ingredientes', ingredientesRoutes); 
app.use('/api/alergenos', alergenosRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 ¡Conectado a la base de datos MongoDB!'))
  .catch((err) => console.error('🔴 Error conectando a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🍕 ¡Bienvenida a la API de PizzaOrder+!');
});

// Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});