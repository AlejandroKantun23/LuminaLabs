import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRA } from '../config/seguridad';
import { Usuario } from '../models/Usuario';
import { AuthRequest } from '../middleware/auth';
import { buscarParaLogin, buscarPorId, emailExiste, crearUsuario } from '../repositories/UsuarioRepositories';
import { ErrorHttp, responderError } from '../utils/errores';
import { validarNombre, validarEmail, validarPassword, validarTelefono } from '../utils/validaciones';

// Token de sesión con los datos mínimos que necesitan las rutas
const firmar = (u: Usuario): string =>
    jwt.sign({ id: u.id, rol: u.rol, nombre: u.nombre }, JWT_SECRET, { expiresIn: JWT_EXPIRA as any });

class AuthController {

    // Registro de cliente desde la app. El rol siempre es 'cliente' y el teléfono es opcional.
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const nombre = validarNombre(req.body?.nombre);
            const email = validarEmail(req.body?.email);
            const password = validarPassword(req.body?.password);
            const telefono = validarTelefono(req.body?.telefono);

            if (await emailExiste(email)) {
                throw new ErrorHttp(409, 'Ese correo ya está registrado', 'EMAIL_YA_REGISTRADO');
            }

            const id = await crearUsuario({ nombre, email, password, telefono, rol: 'cliente' });
            const usuario = new Usuario({ id, nombre, email, telefono, rol: 'cliente' });
            res.status(201).json({ message: 'Registro exitoso', token: firmar(usuario), user: usuario });
        } catch (error) {
            responderError(res, error, 'Error al registrar');
        }
    };

    // Inicio de sesión. Cada fallo responde con su propio mensaje y código.
    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = validarEmail(req.body?.email);
            const password = req.body?.password;
            if (typeof password !== 'string' || password === '') {
                throw new ErrorHttp(400, 'Escribe tu contraseña', 'PASSWORD_REQUERIDA');
            }

            const fila = await buscarParaLogin(email, password);
            if (!fila) {
                throw new ErrorHttp(404, 'No existe una cuenta con ese correo', 'EMAIL_NO_REGISTRADO');
            }
            if (!fila.password_ok) {
                throw new ErrorHttp(401, 'La contraseña es incorrecta', 'PASSWORD_INCORRECTA');
            }
            if (!fila.activo) {
                throw new ErrorHttp(403, 'Esta cuenta está desactivada, habla con el administrador', 'CUENTA_DESACTIVADA');
            }

            const usuario = new Usuario(fila);
            res.status(200).json({ message: 'Login exitoso', token: firmar(usuario), user: usuario });
        } catch (error) {
            responderError(res, error, 'Error al iniciar sesión');
        }
    };

    // Datos del usuario con la sesión iniciada
    public me = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const fila = await buscarPorId(req.user!.id);
            if (!fila || !fila.activo) {
                throw new ErrorHttp(401, 'Tu cuenta ya no existe o fue desactivada', 'USUARIO_NO_ENCONTRADO');
            }
            res.status(200).json(new Usuario(fila));
        } catch (error) {
            responderError(res, error);
        }
    };
}

export const authController = new AuthController();