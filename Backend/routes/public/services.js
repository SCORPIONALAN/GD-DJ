import { Router } from 'express';
import { getActive, getOneActive } from '../../controllers/serviceController.js';
import { validate, r } from '../../middleware/validate.js';

const router = Router();

router.get('/', getActive);
router.get('/:id', validate({ id: [r.required(), r.mongoId()] }), getOneActive);

export default router;
