import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { getApproved, submit } from '../../controllers/reviewController.js';
import { validate, r } from '../../middleware/validate.js';

const router = Router();

const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      3,
  message:  { message: 'Demasiadas resenas enviadas, intenta en una hora' },
});

router.get('/', getApproved);

router.post(
  '/',
  reviewLimiter,
  validate({
    'author.name':  [r.required(), r.maxLength(100)],
    'author.email': [r.required(), r.email()],
    rating:         [r.required(), r.isInt({ min: 1, max: 5 })],
    comment:        [r.required(), r.maxLength(2000)],
  }),
  submit
);

export default router;
