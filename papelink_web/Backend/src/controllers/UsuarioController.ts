import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database';
import { Usuario } from '../models/Usuario';
import { AuthRequest } from '../middleware/auth';
import { ErrorHttp, responderError } from '../utils/errores';

// CONTROLADOR DE USUARIOS (solo admin): lista las cuentas, da de alta
// empleados / admins y activa o desactiva cuentas (sin borrar su historial).
class UsuarioController {

    public getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
            res.status(200).json(rows.map((f: any) => ({ ...new Usuario(f), activo: f.activo, created_at: f.created_at })));
        } catch (error) {
            responderError(res, error, 'Error al obtener usuarios');
        }
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nombre, email, password, telefono, rol = 'empleado' } = req.body;
            if (!nombre?.trim() || !email || typeof password !== 'string' || password.length < 8)
                throw new ErrorHttp(400, 'nombre, email y contraseña (mínimo 8 caracteres) son obligatorios');
            if (!['cliente', 'empleado', 'admin'].includes(rol)) throw new ErrorHttp(400, 'Rol inválido');

            const hash = await bcrypt.hash(password, 10);
            const [ins]: any = await pool.query(
                'INSERT INTO usuarios (nombre, email, password, telefono, rol) VALUES (?, ?, ?, ?, ?)',
                [nombre.trim(), String(email).toLowerCase().trim(), hash, telefono || null, rol]
            );
            res.status(201).json({ message: 'Usuario creado', id: ins.insertId });
        } catch (error) {
            responderError(res, error, 'Error al crear usuario');
        }
    };

    public setActivo = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (Number(req.params.id) === req.user!.id) throw new ErrorHttp(400, 'No puedes desactivarte a ti mismo');
            await pool.query('UPDATE usuarios SET activo = ? WHERE id = ?', [req.body?.activo ? 1 : 0, req.params.id]);
            res.status(200).json({ message: 'Usuario actualizado' });
        } catch (error) {
            responderError(res, error, 'Error al actualizar usuario');
        }
    };
}

export const usuarioController = new UsuarioController();
