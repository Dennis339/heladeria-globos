const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

router.get('/reporte-clientes', clientesController.mostrarPreferenciasClientes);

module.exports = router;