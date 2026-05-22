import { Router } from 'express';
import { getAll, upsert, remove } from '../../controllers/configController.js';
import { protect, authorize } from '../../middleware/auth.js';
import { validate, r } from '../../middleware/validate.js';
/** Configuración de rutas para la administración de configuraciones */
const router = Router();
router.use(protect);

router.get('/', getAll);

router.post(
  '/',
  validate({
    key:   [r.required()],
    group: [r.isIn(['general', 'social', 'pagos'])],
  }),
  upsert
);

router.delete(
  '/:key',
  authorize('superadmin'),
  remove
);

export default router;
