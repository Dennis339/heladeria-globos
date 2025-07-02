const express = require('express');
const router = express.Router();
const bonificacionesController = require('../controllers/bonificacionesController');

router.get('/reporte-bonificaciones', bonificacionesController.mostrarBonificaciones);

module.exports = router;