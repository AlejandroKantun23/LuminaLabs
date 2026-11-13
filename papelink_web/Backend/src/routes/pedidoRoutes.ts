import { Router } from 'express';
import { pedidoController } from '../controllers/PedidoController';
import { autenticar, soloRol, soloPersonal } from '../middleware/auth';

// RUTAS DE PEDIDOS (APARTADOS). Prefijo montado en index.ts: /api/pedidos
const router = Router();
router.use(autenticar);

// POST /api/pedidos -> el cliente aparta artículos { items: [...] }
router.post('/', soloRol('cliente'), pedidoController.crear);

// GET /api/pedidos/mis -> los apartados del cliente con su estatus
router.get('/mis', soloRol('cliente'), pedidoController.misPedidos);

// GET /api/pedidos?estado=pendiente -> todos los apartados (personal)
router.get('/', soloPersonal, pedidoController.getAll);

// GET /api/pedidos/:id -> detalle con artículos (dueño o personal)
router.get('/:id', pedidoController.getOne);

// PATCH /api/pedidos/:id/cancelar -> el cliente cancela su apartado
router.patch('/:id/cancelar', soloRol('cliente'), pedidoController.cancelarMio);

// PATCH /api/pedidos/:id/estado -> confirmar / listo en tienda / cancelar (personal)
router.patch('/:id/estado', soloPersonal, pedidoController.cambiarEstado);

// POST /api/pedidos/:id/cobrar -> cobra y entrega en el POS { metodo_pago } (personal)
router.post('/:id/cobrar', soloPersonal, pedidoController.cobrar);

export default router;
