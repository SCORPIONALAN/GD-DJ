/**
 * Nav — barra de navegación principal.
 * Responsive: links ocultos en móvil, menú hamburguesa visible.
 * Se vuelve opaca al hacer scroll hacia abajo.
 */
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/#servicios', label: 'Servicios' },
  { to: '/catalogo',   label: 'Catálogo' },
  { to: '/#reservar',  label: 'Reservar' },
  { to: '/blog',       label: 'Blog' },
  { to: '/#contacto',  label: 'Contacto' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  // Detecta scroll para cambiar opacidad del fondo
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra el menú al redimensionar a desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 880) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-bg-0/95 backdrop-blur-md border-b border-cyan/10 shadow-cyan' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/assets/gd-mono.png"
            alt="Gustavo Delgadillo DJ"
            className="h-8 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <span className="font-display text-sm font-bold tracking-widest text-cyan hidden sm:block">
            GD DJ
          </span>
        </Link>

        {/* Links desktop (≥880px) */}
        <ul className="hidden md:flex items-center gap-1">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <a
                href={to}
                className="px-4 py-2 font-body text-sm text-ink-dim hover:text-cyan transition-colors duration-200 rounded"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + hamburguesa */}
        <div className="flex items-center gap-3">
          <Link to="/reservar" className="btn-primary hidden sm:inline-flex text-xs px-4 py-2">
            Reservar ahora
          </Link>

          {/* Botón hamburguesa */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2 group"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            <span className={`w-6 h-0.5 bg-cyan transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-cyan transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-cyan transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {open && (
        <div className="md:hidden bg-bg-1/98 backdrop-blur-md border-b border-cyan/10 px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-2">
            {LINKS.map(({ to, label }) => (
              <li key={to}>
                <a
                  href={to}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 font-body text-sm text-ink-dim hover:text-cyan hover:bg-cyan/5 rounded transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/reservar"
                onClick={() => setOpen(false)}
                className="btn-primary w-full justify-center text-xs py-2.5"
              >
                Reservar ahora
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
