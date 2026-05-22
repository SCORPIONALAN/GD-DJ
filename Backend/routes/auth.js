import { Router } from 'express';
import { login, register, me, logout, changePassword } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate, r } from '../middleware/validate.js';

const router = Router();

router.post(
  '/login',
  validate({
    email:    [r.required(), r.email()],
    password: [r.required(), r.minLength(6)],
  }),
  login
);

// En produccion solo un superadmin puede registrar nuevos admins
router.post(
  '/register',
  process.env.NODE_ENV === 'production'
    ? [protect, authorize('superadmin')]
    : [],
  validate({
    name:     [r.required(), r.maxLength(80)],
    email:    [r.required(), r.email()],
    password: [r.required(), r.minLength(8)],
    role:     [r.isIn(['admin', 'superadmin'])],
  }),
  register
);

router.get('/me', protect, me);

router.post('/logout', protect, logout);

router.patch(
  '/change-password',
  protect,
  validate({
    currentPassword: [r.required()],
    newPassword:     [r.required(), r.minLength(8)],
  }),
  changePassword
);

export default router;
