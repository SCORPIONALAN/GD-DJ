import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { submit } from '../../controllers/leadController.js';
import { validate, r } from '../../middleware/validate.js';

const router = Router();

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      5,
  message:  { message: 'Demasiados mensajes enviados, intenta en una hora' },
});

router.post(
  '/',
  leadLimiter,
  validate({
    name:    [r.required(), r.maxLength(100)],
    email:   [r.required(), r.email()],
    message: [r.required(), r.maxLength(2000)],
  }),
  submit
);

export default router;
