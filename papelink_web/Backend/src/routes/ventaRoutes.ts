import { Router } from 'express';
import { ventaController } from '../controllers/VentaController';
import { autenticar, soloPersonal } from '../middleware/auth';

// ============================================================================
// RUTAS DE VENTAS (POS, personal). Prefijo montado en index.ts: /api/ventas
// ============================================================================
const router = Router();
router.use(autenticar, soloPersonal);

// POST /api/ventas -> registra una venta de mostrador
router.post('/', ventaController.crear);

// GET /api/ventas?desde=&hasta= -> historial de ventas
router.get('/', ventaController.getAll);

// GET /api/ventas/:id -> detalle del ticket
router.get('/:id', ventaController.getOne);

export default router;
