import { Router } from 'express';
import { getStats, getAll, getOne, update } from '../../controllers/saleController.js';
import { protect } from '../../middleware/auth.js';
import { validate, r } from '../../middleware/validate.js';

const router = Router();
router.use(protect);

router.get('/stats', getStats);
router.get('/', getAll);
router.get('/:id', validate({ id: [r.required(), r.mongoId()] }), getOne);

router.patch(
  '/:id',
  validate({
    id:     [r.required(), r.mongoId()],
    status: [r.required(), r.isIn(['pending', 'paid', 'cancelled', 'refunded'])],
  }),
  update
);

export default router;
