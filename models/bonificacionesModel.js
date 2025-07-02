const db = require('../config/db');

exports.obtenerBonificaciones = (mes, anio, callback) => {
  const sql = 'CALL ReporteBonificaciones(?, ?)';
  db.query(sql, [mes, anio], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results[0]); 
  });
};