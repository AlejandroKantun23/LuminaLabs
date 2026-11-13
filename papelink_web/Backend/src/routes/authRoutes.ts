import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { autenticar } from '../middleware/auth';

// RUTAS DE AUTENTICACIÓN. Prefijo montado en index.ts: /api/auth
const router = Router();

// POST /api/auth/register -> registro de cliente (teléfono opcional)
router.post('/register', authController.register);

// POST /api/auth/login -> valida correo y contraseña, responde con el token
router.post('/login', authController.login);

// GET /api/auth/me -> datos del usuario con sesión iniciada
router.get('/me', autenticar, authController.me);

export default router;
