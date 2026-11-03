import { Router } from 'express';
import { productoController } from '../controllers/ProductoController';
import { autenticar, soloPersonal, soloAdmin } from '../middleware/auth';

// ============================================================================
// RUTAS DE PRODUCTOS / INVENTARIO. Prefijo montado en index.ts: /api/productos
// (las rutas fijas van antes que /:id para que no se confundan)
// ============================================================================
const router = Router();

// GET /api/productos?categoria=1&q=lapiz -> catálogo público con stock
router.get('/', productoController.catalogo);

// GET /api/productos/inventario -> inventario completo con estatus (personal)
router.get('/inventario', autenticar, soloPersonal, productoController.inventario);

// GET /api/productos/codigo/:codigo -> busca por código de barras o SKU (POS)
router.get('/codigo/:codigo', autenticar, soloPersonal, productoController.porCodigo);

// GET /api/productos/:id -> detalle de un producto
router.get('/:id', productoController.getOne);

// POST /api/productos -> alta de producto (personal)
router.post('/', autenticar, soloPersonal, productoController.create);

// PUT /api/productos/:id -> edita precio, nombre, etc. (personal)
router.put('/:id', autenticar, soloPersonal, productoController.update);

// PATCH /api/productos/:id/stock -> editar existencia { stock } o { delta } (personal)
router.patch('/:id/stock', autenticar, soloPersonal, productoController.ajustarStock);

// DELETE /api/productos/:id -> baja lógica (admin)
router.delete('/:id', autenticar, soloAdmin, productoController.delete);

export default router;
