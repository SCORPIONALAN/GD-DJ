/**
 * Servicios — tarjetas de paquetes DJ + calculadora interactiva de precios.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../lib/api';
import { useReveal } from '../hooks/useReveal';
import { useCalculator } from '../hooks/useCalculator';
import HudDivider from './HudDivider';

export default function Servicios() {
  const [services, setServices] = useState([]);
  const [ref, visible] = useReveal();
  const calc = useCalculator(services);

  useEffect(() => {
    publicAPI.getServices().then((r) => setServices(r.data)).catch(() => null);
  }, []);

  return (
    <section id="servicios" className="py-24 px-4 max-w-7xl mx-auto" ref={ref}>
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="section-label">Nuestros servicios</p>
        <h2 className="section-title mb-4">¿Qué incluye tu evento?</h2>
        <p className="text-ink-dim max-w-xl mb-12">
          Elige el paquete que mejor se adapte a tu celebración. Todos incluyen equipo profesional y DJ experimentado.
        </p>

        {/* Tarjetas de servicios */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((s) => (
              <div key={s._id} className="card-hud group cursor-pointer" onClick={() => calc.setSelectedService(s._id)}>
                {s.images?.[0]?.url && (
                  <img
                    src={s.images[0].url}
                    alt={s.name}
                    className="w-full h-40 object-cover rounded mb-4 opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                )}
                <p className="section-label">{s.category || 'Paquete'}</p>
                <h3 className="font-display text-lg font-bold text-ink mb-2">{s.name}</h3>
                <p className="text-ink-dim text-sm mb-4 leading-relaxed">{s.description}</p>
                <p className="font-display text-2xl font-black text-cyan">
                  ${s.price.toLocaleString('es-MX')}
                  <span className="text-sm text-ink-dim font-body font-normal"> MXN</span>
                </p>
                {s.duration && (
                  <p className="text-xs text-ink-mute mt-1 font-mono">
                    ⏱ {Math.floor(s.duration / 60)}h de servicio
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Skeleton placeholders */}
            {[0, 1].map((i) => (
              <div key={i} className="card-hud animate-pulse">
                <div className="h-40 bg-bg-3 rounded mb-4" />
                <div className="h-3 bg-bg-3 rounded w-24 mb-3" />
                <div className="h-5 bg-bg-3 rounded w-3/4 mb-2" />
                <div className="h-3 bg-bg-3 rounded w-full mb-1" />
                <div className="h-3 bg-bg-3 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        <HudDivider label="Calculadora de precio" />

        {/* Calculadora */}
        <div className="bg-bg-1 border border-cyan/10 rounded-xl p-8 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Selector de servicio */}
            {services.length > 0 && (
              <div>
                <label className="label-hud">Paquete</label>
                <select
                  value={calc.selectedService ?? services[0]?._id ?? ''}
                  onChange={(e) => calc.setSelectedService(e.target.value)}
                  className="input-hud"
                >
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Horas */}
            <div>
              <label className="label-hud">Horas de servicio: {calc.hours}h</label>
              <div className="flex items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => calc.setHours(Math.max(2, calc.hours - 1))}
                  className="w-10 h-10 bg-bg-2 border border-cyan/20 rounded text-cyan text-xl hover:border-cyan/50 transition-colors"
                >−</button>
                <div className="flex-1 h-2 bg-bg-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan to-cyan-dark rounded-full transition-all"
                    style={{ width: `${((calc.hours - 2) / 10) * 100}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => calc.setHours(Math.min(12, calc.hours + 1))}
                  className="w-10 h-10 bg-bg-2 border border-cyan/20 rounded text-cyan text-xl hover:border-cyan/50 transition-colors"
                >+</button>
              </div>
            </div>

            {/* Invitados */}
            <div>
              <label className="label-hud">Número de invitados: {calc.guests}</label>
              <input
                type="range"
                min={10} max={300} step={10}
                value={calc.guests}
                onChange={(e) => calc.setGuests(Number(e.target.value))}
                className="w-full mt-2 accent-cyan"
              />
              <div className="flex justify-between text-xs text-ink-mute mt-1 font-mono">
                <span>10</span><span>100</span><span>200</span><span>300+</span>
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div className="flex flex-col items-center justify-center bg-bg-2 rounded-xl border border-cyan/20 p-8 text-center">
            <p className="section-label mb-2">Precio estimado</p>
            <p className="font-display text-5xl font-black text-cyan text-glow-cyan mb-3">
              ${calc.total.toLocaleString('es-MX')}
            </p>
            <p className="text-ink-dim text-sm mb-6">MXN · {calc.hours} horas · {calc.guests} invitados</p>
            <Link to="/reservar" className="btn-primary w-full justify-center">
              Reservar este precio
            </Link>
            <p className="text-xs text-ink-mute mt-3">*Precio sujeto a disponibilidad</p>
          </div>
        </div>
      </div>
    </section>
  );
}
