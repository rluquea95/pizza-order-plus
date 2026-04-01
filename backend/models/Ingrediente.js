const mongoose = require('mongoose');

// Define el "esqueleto" de cómo se guarda un ingrediente en la base de datos
const ingredienteSchema = new mongoose.Schema({
  ingrediente: { type: String, required: true }, 
  // Relacion con la entidad Alergeno
  alergenos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alergeno' }],
  disponible: { type: Boolean, default: true },
  precio: { type: Number, default: 0 },
  fecha_registro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ingrediente', ingredienteSchema);