import { Router } from 'express';
import { getAvailability, createPublic } from '../../controllers/bookingController.js';
import { validate, r } from '../../middleware/validate.js';

const router = Router();

router.get(
  '/availability',
  validate({
    serviceId: [r.required(), r.mongoId()],
    month:     [r.required(), r.isInt({ min: 1, max: 12 })],
    year:      [r.required(), r.isInt({ min: 2020 })],
  }),
  getAvailability
);

router.post(
  '/',
  validate({
    'client.name':  [r.required(), r.maxLength(100)],
    'client.email': [r.required(), r.email()],
    serviceId:      [r.required(), r.mongoId()],
    date:           [r.required(), r.isDate()],
    time:           [r.required(), r.isTime()],
  }),
  createPublic
);

export default router;
