import { Router } from 'express';
import { getAll, moderate, remove } from '../../controllers/reviewController.js';
import { protect } from '../../middleware/auth.js';
import { validate, r } from '../../middleware/validate.js';

const router = Router();
router.use(protect);

router.get('/', getAll);

router.patch(
  '/:id',
  validate({
    id:     [r.required(), r.mongoId()],
    status: [r.required(), r.isIn(['approved', 'rejected'])],
  }),
  moderate
);

router.delete('/:id', validate({ id: [r.required(), r.mongoId()] }), remove);

export default router;
