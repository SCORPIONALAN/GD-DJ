import { Router } from 'express';
import { getAll, create, update, remove } from '../../controllers/serviceController.js';
import { protect } from '../../middleware/auth.js';
import { validate, r } from '../../middleware/validate.js';
import { uploadMultiple } from '../../middleware/upload.js';

const router = Router();
router.use(protect);

router.get('/', getAll);

router.post(
  '/',
  uploadMultiple('services', 'images'),
  validate({
    name:  [r.required(), r.maxLength(200)],
    price: [r.required(), r.isFloat({ min: 0 })],
  }),
  create
);

router.put(
  '/:id',
  validate({ id: [r.required(), r.mongoId()] }),
  uploadMultiple('services', 'images'),
  update
);

router.delete('/:id', validate({ id: [r.required(), r.mongoId()] }), remove);

export default router;
