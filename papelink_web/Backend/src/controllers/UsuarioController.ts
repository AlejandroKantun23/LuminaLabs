import { Request, Response } from 'express';
import { emailExiste, crearUsuario } from '../repositories/UsuarioRepositories';
import { validarNombre, validarEmail, validarPassword, validarTelefono } from '../utils/validaciones';
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
            const nombre = validarNombre(req.body?.nombre);
            const email = validarEmail(req.body?.email);
            const password = validarPassword(req.body?.password);
            const telefono = validarTelefono(req.body?.telefono);
            const rol = req.body?.rol ?? 'empleado';
            if (!['cliente', 'empleado', 'admin'].includes(rol)) {
                throw new ErrorHttp(400, 'El rol debe ser cliente, empleado o admin', 'ROL_INVALIDO');
            }
            if (await emailExiste(email)) {
                throw new ErrorHttp(409, 'Ese correo ya está registrado', 'EMAIL_YA_REGISTRADO');
            }
            const id = await crearUsuario({ nombre, email, password, telefono, rol });
            res.status(201).json({ message: 'Usuario creado', id });
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
