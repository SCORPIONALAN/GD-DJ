import { Router } from 'express';
import { getAll, getOne, update, remove } from '../../controllers/leadController.js';
import { protect } from '../../middleware/auth.js';
import { validate, r } from '../../middleware/validate.js';

const router = Router();
router.use(protect);

router.get('/', getAll);
router.get('/:id', validate({ id: [r.required(), r.mongoId()] }), getOne);

router.patch(
  '/:id',
  validate({
    id:     [r.required(), r.mongoId()],
    status: [r.isIn(['new', 'contacted', 'converted', 'lost'])],
  }),
  update
);

router.delete('/:id', validate({ id: [r.required(), r.mongoId()] }), remove);

export default router;
