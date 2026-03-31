const express = require('express');
const router = express.Router();

// Importa el Modelo para poder hablar con MongoDB
const Ingrediente = require('../models/Ingrediente');

// RUTA GET: Obtiene todos los ingredientes (SELECT)
// Cuando alguien entre en la URL raíz de esta ruta, ejecutamos esto:
router.get('/', async (req, res) => {
  try {
    // Le pedimos a Mongoose que busque TODOS los documentos de esta colección
    const ingredientes = await Ingrediente.find(); 
    
    // Si todo va bien, el servidor responde (res) enviando los ingredientes en formato JSON
    res.json(ingredientes); 
  } catch (error) {
    console.error('Error al obtener los ingredientes:', error);
    // Si algo falla, devolvemos un error 500 (Error interno del servidor)
    res.status(500).json({ mensaje: 'Error al obtener los ingredientes' });
  }
});

// RUTA POST: Crear un nuevo ingrediente (CREATE)
router.post('/', async (req, res) => {
  try {
    // req.body es la información que nos enviará React (el formulario con el nuevo ingrediente)
    const nuevoIngrediente = new Ingrediente(req.body); 
    const ingredienteGuardado = await nuevoIngrediente.save(); // Lo guardamos en MongoDB
    res.status(201).json(ingredienteGuardado); // 201 significa "Creado con éxito"
  } catch (error) {
    console.error('Error al crear ingrediente:', error);
    res.status(400).json({ mensaje: 'Error al crear el ingrediente', error });
  }
});

// RUTA PUT: Actualizar un ingrediente existente (UPDATE)
// El ":id" en la URL es un comodín. Si entran a /api/ingredientes/1234, req.params.id valdrá "1234"
router.put('/:id', async (req, res) => {
  try {
    const ingredienteActualizado = await Ingrediente.findByIdAndUpdate(
      req.params.id, // El ID del ingrediente a buscar
      req.body,      // Los nuevos datos a actualizar
      { new: true }  // Le decimos a Mongoose que nos devuelva el ingrediente YA modificado
    );
    
    if (!ingredienteActualizado) {
      return res.status(404).json({ mensaje: 'Ingrediente no encontrado' });
    }
    res.json(ingredienteActualizado);
  } catch (error) {
    console.error('Error al actualizar ingrediente:', error);
    res.status(400).json({ mensaje: 'Error al actualizar el ingrediente', error });
  }
});

// RUTA DELETE: Borrar un ingrediente (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const ingredienteBorrado = await Ingrediente.findByIdAndDelete(req.params.id);
    
    if (!ingredienteBorrado) {
      return res.status(404).json({ mensaje: 'Ingrediente no encontrado' });
    }
    res.json({ mensaje: 'Ingrediente borrado con éxito' });
  } catch (error) {
    console.error('Error al borrar ingrediente:', error);
    res.status(500).json({ mensaje: 'Error al borrar el ingrediente', error });
  }
});

// Exporta las rutas para que server.js las pueda usar
module.exports = router;