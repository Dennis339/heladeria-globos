const db = require('../config/db');

const mostrarIngresosMensuales = (req, res) => {
    const { inicio, fin } = req.query;

    // Si no hay fechas, mostrar formulario vacío
    if (!inicio || !fin) {
        return res.render('pedidos/ingresos', {
            datos: [],
            fechaInicio: '',
            fechaFin: '',
            title: 'Ingresos Mensuales'
        });
    }

    const sql = 'CALL ReporteIngresosMensuales(?, ?)';
    db.query(sql, [inicio, fin], (err, results) => {
        if (err) {
            console.error('Error al obtener el reporte:', err);
            return res.status(500).send('Error al ejecutar el procedimiento almacenado');
        }

        res.render('pedidos/ingresos', {
            datos: results[0],
            fechaInicio: inicio,
            fechaFin: fin,
            title: 'Ingresos Mensuales'
        });
    });
};
// Nuevo: Controlador para reporte de pedidos por estado
const mostrarPedidosPorEstado = (req, res) => {
    const { estado, inicio, fin } = req.query;

    // Si no se ingresó nada aún, mostrar formulario vacío
    if (!estado || !inicio || !fin) {
        return res.render('pedidos/estado', {
            datos: [],
            estadoSeleccionado: '',
            fechaInicio: '',
            fechaFin: '',
            title: 'Pedidos por Estado'
        });
    }

    const sql = 'CALL ReportePedidosPendientesEntregados(?, ?, ?)';
    db.query(sql, [estado, inicio, fin], (err, results) => {
        if (err) {
            console.error('Error al ejecutar el procedimiento:', err);
            return res.status(500).send('Error al obtener los datos del reporte');
        }

        res.render('pedidos/estado', {
            datos: results[0],
            estadoSeleccionado: estado,
            fechaInicio: inicio,
            fechaFin: fin,
            title: 'Pedidos por Estado'
        });
    });
};
const mostrarVentasPorDia = (req, res) => {
    const { inicio, fin } = req.query;

    // Si no hay fechas, mostrar formulario vacío
    if (!inicio || !fin) {
        return res.render('pedidos/ventas', {
            datos: [],
            fechaInicio: '',
            fechaFin: '',
            title: 'Reporte de Ventas'
        });
    }

    const sql = 'CALL ReporteVentasDiaSucursalProducto(?, ?)';
    db.query(sql, [inicio, fin], (err, results) => {
        if (err) {
            console.error('Error al obtener el reporte de ventas:', err);
            return res.status(500).send('Error al ejecutar el procedimiento almacenado');
        }

        res.render('pedidos/ventas', {
            datos: results[0],
            fechaInicio: inicio,
            fechaFin: fin,
            title: 'Reporte de Ventas'
        });
    });
};
module.exports = {
    mostrarIngresosMensuales,
    mostrarPedidosPorEstado,
    mostrarVentasPorDia
};