import { Router } from 'express';
import { reporteController } from '../controllers/ReporteController';
import { autenticar, soloPersonal } from '../middleware/auth';

// ============================================================================
// RUTAS DE REPORTES (personal). Prefijo montado en index.ts: /api/reportes
// ============================================================================
const router = Router();

// GET /api/reportes/resumen-dia -> tarjetas del panel de inicio
router.get('/resumen-dia', autenticar, soloPersonal, reporteController.resumenDia);

export default router;
