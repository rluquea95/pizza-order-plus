const express = require('express');
const router = express.Router();

// Importa el Modelo para poder hablar con MongoDB
const Producto = require('../models/Producto');

// RUTA GET: Obtiene todos los productos (SELECT)
// Cuando alguien entre en la URL raíz de esta ruta, ejecutamos esto:
router.get('/', async (req, res) => {
  try {
    // Mongoose busca todos los documentos de esta colección y rellena la información real
    // de ingredientes y alérgenos
    const productos = await Producto.find()
      .populate('alergenos') // Trae los alérgenos base de la masa
      .populate({
        path: 'ingredientes',
        populate: { path: 'alergenos' } // Entra en los ingredientes y trae sus alérgenos
      }); 
    
    // Si todo va bien, el servidor responde (res) enviando los productos en formato JSON
    res.json(productos); 
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    // Si algo falla, devuelve un error 500 (Error interno del servidor)
    res.status(500).json({ mensaje: 'Error al obtener los productos' });
  }
});

// RUTA GET por ID: Obtiene UN solo producto
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('alergenos') // Trae los alérgenos base de la masa
      .populate({
        path: 'ingredientes',
        populate: { path: 'alergenos' } // Entra en los ingredientes y trae sus alérgenos
      });
      
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ mensaje: 'Error al obtener el producto', error });
  }
});

// RUTA POST: Crear un nuevo producto (CREATE)
router.post('/', async (req, res) => {
  try {
    // req.body es la información que nos enviará React (el formulario con la nueva pizza)
    const nuevoProducto = new Producto(req.body); 
    // Lo guardamos en MongoDB
    const productoGuardado = await nuevoProducto.save(); 
    res.status(201).json(productoGuardado); 
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ mensaje: 'Error al crear el producto', error });
  }
});

// RUTA PUT: Actualizar un producto existente (UPDATE)
// El ":id" en la URL es un comodín. Si entran a /api/productos/1234, req.params.id valdrá "1234"
router.put('/:id', async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id, // El ID del producto a buscar
      req.body,      // Los nuevos datos a actualizar
      { new: true }  // Moongosee nos devuelve el producto YA modificado
    );
    
    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(400).json({ mensaje: 'Error al actualizar el producto', error });
  }
});

// RUTA DELETE: Borrar un producto (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const productoBorrado = await Producto.findByIdAndDelete(req.params.id);
    
    if (!productoBorrado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto borrado con éxito' });
  } catch (error) {
    console.error('Error al borrar producto:', error);
    res.status(500).json({ mensaje: 'Error al borrar el producto', error });
  }
});

// Exporta las rutas para que server.js las pueda usar
module.exports = router;