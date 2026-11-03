import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/seguridad';

// ============================================================================
// AUTENTICACIÓN: Revisa que cada petición traiga su token de sesión y que el
// rol (cliente / empleado / admin) tenga permiso para entrar a la ruta.
// ============================================================================
export interface AuthRequest extends Request {
    user?: { id: number; rol: 'cliente' | 'empleado' | 'admin'; nombre: string };
}

// Valida el token "Authorization: Bearer xxx" y deja los datos en req.user
export const autenticar = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const cabecera = req.headers.authorization || '';
    const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null;
    if (!token) { res.status(401).json({ message: 'No autenticado' }); return; }
    try {
        req.user = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
        next();
    } catch {
        res.status(401).json({ message: 'Sesión inválida o expirada' });
    }
};

// Solo deja pasar a los roles indicados: soloRol('empleado', 'admin')
export const soloRol = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && roles.includes(req.user.rol)) next();
    else res.status(403).json({ message: 'No tienes permiso para esta acción' });
};

export const soloPersonal = soloRol('empleado', 'admin');
export const soloAdmin = soloRol('admin');
