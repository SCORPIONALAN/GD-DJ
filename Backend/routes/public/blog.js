import { Router } from 'express';
import { getPublished, getBySlug } from '../../controllers/blogController.js';

const router = Router();

router.get('/', getPublished);
router.get('/:slug', getBySlug);

export default router;
