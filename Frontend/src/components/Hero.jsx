/**
 * Hero — sección principal con video de fondo, efecto glitch en el título
 * y CTAs hacia WhatsApp, reservas e Instagram.
 */
import { Link } from 'react-router-dom';
import ThreeBg from './ThreeBg';
import { useGlitch } from '../hooks/useGlitch';

export default function Hero() {
  const glitching = useGlitch();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo: Three.js */}
      <ThreeBg />

      {/* Video de fondo con baja opacidad */}
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        aria-hidden="true"
      >
        <source src="/assets/FE8097BE-2C22-4D19-89BA-407922426329.mp4" type="video/mp4" />
      </video>

      {/* Scanlines decorativas */}
      <div className="absolute inset-0 scanlines pointer-events-none" aria-hidden="true" />

      {/* Gradiente de oscurecimiento en los bordes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #06060c 80%)' }}
        aria-hidden="true"
      />

      {/* Contenido */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Label */}
        <p className="section-label text-base mb-6 animate-pulse-neon">
          ◈ DJ Profesional ◈
        </p>

        {/* Título con glitch */}
        <h1
          className={`font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-none mb-6 ${
            glitching ? 'text-glow-cyan' : ''
          }`}
          style={glitching ? {
            textShadow: '3px 0 #ff00aa, -3px 0 #00f5ff',
            animation: 'none',
          } : {}}
        >
          <span className="text-gradient">Gustavo</span>
          <br />
          <span className="text-ink">Delgadillo</span>
        </h1>

        <p className="font-body text-lg md:text-xl text-ink-dim max-w-2xl mx-auto mb-10">
          Bodas · Quinceañeras · Eventos corporativos · Fiestas privadas
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://wa.me/521"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            💬 WhatsApp
          </a>

          <Link to="/reservar" className="btn-outline">
            Reservar fecha
          </Link>

          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline border-magenta/30 text-magenta hover:bg-magenta hover:text-bg-0 hover:border-magenta"
          >
            📸 Instagram
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-20 flex flex-col items-center gap-2 opacity-40">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-cyan to-transparent" />
        </div>
      </div>
    </section>
  );
}
