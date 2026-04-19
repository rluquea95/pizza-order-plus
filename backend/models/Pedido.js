const mongoose = require('mongoose');

// Define el "esqueleto" de cómo se guarda un pedido en la base de datos
const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  productos: [{
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    nombre: { type: String, required: true },
    categoria: { type: String, required: true, enum: ['PIZZA', 'BEBIDA'] },
    tamaño: { type: String },
    cantidad: { type: Number, required: true },
    precioUnitario: { type: Number, required: true },
    // Detalles específicos de personalización
    ingredientesExtra: [String],
    ingredientesQuitados: [String],
    imagen: String
  }],
  metodoEntrega: {
    type: String,
    enum: ['LOCAL', 'DOMICILIO'],
    required: true
  },
  // Dirección opcional, solo se rellena si es a DOMICILIO
  direccionEntrega: {
    tipo_via: String,
    calle: String,
    numero: String,
    piso: String,
    codigo_postal: String,
    ciudad: String
  },
  precioTotal: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['EN_CURSO', 'EN_PREPARACION', 'LISTO', 'ENVIADO', 'CERRADO', 'CANCELADO'],
    default: 'EN_CURSO'
  }
}, {
  // Crea automáticamente 'createdAt' y 'updatedAt'. 
  timestamps: true,

  // Obliga a Mongoose a que envíe las propiedades virtuales cuando hagamos un res.json()
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calcula dinámicamente si el pedido se puede editar (Pasan menos de 5 mins y sigue PENDIENTE)
pedidoSchema.virtual('puedeEditarse').get(function () {
  // Si ya no está pendiente (ej. ya lo están cocinando), no se puede editar
  if (this.estado !== 'EN_CURSO') return false;

  const tiempoTranscurrido = Date.now() - this.createdAt.getTime();
  const cincoMinutosEnMilisegundos = 5 * 60 * 1000;

  return tiempoTranscurrido <= cincoMinutosEnMilisegundos;
});

// Exporta el modelo para poder usarlo en otras partes de la aplicación
module.exports = mongoose.model('Pedido', pedidoSchema);