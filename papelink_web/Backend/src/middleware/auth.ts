import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/seguridad';
import { ErrorHttp, responderError } from '../utils/errores';

export interface AuthRequest extends Request {
    user?: { id: number; rol: 'cliente' | 'empleado' | 'admin'; nombre: string };
}

// Valida el token "Authorization: Bearer xxx" y deja los datos del usuario en req.user
export const autenticar = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const cabecera = req.headers.authorization || '';
    const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null;
    if (!token) {
        responderError(res, new ErrorHttp(401, 'Inicia sesión para continuar', 'TOKEN_FALTANTE'));
        return;
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            responderError(res, new ErrorHttp(401, 'Tu sesión expiró, vuelve a iniciar sesión', 'SESION_EXPIRADA'));
        } else {
            responderError(res, new ErrorHttp(401, 'La sesión no es válida, vuelve a iniciar sesión', 'TOKEN_INVALIDO'));
        }
    }
};

// Solo deja pasar a los roles indicados: soloRol('empleado', 'admin')
export const soloRol = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && roles.includes(req.user.rol)) {
        next();
        return;
    }
    responderError(res, new ErrorHttp(403, 'No tienes permiso para esta acción', 'SIN_PERMISO'));
};

export const soloPersonal = soloRol('empleado', 'admin');
export const soloAdmin = soloRol('admin');