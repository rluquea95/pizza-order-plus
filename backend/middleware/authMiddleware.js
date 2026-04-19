const jwt = require('jsonwebtoken');

// Verifica si el usuario tiene un token válido (está logueado)
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ success: false, mensaje: 'Acceso denegado. No hay token.' });
  }

  try {
    // El token del frontend suele enviarse como "Bearer eyJhbGci..."
    const tokenLimpio = token.replace('Bearer ', '');
    const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    
    // Guarda los datos del token (id y rol) en la petición
    req.usuario = verificado; 
    next();
  } catch (error) {
    res.status(400).json({ success: false, mensaje: 'Token no válido o caducado.' });
  }
};

// Verifica si el usuario logueado es Administrador
const verificarRolAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(500).json({ success: false, mensaje: 'Error al verificar la identidad.' });
  }
  
  // Si no es ADMIN, bloquea el acceso
  if (req.usuario.rol !== 'ADMIN') {
    return res.status(403).json({ 
      success: false, 
      mensaje: 'Acceso denegado. No tienes permisos de Administrador.' 
    });
  }
  
  // Si es Admin, le deja pasar
  next(); 
};

module.exports = { verificarToken, verificarRolAdmin };