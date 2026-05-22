/**
 * AdminShell — layout del panel admin con sidebar de navegación.
 * El Outlet de React Router renderiza la página activa dentro del área de contenido.
 */
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin',           label: 'Dashboard',   icon: '◈', end: true },
  { to: '/admin/reservas',  label: 'Reservas',    icon: '📅' },
  { to: '/admin/servicios', label: 'Servicios',   icon: '🎧' },
  { to: '/admin/productos', label: 'Productos',   icon: '🎛' },
  { to: '/admin/leads',     label: 'Leads',       icon: '📨' },
  { to: '/admin/resenas',   label: 'Reseñas',     icon: '⭐' },
  { to: '/admin/blog',      label: 'Blog',        icon: '📝' },
  { to: '/admin/faqs',      label: 'FAQs',        icon: '❓' },
  { to: '/admin/ventas',    label: 'Ventas',      icon: '💰' },
  { to: '/admin/config',    label: 'Config',      icon: '⚙' },
];

export default function AdminShell() {
  const { admin, logout } = useAuth();
  const navigate  = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg-0 flex">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-bg-1 border-r border-cyan/10 flex flex-col
          transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto
          ${sideOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-cyan/10">
          <img src="/assets/gd-mono.png" alt="GD DJ" className="h-8 w-auto opacity-80" />
          <p className="font-mono text-xs text-cyan/40 mt-2 uppercase tracking-widest">Admin Panel</p>
        </div>

        {/* Links de navegación */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              onClick={() => setSideOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-body transition-colors ${
                  isActive
                    ? 'bg-cyan/10 text-cyan border-l-2 border-cyan pl-2.5'
                    : 'text-ink-dim hover:text-ink hover:bg-bg-2'
                }`
              }
            >
              <span className="text-base w-5">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Info del admin */}
        <div className="p-4 border-t border-cyan/10">
          <p className="font-body text-sm text-ink truncate">{admin?.name}</p>
          <p className="font-mono text-xs text-ink-mute truncate">{admin?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full text-xs text-magenta hover:text-ink font-mono border border-magenta/20 rounded px-3 py-1.5 hover:border-magenta/50 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay móvil */}
      {sideOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSideOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Área de contenido ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header móvil */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-cyan/10 bg-bg-1">
          <button
            type="button"
            onClick={() => setSideOpen(true)}
            className="p-2 text-cyan"
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <span className="font-display text-sm font-bold text-ink">Panel Admin</span>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
