/**
 * App.jsx — Definición de rutas de la aplicación.
 *
 * Rutas públicas: accesibles por cualquier visitante.
 * Rutas /admin/*: protegidas, requieren sesión de administrador.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// ── Páginas públicas ──────────────────────────────────────────────────────────
import HomePage           from './pages/HomePage';
import CatalogoPage       from './pages/CatalogoPage';
import BlogPage           from './pages/BlogPage';
import BlogPostPage       from './pages/BlogPostPage';
import BookingPage        from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';

// ── Panel de administración ───────────────────────────────────────────────────
import AdminLogin    from './pages/admin/AdminLogin';
import AdminShell    from './pages/admin/AdminShell';
import Dashboard     from './pages/admin/Dashboard';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import BlogAdmin     from './pages/admin/BlogAdmin';
import FaqsAdmin     from './pages/admin/FaqsAdmin';
import ReviewsAdmin  from './pages/admin/ReviewsAdmin';
import LeadsAdmin    from './pages/admin/LeadsAdmin';
import BookingsAdmin from './pages/admin/BookingsAdmin';
import SalesAdmin    from './pages/admin/SalesAdmin';
import ConfigAdmin   from './pages/admin/ConfigAdmin';

/**
 * Ruta protegida: redirige al login si no hay sesión activa.
 * Muestra un spinner mientras la app verifica la cookie en el servidor.
 */
function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-0">
        <div className="w-8 h-8 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin" />
      </div>
    );
  }

  return admin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Públicas ───────────────────────────────────────────────────── */}
          <Route path="/"                   element={<HomePage />} />
          <Route path="/catalogo"           element={<CatalogoPage />} />
          <Route path="/blog"               element={<BlogPage />} />
          <Route path="/blog/:slug"         element={<BlogPostPage />} />
          <Route path="/reservar"           element={<BookingPage />} />
          <Route path="/reservar/exito"     element={<BookingSuccessPage status="exito" />} />
          <Route path="/reservar/fallo"     element={<BookingSuccessPage status="fallo" />} />
          <Route path="/reservar/pendiente" element={<BookingSuccessPage status="pendiente" />} />

          {/* ── Admin — login (público) ────────────────────────────────────── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Admin — protegidas ────────────────────────────────────────── */}
          <Route
            path="/admin"
            element={<ProtectedRoute><AdminShell /></ProtectedRoute>}
          >
            <Route index            element={<Dashboard />} />
            <Route path="servicios" element={<ServicesAdmin />} />
            <Route path="productos" element={<ProductsAdmin />} />
            <Route path="blog"      element={<BlogAdmin />} />
            <Route path="faqs"      element={<FaqsAdmin />} />
            <Route path="resenas"   element={<ReviewsAdmin />} />
            <Route path="leads"     element={<LeadsAdmin />} />
            <Route path="reservas"  element={<BookingsAdmin />} />
            <Route path="ventas"    element={<SalesAdmin />} />
            <Route path="config"    element={<ConfigAdmin />} />
          </Route>

          {/* ── 404 — redirige al inicio ───────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
