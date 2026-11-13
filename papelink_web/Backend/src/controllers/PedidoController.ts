import { Response } from 'express';
import { pool, conTransaccion } from '../config/database';
import { Pedido, DetallePedido } from '../models/Pedido';
import { AuthRequest } from '../middleware/auth';
import { cargarLineas } from '../utils/lineas';
import { ErrorHttp, responderError } from '../utils/errores';

// CONTROLADOR DE PEDIDOS (APARTADOS): El cliente aparta desde la app y el
// personal los confirma, los deja listos y los cobra en el mostrador.
// El stock se aparta al crear el pedido y se devuelve al cancelarlo: eso lo
// hacen los triggers de la base de datos, aquí solo se manda el pedido.

// Cambios de estado que puede hacer el personal ('completado' solo con /cobrar)
const SIGUIENTE: Record<string, string[]> = {
    pendiente: ['confirmado_apartado', 'cancelado'],
    confirmado_apartado: ['listo_en_tienda', 'cancelado'],
    listo_en_tienda: ['cancelado']
};

class PedidoController {

    // MÉTODO (cliente): Crear apartado. Body: { items: [{ producto_id, cantidad }] }
    public crear = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { items, fecha_limite_recogida } = req.body;
            const id = await conTransaccion(async (conn) => {
                const { lineas, total } = await cargarLineas(conn, items);
                const [p]: any = await conn.query(
                    'INSERT INTO pedidos (usuario_id, total, fecha_limite_recogida) VALUES (?, ?, ?)',
                    [req.user!.id, total, fecha_limite_recogida || null]
                );
                for (const l of lineas) {
                    await conn.query(
                        'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                        [p.insertId, l.producto_id, l.cantidad, l.precio_unitario]
                    );
                }
                return p.insertId;
            });
            const [rows]: any = await pool.query('SELECT * FROM v_pedidos WHERE id = ?', [id]);
            res.status(201).json({ message: 'Apartado creado', pedido: new Pedido(rows[0]) });
        } catch (error) {
            responderError(res, error, 'Error al crear el apartado');
        }
    };

    // MÉTODO (cliente): Mis apartados con su estatus
    public misPedidos = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM v_pedidos WHERE usuario_id = ? ORDER BY id DESC', [req.user!.id]);
            res.status(200).json(rows.map((f: any) => new Pedido(f)));
        } catch (error) {
            responderError(res, error, 'Error al obtener tus apartados');
        }
    };

    // MÉTODO (personal): Todos los apartados. Filtro opcional ?estado=pendiente
    public getAll = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const estado = req.query.estado ? String(req.query.estado) : null;
            const [rows]: any = estado
                ? await pool.query('SELECT * FROM v_pedidos WHERE estado = ? ORDER BY id DESC', [estado])
                : await pool.query('SELECT * FROM v_pedidos ORDER BY id DESC LIMIT 300');
            res.status(200).json(rows.map((f: any) => new Pedido(f)));
        } catch (error) {
            responderError(res, error, 'Error al obtener los apartados');
        }
    };

    // MÉTODO: Detalle de un apartado (su dueño o el personal)
    public getOne = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM v_pedidos WHERE id = ?', [req.params.id]);
            if (!rows[0]) throw new ErrorHttp(404, 'Pedido no encontrado');
            const pedido = new Pedido(rows[0]);
            if (req.user!.rol === 'cliente' && pedido.usuario_id !== req.user!.id) throw new ErrorHttp(403, 'No tienes permiso para ver este pedido');

            const [detalle]: any = await pool.query(
                `SELECT d.producto_id, p.nombre, p.imagen_url, d.cantidad, d.precio_unitario, d.cantidad * d.precio_unitario AS subtotal
                   FROM detalle_pedidos d JOIN productos p ON p.id = d.producto_id WHERE d.pedido_id = ?`, [req.params.id]
            );
            pedido.detalle = detalle.map((f: any) => new DetallePedido(f));
            res.status(200).json(pedido);
        } catch (error) {
            responderError(res, error, 'Error al obtener el pedido');
        }
    };

    // MÉTODO (cliente): Cancelar su apartado mientras no esté listo (el trigger regresa el stock)
    public cancelarMio = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const [r]: any = await pool.query(
                `UPDATE pedidos SET estado = 'cancelado'
                  WHERE id = ? AND usuario_id = ? AND estado IN ('pendiente', 'confirmado_apartado')`,
                [req.params.id, req.user!.id]
            );
            if (!r.affectedRows) throw new ErrorHttp(409, 'No se puede cancelar este pedido');
            res.status(200).json({ message: 'Apartado cancelado' });
        } catch (error) {
            responderError(res, error, 'Error al cancelar el apartado');
        }
    };

    // MÉTODO (personal): Avanzar el estado. Body: { estado }
    public cambiarEstado = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const nuevo = req.body?.estado;
            await conTransaccion(async (conn) => {
                const [rows]: any = await conn.query('SELECT estado FROM pedidos WHERE id = ? FOR UPDATE', [req.params.id]);
                if (!rows[0]) throw new ErrorHttp(404, 'Pedido no encontrado');
                if (!SIGUIENTE[rows[0].estado]?.includes(nuevo))
                    throw new ErrorHttp(409, `No se puede pasar de "${rows[0].estado}" a "${nuevo}"`);
                await conn.query('UPDATE pedidos SET estado = ? WHERE id = ?', [nuevo, req.params.id]);
            });
            res.status(200).json({ message: 'Estado actualizado' });
        } catch (error) {
            responderError(res, error, 'Error al cambiar el estado');
        }
    };

    // MÉTODO (personal, POS): Cobrar y entregar. Crea la venta y marca el pedido como completado.
    public cobrar = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const metodo = req.body?.metodo_pago;
            if (!['efectivo', 'tarjeta', 'transferencia'].includes(metodo)) throw new ErrorHttp(400, 'metodo_pago inválido');
            const [resultado]: any = await pool.query('CALL sp_completar_pedido(?, ?, ?)', [req.params.id, req.user!.id, metodo]);
            res.status(200).json({ message: 'Apartado cobrado y entregado', venta_id: resultado[0][0].venta_id });
        } catch (error) {
            responderError(res, error, 'Error al cobrar el apartado');
        }
    };
}

export const pedidoController = new PedidoController();
