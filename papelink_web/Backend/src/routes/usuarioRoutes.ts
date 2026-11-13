import { Router } from 'express';
import { usuarioController } from '../controllers/UsuarioController';
import { autenticar, soloAdmin } from '../middleware/auth';

// RUTAS DE USUARIOS (solo admin). Prefijo montado en index.ts: /api/usuarios
const router = Router();
router.use(autenticar, soloAdmin);

// GET /api/usuarios -> lista todas las cuentas
router.get('/', usuarioController.getAll);

// POST /api/usuarios -> da de alta un empleado o admin
router.post('/', usuarioController.create);

// PATCH /api/usuarios/:id/activo -> activa o desactiva una cuenta
router.patch('/:id/activo', usuarioController.setActivo);

export default router;
