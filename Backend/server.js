import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

import connectDB from './config/db.js';

// ─── Middleware propios (se agregan en la siguiente pieza) ───────────────────
// import { sanitize } from './middleware/sanitize.js';

// ─── Rutas de autenticacion ──────────────────────────────────────────────────
// import authRoutes from './routes/auth.js';

// ─── Rutas de administracion ─────────────────────────────────────────────────
// import adminBlogRoutes     from './routes/admin/blog.js';
// import adminBookingRoutes  from './routes/admin/bookings.js';
// import adminConfigRoutes   from './routes/admin/config.js';
// import adminFaqRoutes      from './routes/admin/faqs.js';
// import adminLeadRoutes     from './routes/admin/leads.js';
// import adminProductRoutes  from './routes/admin/products.js';
// import adminReviewRoutes   from './routes/admin/reviews.js';
// import adminSaleRoutes     from './routes/admin/sales.js';
// import adminServiceRoutes  from './routes/admin/services.js';

// ─── Rutas publicas ──────────────────────────────────────────────────────────
// import publicBlogRoutes     from './routes/public/blog.js';
// import publicBookingRoutes  from './routes/public/bookings.js';
// import publicConfigRoutes   from './routes/public/config.js';
// import publicFaqRoutes      from './routes/public/faqs.js';
// import publicLeadRoutes     from './routes/public/leads.js';
// import publicProductRoutes  from './routes/public/products.js';
// import publicReviewRoutes   from './routes/public/reviews.js';
// import publicServiceRoutes  from './routes/public/services.js';

const app = express();

// ─── Headers de seguridad HTTP ───────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

// ─── Rate limiting global (100 req / 15 min por IP) ──────────────────────────
const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { message: 'Demasiadas solicitudes, intenta de nuevo mas tarde' },
});
app.use('/api', globalLimiter);

// ─── Rate limiting estricto para autenticacion (10 req / 15 min) ─────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { message: 'Demasiados intentos, intenta de nuevo mas tarde' },
});
app.use('/api/auth', authLimiter);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Logging en desarrollo ────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ─── Sanitizacion global (se activa en la siguiente pieza) ───────────────────
// app.use(sanitize);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

// ─── Rutas ───────────────────────────────────────────────────────────────────
// app.use('/api/auth', authRoutes);

// Admin
// app.use('/api/admin/blog',     adminBlogRoutes);
// app.use('/api/admin/bookings', adminBookingRoutes);
// app.use('/api/admin/config',   adminConfigRoutes);
// app.use('/api/admin/faqs',     adminFaqRoutes);
// app.use('/api/admin/leads',    adminLeadRoutes);
// app.use('/api/admin/products', adminProductRoutes);
// app.use('/api/admin/reviews',  adminReviewRoutes);
// app.use('/api/admin/sales',    adminSaleRoutes);
// app.use('/api/admin/services', adminServiceRoutes);

// Publicas
// app.use('/api/public/blog',     publicBlogRoutes);
// app.use('/api/public/bookings', publicBookingRoutes);
// app.use('/api/public/config',   publicConfigRoutes);
// app.use('/api/public/faqs',     publicFaqRoutes);
// app.use('/api/public/leads',    publicLeadRoutes);
// app.use('/api/public/products', publicProductRoutes);
// app.use('/api/public/reviews',  publicReviewRoutes);
// app.use('/api/public/services', publicServiceRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// ─── Error handler global ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
  });
});

// ─── Inicio ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} [${process.env.NODE_ENV}]`);
  });
});
