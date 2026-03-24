const mongoose = require('mongoose');

// Define el "esqueleto" de cómo se guarda un producto en la base de datos
const productoSchema = new mongoose.Schema({
  producto: { type: String, required: true },
  categoria: { type: String, required: true, enum: ['PIZZA', 'BEBIDA'] },
  ingredientes: { type: String, default: "" },
  descripcion: { type: String, default: "" },
  alergenos: { type: String, default: "" },
  
  // Precios Pizza 
  'precio-pizza-peq': { type: Number, default: null },
  'precio-pizza-med': { type: Number, default: null },
  'precio-pizza-fam': { type: Number, default: null },
  
  // Precios Bebida
  'precio-beb-330ml': { type: Number, default: null },
  'precio-beb-500ml': { type: Number, default: null },
  'precio-beb-1000ml': { type: Number, default: null },
  
  // Imágenes
  'imagen-pizza': { type: String, default: "" },
  'imagen-beb-330ml': { type: String, default: "" },
  'imagen-beb-500ml': { type: String, default: "" },
  'imagen-beb-1000ml': { type: String, default: "" },
  
  // Disponibilidad
  'disp-piz-peq': { type: Boolean, default: false },
  'disp-piz-med': { type: Boolean, default: false },
  'disp-piz-fam': { type: Boolean, default: false },
  'disp-beb-330ml': { type: Boolean, default: false },
  'disp-beb-500ml': { type: Boolean, default: false },
  'disp-beb-1000ml': { type: Boolean, default: false },

  // Fecha automática
  fecha_registro: { type: Date, default: Date.now }
});

// Exporta el modelo para poder usarlo en otras partes de la aplicación
module.exports = mongoose.model('Producto', productoSchema);