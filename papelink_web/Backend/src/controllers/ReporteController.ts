import { Request, Response } from 'express';
import { pool } from '../config/database';
import { responderError } from '../utils/errores';

// ============================================================================
// CONTROLADOR DE REPORTES: Los números de las tarjetas del panel de inicio
// (ventas del día, ticket promedio, apartados por estado y estado del stock).
// ============================================================================
class ReporteController {

    public resumenDia = async (req: Request, res: Response): Promise<void> => {
        try {
            const [[v]]: any = await pool.query(
                `SELECT COALESCE(SUM(total), 0) AS total, COUNT(*) AS ventas FROM ventas
                  WHERE fecha_venta >= CURDATE() AND fecha_venta < DATE_ADD(CURDATE(), INTERVAL 1 DAY)`
            );
            const [[a]]: any = await pool.query(
                `SELECT COALESCE(SUM(d.cantidad), 0) AS articulos FROM detalle_ventas d JOIN ventas v ON v.id = d.venta_id
                  WHERE v.fecha_venta >= CURDATE() AND v.fecha_venta < DATE_ADD(CURDATE(), INTERVAL 1 DAY)`
            );
            const [estados]: any = await pool.query('SELECT estado, COUNT(*) AS n FROM pedidos GROUP BY estado');
            const [[c]]: any = await pool.query(
                `SELECT COUNT(*) AS n FROM pedidos WHERE estado = 'completado'
                    AND fecha_actualizacion >= CURDATE() AND fecha_actualizacion < DATE_ADD(CURDATE(), INTERVAL 1 DAY)`
            );
            const [[inv]]: any = await pool.query(
                `SELECT SUM(estatus = 'Stock bajo') AS stock_bajo, SUM(estatus = 'Sin existencias') AS sin_existencias,
                        COALESCE(SUM(stock), 0) AS unidades FROM v_inventario WHERE activo = 1`
            );
            res.status(200).json({
                ventas_hoy: v.total,
                ventas_registradas: v.ventas,
                articulos_vendidos: Number(a.articulos),
                ticket_promedio: v.ventas ? Math.round((v.total / v.ventas) * 100) / 100 : 0,
                pedidos_por_estado: Object.fromEntries(estados.map((e: any) => [e.estado, e.n])),
                pedidos_completados_hoy: c.n,
                inventario: { unidades: Number(inv.unidades), stock_bajo: Number(inv.stock_bajo || 0), sin_existencias: Number(inv.sin_existencias || 0) }
            });
        } catch (error) {
            responderError(res, error, ' ');
        }
    };
}

export const reporteController = new ReporteController();
