import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Categoria } from '../models/Categoria';
import { ErrorHttp, responderError } from '../utils/errores';

// ============================================================================
// CONTROLADOR DE CATEGORÍAS: Las puede ver cualquiera (catálogo de la app);
// solo el admin las crea, edita o borra.
// ============================================================================
class CategoriaController {

    public getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM categorias ORDER BY nombre');
            res.status(200).json(rows.map((f: any) => new Categoria(f)));
        } catch (error) {
            responderError(res, error, 'Error al obtener categorías');
        }
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nombre, descripcion } = req.body;
            if (!nombre?.trim()) throw new ErrorHttp(400, 'El nombre es obligatorio');
            const [ins]: any = await pool.query(
                'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [nombre.trim(), descripcion || null]
            );
            res.status(201).json({ message: 'Categoría creada', id: ins.insertId });
        } catch (error) {
            responderError(res, error, 'Error al crear categoría');
        }
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nombre, descripcion } = req.body;
            if (!nombre?.trim()) throw new ErrorHttp(400, 'El nombre es obligatorio');
            await pool.query('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
                [nombre.trim(), descripcion || null, req.params.id]);
            res.status(200).json({ message: 'Categoría actualizada' });
        } catch (error) {
            responderError(res, error, 'Error al actualizar categoría');
        }
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await pool.query('DELETE FROM categorias WHERE id = ?', [req.params.id]);
            res.status(200).json({ message: 'Categoría eliminada' });
        } catch (error: any) {
            if (error?.code === 'ER_ROW_IS_REFERENCED_2')
                res.status(409).json({ message: 'La categoría tiene productos; muévelos antes de borrarla' });
            else responderError(res, error, 'Error al eliminar categoría');
        }
    };
}

export const categoriaController = new CategoriaController();
