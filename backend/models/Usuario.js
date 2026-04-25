const mongoose = require('mongoose');
const argon2 = require('argon2');

// Define el "esqueleto" de cómo se guarda un usuario en la base de datos
const usuarioSchema = new mongoose.Schema({
 nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  apellidos: {
    type: String,
    required: [true, 'Los apellidos son obligatorios'],
    trim: true
  },
  fecha_nacimiento: {
    type: Date,
    required: [true, 'La fecha de nacimiento es obligatoria']
  },
  telefono: { 
    type: String, 
    trim: true,
    match: [/^[0-9]{9}$/, 'El teléfono debe tener 9 dígitos'] // Valida que sean exactamente 9 números
  },
  direccion: [{
    tipo_via: String,
    calle: String,
    numero: String,
    piso: String,
    codigo_postal: {
      type: String,
      match: [/^[0-9]{5}$/, 'El código postal debe tener 5 dígitos'] // Valida que el código postal sean exactamente 5 números
    },
    ciudad: String
  }],
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true, // No pueden existir dos usuarios con el mismo correo
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, introduce un correo electrónico válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
  },
  rol: {
    type: String,
    enum: ['CLIENTE', 'ADMIN'], // Solo permitimos estos dos roles
    default: 'CLIENTE' // Por defecto, cualquiera que se registre será cliente
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  }
});


// Encripta la contraseña antes de guardarla
usuarioSchema.pre('save', async function() {
  // Si la contraseña no ha sido modificada (ej. el usuario solo actualizó su nombre), 
  // salta este paso para no volver a encriptar algo ya encriptado.
  if (!this.isModified('password')) {
    return ;
  }

  // Argon2 encripta la contraseña. 
  // Al ser una función 'async', si todo va bien Mongoose continúa automáticamente.
  // Si hubiera un error, la promesa se rechaza sola y auth.js lo capturaría.
  this.password = await argon2.hash(this.password);
});


// Comprueba la contraseña (se usa en el Login)
usuarioSchema.methods.comprobarPassword = async function(passwordIntroducida) {
  try {
    // Argon2 verifica si la contraseña en texto plano coincide con el hash guardado
    return await argon2.verify(this.password, passwordIntroducida);
  } catch (error) {
    return false;
  }
};

// Exporta el modelo para poder usarlo en otras partes de la aplicación
module.exports = mongoose.model('Usuario', usuarioSchema);