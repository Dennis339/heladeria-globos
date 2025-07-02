DELIMITER //

CREATE PROCEDURE ReporteVentasDiaSucursalProducto(
    IN fecha_inicio DATE,
    IN fecha_fin DATE
)
BEGIN
    SELECT 
        DATE(p.fecha) AS fecha,
        s.nombre AS sucursal,
        t.turno AS turno,
        pr.nombre AS producto,
        SUM(dp.cantidad) AS total_vendido,
        SUM(dp.cantidad * dp.precio_unitario - dp.descuento_aplicado) AS total_ingresos
    FROM Pedidos p
    JOIN DetallePedido dp ON p.id_pedido = dp.id_pedido
    JOIN Productos pr ON dp.id_producto = pr.id_producto
    JOIN Ventas v ON p.id_pedido = v.id_pedido
    JOIN Sucursales s ON v.id_sucursal = s.id_sucursal
    JOIN Turnos t ON v.id_turno = t.id_turno
    WHERE DATE(p.fecha) BETWEEN fecha_inicio AND fecha_fin
      AND p.estado = 'Entregado'
    GROUP BY DATE(p.fecha), s.nombre, t.turno, pr.nombre
    ORDER BY fecha ASC, sucursal ASC, total_vendido DESC;
END //

DELIMITER ;

CALL ReporteVentasDiaSucursalProducto('2024-06-01', '2026-06-30');

DELIMITER //

CREATE PROCEDURE ReportePedidosPendientesEntregados(
    IN estado_filtro VARCHAR(20),
    IN fecha_inicio DATE,
    IN fecha_fin DATE
)
BEGIN
    SELECT 
        p.id_pedido,
        c.nombre AS cliente,
        p.fecha,
        p.canal,
        p.estado,
        p.forma_pago,
        p.total AS monto_total
    FROM Pedidos p
    LEFT JOIN Clientes c ON p.id_cliente = c.id_cliente
    WHERE p.estado = estado_filtro
      AND DATE(p.fecha) BETWEEN fecha_inicio AND fecha_fin
    ORDER BY p.fecha DESC;
END //

DELIMITER ;

CALL ReportePedidosPendientesEntregados('Entregado', '2025-06-01', '2025-06-30');

DELIMITER //

CREATE PROCEDURE ReporteIngresosMensuales(
    IN fecha_inicio_param DATE,
    IN fecha_fin_param DATE
)
BEGIN
    SELECT 
        s.nombre AS sucursal,
        pr.tipo AS tipo_producto,
        p.forma_pago,
        SUM(dp.cantidad * dp.precio_unitario - dp.descuento_aplicado) AS total_ingresos
    FROM Pedidos p
    INNER JOIN DetallePedido dp ON p.id_pedido = dp.id_pedido
    INNER JOIN Productos pr ON dp.id_producto = pr.id_producto
    INNER JOIN Ventas v ON v.id_pedido = p.id_pedido
    INNER JOIN Sucursales s ON v.id_sucursal = s.id_sucursal
    WHERE p.fecha BETWEEN fecha_inicio_param AND fecha_fin_param
    GROUP BY s.nombre, pr.tipo, p.forma_pago
    ORDER BY s.nombre, pr.tipo;
END //

DELIMITER ;

CALL ReporteIngresosMensuales('2025-06-01', '2025-06-30');


DELIMITER //

CREATE PROCEDURE ReporteBonificaciones(
    IN mes_param INT,
    IN anio_param INT
)
BEGIN
    SELECT 
        e.id_empleado,
        e.nombre AS empleado,
        b.meta,
        b.ventas_mes,
        b.bonificacion,
        COUNT(DISTINCT v.id_turno) AS turnos_realizados,
        COUNT(DISTINCT v.id_venta) AS total_ventas
    FROM Bonificaciones b
    INNER JOIN Empleados e ON b.id_empleado = e.id_empleado
    LEFT JOIN Ventas v ON v.id_empleado = e.id_empleado
    LEFT JOIN Turnos t ON v.id_turno = t.id_turno
        AND MONTH(t.fecha) = mes_param
        AND YEAR(t.fecha) = anio_param
    WHERE b.mes = mes_param AND b.anio = anio_param
    GROUP BY e.id_empleado, e.nombre, b.meta, b.ventas_mes, b.bonificacion
    ORDER BY b.bonificacion DESC;
END //

DELIMITER ;

CALL ReporteBonificaciones(6, 2025);

DELIMITER //

CREATE PROCEDURE ReportePreferenciasClientes()
BEGIN
    SELECT 
        c.id_cliente,
        c.nombre AS cliente,
        sub.total_pedidos,
        CASE 
            WHEN sub.total_pedidos > 3 THEN 'Recurrente'
            ELSE 'Nuevo'
        END AS tipo_cliente,
        sub.producto_preferido,
        sub.total_comprado,
        (SELECT cc.tipo 
         FROM ComentariosClientes cc 
         WHERE cc.id_cliente = c.id_cliente 
         ORDER BY cc.fecha DESC 
         LIMIT 1) AS ultimo_tipo_comentario,
        (SELECT cc.comentario 
         FROM ComentariosClientes cc 
         WHERE cc.id_cliente = c.id_cliente 
         ORDER BY cc.fecha DESC 
         LIMIT 1) AS ultimo_comentario
    FROM Clientes c
    JOIN (
        SELECT 
            p.id_cliente,
            COUNT(DISTINCT p.id_pedido) AS total_pedidos,
            dp.id_producto,
            pr.nombre AS producto_preferido,
            SUM(dp.cantidad) AS total_comprado
        FROM Pedidos p
        JOIN DetallePedido dp ON p.id_pedido = dp.id_pedido
        JOIN Productos pr ON dp.id_producto = pr.id_producto
        GROUP BY p.id_cliente, dp.id_producto
    ) sub ON c.id_cliente = sub.id_cliente
    JOIN (
        SELECT id_cliente, MAX(SUM_cantidad) AS max_cantidad
        FROM (
            SELECT 
                p.id_cliente,
                dp.id_producto,
                SUM(dp.cantidad) AS SUM_cantidad
            FROM Pedidos p
            JOIN DetallePedido dp ON p.id_pedido = dp.id_pedido
            GROUP BY p.id_cliente, dp.id_producto
        ) AS cantidad_por_producto
        GROUP BY id_cliente
    ) preferido ON preferido.id_cliente = sub.id_cliente AND preferido.max_cantidad = sub.total_comprado
    ORDER BY c.id_cliente;
END //

DELIMITER ;

CALL ReportePreferenciasClientes();