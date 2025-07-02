const db = require('../config/db');

// Reporte 1: Ingresos Mensuales
exports.obtenerIngresosMensuales = (fechaInicio, fechaFin, callback) => {
  const query = 'CALL sp_reporte_ingresos_mensuales(?, ?)';

  db.query(query, [fechaInicio, fechaFin], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    callback(null, results[0]);
  });
};

// Reporte 2: Pedidos Pendientes / Entregados
exports.obtenerPedidosPorEstado = (estado, fechaInicio, fechaFin, callback) => {
  const query = 'CALL ReportePedidosPendientesEntregados(?, ?, ?)';

  db.query(query, [estado, fechaInicio, fechaFin], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    callback(null, results[0]);
  });
};
// Reporte 3: Ventas por Día, Sucursal y Producto
exports.obtenerVentasPorDia = (fechaInicio, fechaFin, callback) => {
  const query = 'CALL ReporteVentasDiaSucursalProducto(?, ?)';

  db.query(query, [fechaInicio, fechaFin], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    callback(null, results[0]);
  });
};