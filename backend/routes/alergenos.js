const express = require('express');
const router = express.Router();
const Alergeno = require('../models/Alergeno');

// RUTA GET: Obtener todos los alérgenos
router.get('/', async (req, res) => {
  try {
    const alergenos = await Alergeno.find();
    res.json(alergenos);
  } catch (error) {
    console.error('Error al obtener los alérgenos:', error);
    res.status(500).json({ mensaje: 'Error al obtener los alérgenos' });
  }
});

module.exports = router;