const mongoose = require('mongoose');

const alergenoSchema = new mongoose.Schema({
  alergeno: { type: String, required: true }, 
  descripcion: { type: String, required: true },
  imagen: { type: String, default: "" },
  fecha_registro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alergeno', alergenoSchema);