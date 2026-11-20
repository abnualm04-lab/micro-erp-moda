const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventarioController');

// Rutas CRUD de Productos e Insumos
router.get('/productos', controller.obtenerInventario);
router.post('/productos', controller.crearProducto);
router.put('/productos/:id', controller.actualizarProducto);
router.delete('/productos/:id', controller.eliminarProducto);

// Rutas de Historial y Entradas/Salidas de Almacén
router.get('/movimientos', controller.obtenerMovimientos);
router.post('/movimientos', controller.registrarMovimiento);

module.exports = router;