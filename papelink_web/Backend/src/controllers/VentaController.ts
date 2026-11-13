import { Response } from 'express';
import { pool, conTransaccion } from '../config/database';
import { Venta, DetalleVenta } from '../models/Venta';
import { AuthRequest } from '../middleware/auth';
import { cargarLineas } from '../utils/lineas';
import { ErrorHttp, responderError } from '../utils/errores';

// CONTROLADOR DE VENTAS (POS): Cobros directos en el mostrador por parte del
// empleado o el dueño. El trigger de la base descuenta el stock y rechaza la
// venta si no alcanzan las existencias.
class VentaController {

    // MÉTODO: Registrar venta. Body: { metodo_pago, items: [{ producto_id, cantidad }] }
    public crear = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { items, metodo_pago } = req.body;
            if (!['efectivo', 'tarjeta', 'transferencia'].includes(metodo_pago)) throw new ErrorHttp(400, 'metodo_pago inválido');

            const id = await conTransaccion(async (conn) => {
                const { lineas, total } = await cargarLineas(conn, items);
                const [v]: any = await conn.query(
                    'INSERT INTO ventas (usuario_id, total, metodo_pago) VALUES (?, ?, ?)', [req.user!.id, total, metodo_pago]
                );
                for (const l of lineas) {
                    await conn.query(
                        'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                        [v.insertId, l.producto_id, l.cantidad, l.precio_unitario]
                    );
                }
                return v.insertId;
            });
            const [rows]: any = await pool.query('SELECT * FROM v_ventas WHERE id = ?', [id]);
            res.status(201).json({ message: 'Venta registrada', venta: new Venta(rows[0]) });
        } catch (error) {
            responderError(res, error, 'Error al registrar la venta');
        }
    };

    // MÉTODO: Historial. Filtros opcionales ?desde=2026-10-14&hasta=2026-10-14 (inclusivos)
    public getAll = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { desde, hasta } = req.query;
            const where: string[] = [];
            const params: any[] = [];
            if (desde) { where.push('fecha_venta >= ?'); params.push(String(desde)); }
            if (hasta) { where.push('fecha_venta < DATE_ADD(?, INTERVAL 1 DAY)'); params.push(String(hasta)); }
            const [rows]: any = await pool.query(
                `SELECT * FROM v_ventas ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY id DESC LIMIT 500`, params
            );
            res.status(200).json(rows.map((f: any) => new Venta(f)));
        } catch (error) {
            responderError(res, error, 'Error al obtener las ventas');
        }
    };

    // MÉTODO: Detalle de una venta (artículos del ticket)
    public getOne = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM v_ventas WHERE id = ?', [req.params.id]);
            if (!rows[0]) throw new ErrorHttp(404, 'Venta no encontrada');
            const venta = new Venta(rows[0]);
            const [detalle]: any = await pool.query(
                `SELECT d.producto_id, p.nombre, d.cantidad, d.precio_unitario, d.cantidad * d.precio_unitario AS subtotal
                   FROM detalle_ventas d JOIN productos p ON p.id = d.producto_id WHERE d.venta_id = ?`, [req.params.id]
            );
            venta.detalle = detalle.map((f: any) => new DetalleVenta(f));
            res.status(200).json(venta);
        } catch (error) {
            responderError(res, error, 'Error al obtener la venta');
        }
    };
}

export const ventaController = new VentaController();
