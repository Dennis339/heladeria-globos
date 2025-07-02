const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Reporte 1: Ingresos Mensuales
router.get('/reporte-ingresos', pedidosController.mostrarIngresosMensuales);
// Reporte 2: Pedidos por Estado
router.get('/reporte-pedidos', pedidosController.mostrarPedidosPorEstado);
// Reporte 3: Ventas por dia
router.get('/reporte-ventas', pedidosController.mostrarVentasPorDia);
router.get('/', (req, res) => {
    res.render('inicio', {
        title: 'Panel de Reportes - Heladería Globos'
    });
});
module.exports = router;