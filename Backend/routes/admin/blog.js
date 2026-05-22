import { Router } from 'express';
import { getAll, create, update, remove } from '../../controllers/blogController.js';
import { protect } from '../../middleware/auth.js';
import { validate, r } from '../../middleware/validate.js';
import { uploadSingle } from '../../middleware/upload.js';

const router = Router();
router.use(protect);

router.get('/', getAll);

router.post(
  '/',
  uploadSingle('blog', 'featuredImage'),
  validate({ title: [r.required(), r.maxLength(200)] }),
  create
);

router.put(
  '/:id',
  validate({ id: [r.required(), r.mongoId()] }),
  uploadSingle('blog', 'featuredImage'),
  update
);

router.delete(
  '/:id',
  validate({ id: [r.required(), r.mongoId()] }),
  remove
);

export default router;
