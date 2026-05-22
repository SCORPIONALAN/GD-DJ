import { Router } from 'express';
import { getActive } from '../../controllers/faqController.js';

const router = Router();

router.get('/', getActive);

export default router;
