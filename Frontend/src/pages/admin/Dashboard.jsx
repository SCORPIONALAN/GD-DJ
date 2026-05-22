/**
 * Dashboard — resumen de métricas del negocio.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../lib/api';

function StatCard({ label, value, color = 'text-cyan', to }) {
  const content = (
    <div className="card-hud hover:scale-105 transition-transform">
      <p className="section-label mb-3">{label}</p>
      <p className={`font-display text-4xl font-black ${color}`}>{value ?? '—'}</p>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getSalesStats(),
      adminAPI.getBookings({ limit: 1 }),
      adminAPI.getLeads({ limit: 1 }),
      adminAPI.getReviews({ status: 'pending' }),
    ])
      .then(([salesRes, bookingsRes, leadsRes, reviewsRes]) => {
        setStats({
          totalVentas:  salesRes.data.total ?? 0,
          reservas:     bookingsRes.data.total ?? 0,
          leads:        leadsRes.data.total ?? 0,
          resenasPend:  reviewsRes.data.length ?? 0,
        });
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <p className="section-label">Panel de control</p>
      <h1 className="section-title mb-8">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-hud animate-pulse">
              <div className="h-3 bg-bg-3 rounded w-24 mb-4" />
              <div className="h-10 bg-bg-3 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Ventas totales" value={`$${(stats?.totalVentas ?? 0).toLocaleString('es-MX')}`} to="/admin/ventas" />
          <StatCard label="Reservas"   value={stats?.reservas} color="text-magenta" to="/admin/reservas" />
          <StatCard label="Leads"      value={stats?.leads}    color="text-amber"   to="/admin/leads" />
          <StatCard label="Reseñas por revisar" value={stats?.resenasPend} color="text-neon-green" to="/admin/resenas" />
        </div>
      )}

      {/* Accesos rápidos */}
      <p className="section-label mb-4">Accesos rápidos</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {[
          { to: '/admin/servicios', label: 'Servicios',  icon: '🎧' },
          { to: '/admin/productos', label: 'Productos',  icon: '🎛' },
          { to: '/admin/blog',      label: 'Blog',       icon: '📝' },
          { to: '/admin/faqs',      label: 'FAQs',       icon: '❓' },
          { to: '/admin/config',    label: 'Config',     icon: '⚙' },
        ].map(({ to, label, icon }) => (
          <Link
            key={to} to={to}
            className="flex flex-col items-center gap-2 p-4 bg-bg-1 border border-cyan/10 rounded-lg hover:border-cyan/30 hover:bg-bg-2 transition-all text-center"
          >
            <span className="text-2xl">{icon}</span>
            <span className="font-mono text-xs uppercase tracking-wider text-ink-dim">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
