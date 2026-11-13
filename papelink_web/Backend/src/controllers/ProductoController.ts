import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Producto } from '../models/Producto';
import { ErrorHttp, responderError } from '../utils/errores';

// CONTROLADOR DE PRODUCTOS / INVENTARIO: El catálogo es público (lo usa la
// app móvil); el inventario completo, el alta, la edición y los ajustes de
// existencias son solo para el personal. Borrar es una baja lógica (activo=0)
// para no perder el historial de ventas y pedidos.
const CAMPOS_EDITABLES = ['categoria_id', 'sku', 'nombre', 'descripcion', 'precio', 'stock', 'stock_minimo', 'codigo_barras', 'imagen_url', 'activo'];
const COLUMNAS_PUBLICAS = 'p.id, p.sku, p.codigo_barras, p.nombre, p.descripcion, p.categoria_id, c.nombre AS categoria, p.precio, p.stock, p.imagen_url';

class ProductoController {

    // MÉTODO: Catálogo para la app. Filtros opcionales: ?categoria=ID  ?q=texto
    public catalogo = async (req: Request, res: Response): Promise<void> => {
        try {
            const { categoria, q } = req.query;
            const limit = Math.min(Number(req.query.limit) || 100, 200);
            const offset = Math.max(Number(req.query.offset) || 0, 0);
            const where = ['p.activo = 1'];
            const params: any[] = [];
            if (categoria) { where.push('p.categoria_id = ?'); params.push(Number(categoria)); }
            if (q) { where.push('(p.nombre LIKE ? OR p.codigo_barras = ? OR p.sku = ?)'); params.push(`%${q}%`, String(q), String(q)); }

            const [rows]: any = await pool.query(
                `SELECT ${COLUMNAS_PUBLICAS} FROM productos p JOIN categorias c ON c.id = p.categoria_id
                  WHERE ${where.join(' AND ')} ORDER BY p.nombre LIMIT ? OFFSET ?`, [...params, limit, offset]
            );
            res.status(200).json(rows.map((f: any) => new Producto(f)));
        } catch (error) {
            responderError(res, error, 'Error al obtener el catálogo');
        }
    };

    // MÉTODO: Inventario completo para el panel (con stock mínimo y estatus)
    public inventario = async (req: Request, res: Response): Promise<void> => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM v_inventario ORDER BY nombre');
            res.status(200).json(rows.map((f: any) => new Producto(f)));
        } catch (error) {
            responderError(res, error, 'Error al obtener el inventario');
        }
    };

    // MÉTODO: Buscar por código de barras o SKU (lector del POS)
    public porCodigo = async (req: Request, res: Response): Promise<void> => {
        try {
            const [rows]: any = await pool.query(
                'SELECT * FROM v_inventario WHERE (codigo_barras = ? OR sku = ?) AND activo = 1',
                [req.params.codigo, req.params.codigo]
            );
            if (!rows[0]) throw new ErrorHttp(404, 'Producto no encontrado');
            res.status(200).json(new Producto(rows[0]));
        } catch (error) {
            responderError(res, error, 'Error al buscar el producto');
        }
    };

    public getOne = async (req: Request, res: Response): Promise<void> => {
        try {
            const [rows]: any = await pool.query(
                `SELECT ${COLUMNAS_PUBLICAS} FROM productos p JOIN categorias c ON c.id = p.categoria_id
                  WHERE p.id = ? AND p.activo = 1`, [req.params.id]
            );
            if (!rows[0]) throw new ErrorHttp(404, 'Producto no encontrado');
            res.status(200).json(new Producto(rows[0]));
        } catch (error) {
            responderError(res, error, 'Error al obtener el producto');
        }
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const b = req.body;
            if (!b.nombre?.trim() || !b.categoria_id || b.precio == null)
                throw new ErrorHttp(400, 'nombre, categoria_id y precio son obligatorios');
            const [ins]: any = await pool.query(
                `INSERT INTO productos (categoria_id, sku, nombre, descripcion, precio, stock, stock_minimo, codigo_barras, imagen_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [b.categoria_id, b.sku || null, b.nombre.trim(), b.descripcion ?? null, b.precio,
                 b.stock ?? 0, b.stock_minimo ?? 5, b.codigo_barras || null, b.imagen_url ?? null]
            );
            res.status(201).json({ message: 'Producto creado', id: ins.insertId });
        } catch (error) {
            responderError(res, error, 'Error al crear el producto');
        }
    };

    // MÉTODO: Editar solo los campos que lleguen en el body
    public update = async (req: Request, res: Response): Promise<void> => {
        try {
            const sets: string[] = [];
            const valores: any[] = [];
            for (const campo of CAMPOS_EDITABLES) {
                if (campo in (req.body ?? {})) { sets.push(`${campo} = ?`); valores.push(req.body[campo] === '' ? null : req.body[campo]); }
            }
            if (!sets.length) throw new ErrorHttp(400, 'No hay nada que actualizar');
            const [r]: any = await pool.query(`UPDATE productos SET ${sets.join(', ')} WHERE id = ?`, [...valores, req.params.id]);
            if (!r.affectedRows) throw new ErrorHttp(404, 'Producto no encontrado');
            res.status(200).json({ message: 'Producto actualizado' });
        } catch (error) {
            responderError(res, error, 'Error al actualizar el producto');
        }
    };

    public ajustarStock = async (req: Request, res: Response): Promise<void> => {
        try {
            const stock = Number(req.body?.stock);
            if (!Number.isInteger(stock) || stock < 0)
                throw new ErrorHttp(400, 'stock debe ser un entero mayor o igual a 0');

            const [rows]: any = await pool.query(
                'SELECT id FROM productos WHERE id = ? AND activo = 1',
                [req.params.id]
            );
            if (!rows[0]) throw new ErrorHttp(404, 'Producto no encontrado');

            await pool.query('UPDATE productos SET stock = ? WHERE id = ?', [stock, req.params.id]);
            res.status(200).json({ message: 'Existencia actualizada' });
        } catch (error) {
            responderError(res, error, 'Error al ajustar el stock');
        }
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await pool.query('UPDATE productos SET activo = 0 WHERE id = ?', [req.params.id]);
            res.status(200).json({ message: 'Producto dado de baja' });
        } catch (error) {
            responderError(res, error, 'Error al dar de baja el producto');
        }
    };
}

export const productoController = new ProductoController();
