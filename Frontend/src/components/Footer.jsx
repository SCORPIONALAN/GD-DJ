/**
 * Footer — pie de página con info de contacto y redes sociales.
 */
import { Link } from 'react-router-dom';
import HudDivider from './HudDivider';

const SOCIAL = [
  { href: 'https://instagram.com/', label: 'Instagram', icon: '📸' },
  { href: 'https://wa.me/521',      label: 'WhatsApp',  icon: '💬' },
  { href: 'https://amazon.com/',    label: 'Amazon',    icon: '🛒' },
];

const NAV_LINKS = [
  { to: '/#servicios', label: 'Servicios' },
  { to: '/catalogo',   label: 'Catálogo' },
  { to: '/blog',       label: 'Blog' },
  { to: '/reservar',   label: 'Reservar' },
];

export default function Footer() {
  return (
    <footer className="bg-bg-1 border-t border-cyan/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Marca */}
          <div>
            <img src="/assets/gd-mono.png" alt="GD DJ" className="h-10 w-auto mb-4 opacity-80" />
            <p className="text-ink-dim text-sm leading-relaxed max-w-xs">
              Sonido profesional para bodas, quinceañeras, eventos corporativos y más.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 flex items-center justify-center bg-bg-2 border border-cyan/10 rounded hover:border-cyan/40 hover:shadow-cyan transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div>
            <p className="section-label mb-4">Navegación</p>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-ink-dim text-sm hover:text-cyan transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="section-label mb-4">Contacto</p>
            <ul className="flex flex-col gap-2 text-sm text-ink-dim">
              <li>📧 contacto@djgd.com</li>
              <li>📱 +52 1 (800) 000-0000</li>
              <li>📍 México</li>
            </ul>
          </div>
        </div>

        <HudDivider className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-mute">
          <p>© {new Date().getFullYear()} Gustavo Delgadillo DJ. Todos los derechos reservados.</p>
          <Link to="/admin/login" className="hover:text-cyan transition-colors">
            Panel de administración
          </Link>
        </div>
      </div>
    </footer>
  );
}
