const db = require('../config/db');

const mostrarBonificaciones = (req, res) => {
    const { mes, anio } = req.query;

    // Si no hay parámetros, mostramos el formulario vacío
    if (!mes || !anio) {
        return res.render('bonificaciones/bonificaciones', {
            datos: [],
            mesSeleccionado: '',
            anioSeleccionado: '',
            title: 'Bonificaciones por Empleado'
        });
    }

    const sql = 'CALL ReporteBonificaciones(?, ?)';
    db.query(sql, [Number(mes), Number(anio)], (err, results) => {
        if (err) {
            console.error('Error al obtener bonificaciones:', err);
            return res.status(500).send('Error al ejecutar el procedimiento almacenado');
        }

        const datos = results[0] || [];

        res.render('bonificaciones/bonificaciones', {
            datos,
            mesSeleccionado: mes,
            anioSeleccionado: anio,
            title: 'Bonificaciones por Empleado'
        });
    });
};

module.exports = {
    mostrarBonificaciones
};