const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');

// RUTA POST: Crear un nuevo pedido (CREATE)
router.post('/', async (req, res) => {
  try {
    const {
      usuario,
      productos,
      metodoEntrega,
      direccionEntrega,
      precioTotal
    } = req.body;

    // Validación básica de seguridad
    if (!usuario || !productos || productos.length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan datos obligatorios para crear el pedido.'
      });
    }

    // Almacena el pedido
    const nuevoPedido = new Pedido({
      usuario,
      productos,
      metodoEntrega,
      // Si es local, ignora la dirección para que no ocupe espacio innecesario
      direccionEntrega: metodoEntrega === 'DOMICILIO' ? direccionEntrega : undefined,
      precioTotal
    });

    // Guarda el pedido en la BBDD
    const pedidoGuardado = await nuevoPedido.save();

    res.status(201).json({
      success: true,
      pedido: pedidoGuardado,
      mensaje: 'Pedido tramitado con éxito'
    });

  } catch (error) {
    console.error('Error al tramitar el pedido:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor al procesar el pedido.'
    });
  }
});

// RUTA GET: Obtiene los pedidos del usuario (SELECT)
router.get('/usuario/:userId', async (req, res) => {
  try {
    // Busca los pedidos del usuario y los ordena del más nuevo al más antiguo (-1)
    const pedidos = await Pedido.find({ usuario: req.params.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      pedidos: pedidos
    });
  } catch (error) {
    console.error('Error al recuperar los pedidos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al recuperar el historial de pedidos.'
    });
  }
});

// RUTA PATCH: Cancelar un pedido (Borrado lógico)
router.patch('/:id/cancelar', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ success: false, mensaje: 'Pedido no encontrado.' });
    }

    // Usa la función creada en el modelo Pedido.js
    if (!pedido.puedeEditarse) {
      return res.status(403).json({
        success: false,
        mensaje: 'El pedido ya no puede cancelarse (han pasado más de 5 min o ya no está EN_CURSO).'
      });
    }

    pedido.estado = 'CANCELADO';
    await pedido.save();

    res.status(200).json({ success: true, mensaje: 'Pedido cancelado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: 'Error al cancelar el pedido.' });
  }
});

// RUTA PUT: Modificar un pedido existente
router.put('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ success: false, mensaje: 'Pedido no encontrado.' });
    }

    if (!pedido.puedeEditarse) {
      return res.status(403).json({
        success: false,
        mensaje: 'El tiempo de modificación (5 min) ha expirado.'
      });
    }

    // Actualiza los campos permitidos
    const { productos, metodoEntrega, direccionEntrega, precioTotal } = req.body;

    pedido.productos = productos || pedido.productos;
    pedido.metodoEntrega = metodoEntrega || pedido.metodoEntrega;
    pedido.direccionEntrega = metodoEntrega === 'DOMICILIO' ? direccionEntrega : undefined;
    pedido.precioTotal = precioTotal || pedido.precioTotal;

    await pedido.save();
    res.status(200).json({ success: true, pedido, mensaje: 'Pedido actualizado.' });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: 'Error al actualizar el pedido.' });
  }
});


// RUTA PATCH: Actualiza el estado del pedido (SOLO ADMIN)
router.patch('/:id/estado', async (req, res) => {
  try {
    const { nuevoEstado } = req.body;

    // Busca el pedido 
    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ success: false, mensaje: 'Pedido no encontrado.' });
    }

    // Bloquea al Admin si no han pasado 5 minutos
    // (A menos que el admin esté cancelando el pedido por algún motivo de fuerza mayor)
    if (pedido.estado === 'EN_CURSO' && nuevoEstado !== 'CANCELADO') {
      const tiempoTranscurrido = Date.now() - pedido.createdAt.getTime();
      const cincoMins = 5 * 60 * 1000;

      if (tiempoTranscurrido < cincoMins) {
        return res.status(403).json({
          success: false,
          mensaje: 'El cliente aún tiene tiempo para cancelar/modificar. Espere a que pasen 5 minutos desde la creación del pedido.'
        });
      }
    }

    // Si pasa la validación (o si ya estaba en otro estado), actualiza el estado
    pedido.estado = nuevoEstado;
    await pedido.save();

    res.status(200).json({
      success: true,
      pedido,
      mensaje: `Estado actualizado a ${nuevoEstado}`
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ success: false, mensaje: 'Error al actualizar el estado.' });
  }
});

module.exports = router;