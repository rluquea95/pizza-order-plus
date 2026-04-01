const mongoose = require('mongoose');

// Define el "esqueleto" de cómo se guarda un producto en la base de datos
const productoSchema = new mongoose.Schema({
  producto: { type: String, required: true },
  categoria: { type: String, required: true, enum: ['PIZZA', 'BEBIDA'] },
  // Relacion con la entidad Ingrediente
  ingredientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingrediente' }],
  descripcion: { type: String, default: "" },
  // Relacion con la entidad Alergeno
  alergenos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alergeno' }],
  
  // Precios Pizza 
  precio_pizza_med: { type: Number, default: null },
  precio_pizza_peq: { type: Number, default: null },
  precio_pizza_fam: { type: Number, default: null },
  
  // Precios Bebida
  precio_beb_330ml: { type: Number, default: null },
  precio_beb_500ml: { type: Number, default: null },
  precio_beb_1000ml: { type: Number, default: null },
  
  // Imágenes
  imagen_pizza: { type: String, default: "" },
  imagen_beb_330ml: { type: String, default: "" },
  imagen_beb_500ml: { type: String, default: "" },
  imagen_beb_1000ml: { type: String, default: "" },
  
  // Disponibilidad
  disp_piz_peq: { type: Boolean, default: false },
  disp_piz_med: { type: Boolean, default: false },
  disp_piz_fam: { type: Boolean, default: false },
  disp_beb_330ml: { type: Boolean, default: false },
  disp_beb_500ml: { type: Boolean, default: false },
  disp_beb_1000ml: { type: Boolean, default: false },

  // Fecha automática
  fecha_registro: { type: Date, default: Date.now }
});

// Exporta el modelo para poder usarlo en otras partes de la aplicación
module.exports = mongoose.model('Producto', productoSchema);