import { Router } from 'express';
import { categoriaController } from '../controllers/CategoriaController';
import { autenticar, soloAdmin } from '../middleware/auth';

// RUTAS DE CATEGORÍAS. Prefijo montado en index.ts: /api/categorias
const router = Router();

// GET /api/categorias -> lista pública (la usa la app móvil)
router.get('/', categoriaController.getAll);

// POST /api/categorias -> crea una categoría (admin)
router.post('/', autenticar, soloAdmin, categoriaController.create);

// PUT /api/categorias/:id -> edita una categoría (admin)
router.put('/:id', autenticar, soloAdmin, categoriaController.update);

// DELETE /api/categorias/:id -> elimina una categoría sin productos (admin)
router.delete('/:id', autenticar, soloAdmin, categoriaController.delete);

export default router;
