/**
 * Cliente Axios centralizado.
 *
 * - withCredentials: true  → envía la cookie httpOnly gd_token automáticamente
 * - No hay token en localStorage ni en headers manuales
 * - Un interceptor convierte errores 401 en redireccion al login
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,           // Necesario para que el browser envíe la cookie
  headers: { 'Content-Type': 'application/json' },
});

// Redirige al login cuando la sesión expira (solo en rutas admin)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      window.location.replace('/admin/login');
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:          (data) => api.post('/auth/login', data),
  logout:         ()     => api.post('/auth/logout'),
  me:             ()     => api.get('/auth/me'),
  changePassword: (data) => api.patch('/auth/change-password', data),
};

// ─── Públicas ─────────────────────────────────────────────────────────────────
export const publicAPI = {
  getServices:    ()       => api.get('/public/services'),
  getService:     (id)     => api.get(`/public/services/${id}`),

  getProducts:    (params) => api.get('/public/products', { params }),
  getProduct:     (id)     => api.get(`/public/products/${id}`),

  getFaqs:        (params) => api.get('/public/faqs', { params }),

  getReviews:     (params) => api.get('/public/reviews', { params }),
  submitReview:   (data)   => api.post('/public/reviews', data),

  getBlogPosts:   (params) => api.get('/public/blog', { params }),
  getBlogPost:    (slug)   => api.get(`/public/blog/${slug}`),

  getConfig:      ()       => api.get('/public/config'),

  getAvailability:(params) => api.get('/public/bookings/availability', { params }),
  createBooking:  (data)   => api.post('/public/bookings', data),

  submitLead:     (data)   => api.post('/public/leads', data),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  // Servicios
  getServices:    ()           => api.get('/admin/services'),
  createService:  (data)       => api.post('/admin/services', data),
  updateService:  (id, data)   => api.put(`/admin/services/${id}`, data),
  deleteService:  (id)         => api.delete(`/admin/services/${id}`),

  // Productos
  getProducts:    (params)     => api.get('/admin/products', { params }),
  createProduct:  (data)       => api.post('/admin/products', data),
  updateProduct:  (id, data)   => api.put(`/admin/products/${id}`, data),
  deleteProduct:  (id)         => api.delete(`/admin/products/${id}`),

  // Blog
  getBlogPosts:   (params)     => api.get('/admin/blog', { params }),
  createBlogPost: (data)       => api.post('/admin/blog', data),
  updateBlogPost: (id, data)   => api.put(`/admin/blog/${id}`, data),
  deleteBlogPost: (id)         => api.delete(`/admin/blog/${id}`),

  // FAQs
  getFaqs:        ()           => api.get('/admin/faqs'),
  createFaq:      (data)       => api.post('/admin/faqs', data),
  updateFaq:      (id, data)   => api.put(`/admin/faqs/${id}`, data),
  deleteFaq:      (id)         => api.delete(`/admin/faqs/${id}`),

  // Reseñas
  getReviews:     (params)     => api.get('/admin/reviews', { params }),
  updateReview:   (id, data)   => api.patch(`/admin/reviews/${id}`, data),
  deleteReview:   (id)         => api.delete(`/admin/reviews/${id}`),

  // Leads
  getLeads:       (params)     => api.get('/admin/leads', { params }),
  getLead:        (id)         => api.get(`/admin/leads/${id}`),
  updateLead:     (id, data)   => api.patch(`/admin/leads/${id}`, data),
  deleteLead:     (id)         => api.delete(`/admin/leads/${id}`),

  // Reservas
  getBookings:    (params)     => api.get('/admin/bookings', { params }),
  getBooking:     (id)         => api.get(`/admin/bookings/${id}`),
  updateBooking:  (id, data)   => api.patch(`/admin/bookings/${id}`, data),
  deleteBooking:  (id)         => api.delete(`/admin/bookings/${id}`),

  // Ventas
  getSalesStats:  (params)     => api.get('/admin/sales/stats', { params }),
  getSales:       (params)     => api.get('/admin/sales', { params }),
  getSale:        (id)         => api.get(`/admin/sales/${id}`),
  updateSale:     (id, data)   => api.patch(`/admin/sales/${id}`, data),

  // Config
  getConfig:      (params)     => api.get('/admin/config', { params }),
  upsertConfig:   (data)       => api.post('/admin/config', data),
  deleteConfig:   (key)        => api.delete(`/admin/config/${key}`),
};

export default api;
