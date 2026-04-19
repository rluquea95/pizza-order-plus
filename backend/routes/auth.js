const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Accede a la variable de entorno.
const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// RUTA: REGISTRO DE USUARIO (POST /api/auth/registro)
// ==========================================
router.post('/registro', async (req, res) => {
  try {
    const { nombre, apellidos, dni, fecha_nacimiento, email, password, telefono, direccion } = req.body;

    // Verifica si el usuario ya existe con ese email
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado' });
    }
    
    // Comprueba si ya hay un usuario registrado con ese DNI
    const dniExistente = await Usuario.findOne({ dni });
    if (dniExistente) {
      return res.status(400).json({ mensaje: 'Ya existe una cuenta con este DNI' });
    }

    // Crea el nuevo usuario
    // El rol por defecto será 'CLIENTE'
    // Argon2 encriptará 'password' automáticamente gracias al hook 'pre-save'
    const nuevoUsuario = new Usuario({ 
      nombre, 
      apellidos,
      dni,
      fecha_nacimiento, 
      email, 
      password, 
      telefono,
      direccion
    });

    // Persiste al usuario en la BBDD
    await nuevoUsuario.save();

    // Devuelve el usuario creado
    res.status(201).json({ 
      mensaje: 'Usuario registrado con éxito',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        direccion: nuevoUsuario.direccion
      }
    });

  } catch (error) {
    console.error('Error en el registro:', error);
    // Si hay un error de validación de Mongoose (ej. DNI mal formateado), devuelve ese mensaje
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ mensaje: mensajes.join('. ') });
    }
    res.status(500).json({ mensaje: 'Error interno del servidor al registrar usuario' });
  }
});

// ==========================================
// RUTA: LOGIN DE USUARIO (POST /api/auth/login)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca al usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Comprueba la contraseña 
    const passwordValida = await usuario.comprobarPassword(password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Genera el Token JWT (Válido por 24 horas)
    // Guarda dentro del token el ID y el ROL del usuario
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Envía la respuesta con el token y los datos públicos del usuario
    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono,
        direccion: usuario.direccion
      }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor en el login' });
  }
});

module.exports = router;