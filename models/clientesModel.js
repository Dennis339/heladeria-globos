const db = require('../config/db');

exports.obtenerPreferenciasClientes = (callback) => {
  const query = 'CALL ReportePreferenciasClientes()';

  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }

    callback(null, results[0]); 
  });
};