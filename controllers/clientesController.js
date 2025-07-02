const clientesModel = require('../models/clientesModel');

const mostrarPreferenciasClientes = (req, res) => {
  clientesModel.obtenerPreferenciasClientes((err, datos) => {
    if (err) {
      console.error('Error al obtener preferencias de clientes:', err);
      return res.status(500).send('Error al ejecutar el procedimiento almacenado');
    }

    res.render('clientes/preferencias', {
      datos,
      title: 'Preferencias de Clientes'
    });
  });
};

module.exports = {
  mostrarPreferenciasClientes
};