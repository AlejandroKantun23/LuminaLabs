import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { JWT_SECRET, JWT_EXPIRA } from '../config/seguridad';
import { Usuario } from '../models/Usuario';
import { AuthRequest } from '../middleware/auth';
import { ErrorHttp, responderError } from '../utils/errores';

// ============================================================================
// CONTROLADOR DE AUTENTICACIÓN: Registro de clientes (app móvil) e inicio de
// sesión (app móvil y panel web). El password se guarda siempre con hash.
// ============================================================================
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Firma el token de sesión con los datos mínimos que necesitan las rutas
const firmar = (u: Usuario): string =>
    jwt.sign({ id: u.id, rol: u.rol, nombre: u.nombre }, JWT_SECRET, { expiresIn: JWT_EXPIRA as any });

class AuthController {

    // MÉTODO: Registro de cliente. El rol siempre es 'cliente' y el teléfono es opcional.
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nombre, email, password, telefono } = req.body;
            if (!nombre?.trim()) throw new ErrorHttp(400, 'El nombre es obligatorio');
            if (!EMAIL.test(email ?? '')) throw new ErrorHttp(400, 'Correo inválido');
            if (typeof password !== 'string' || password.length < 8)
                throw new ErrorHttp(400, 'La contraseña debe tener al menos 8 caracteres');

            const hash = await bcrypt.hash(password, 10);
            const [ins]: any = await pool.query(
                'INSERT INTO usuarios (nombre, email, password, telefono, rol) VALUES (?, ?, ?, ?, ?)',
                [nombre.trim(), email.toLowerCase().trim(), hash, telefono || null, 'cliente']
            );
            const usuario = new Usuario({ id: ins.insertId, nombre: nombre.trim(), email: email.toLowerCase().trim(), telefono, rol: 'cliente' });
            res.status(201).json({ message: 'Registro exitoso', token: firmar(usuario), user: usuario });
        } catch (error) {
            responderError(res, error, 'Error al registrar');
        }
    };

    // MÉTODO: Iniciar sesión con correo y contraseña
    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            if (!email || !password) throw new ErrorHttp(400, 'Correo y contraseña son obligatorios');

            const [rows]: any = await pool.query(
                'SELECT * FROM usuarios WHERE email = ? AND activo = 1', [String(email).toLowerCase().trim()]
            );
            const fila = rows[0];
            const correcto = fila && await bcrypt.compare(String(password), fila.password);
            if (!correcto) throw new ErrorHttp(401, 'Correo o contraseña incorrectos');

            const usuario = new Usuario(fila);
            res.status(200).json({ message: 'Login exitoso', token: firmar(usuario), user: usuario });
        } catch (error) {
            responderError(res, error, 'Error en login');
        }
    };

    // MÉTODO: Datos del usuario con sesión iniciada
    public me = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM usuarios WHERE id = ? AND activo = 1', [req.user!.id]);
            if (!rows[0]) throw new ErrorHttp(401, 'Usuario no encontrado');
            res.status(200).json(new Usuario(rows[0]));
        } catch (error) {
            responderError(res, error);
        }
    };
}

export const authController = new AuthController();
