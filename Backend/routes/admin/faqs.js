import { Router } from 'express';
import { getAll, create, update, remove } from '../../controllers/faqController.js';
import { protect } from '../../middleware/auth.js';
import { validate, r } from '../../middleware/validate.js';

const router = Router();
router.use(protect);

router.get('/', getAll);

router.post(
  '/',
  validate({
    question: [r.required(), r.maxLength(500)],
    answer:   [r.required()],
  }),
  create
);

router.put(
  '/:id',
  validate({ id: [r.required(), r.mongoId()] }),
  update
);

router.delete('/:id', validate({ id: [r.required(), r.mongoId()] }), remove);

export default router;
