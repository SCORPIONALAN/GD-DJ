/**
 * Resenas — carrusel auto-scroll de testimonios de clientes.
 */
import { useEffect, useState } from 'react';
import { publicAPI } from '../lib/api';
import { useReveal } from '../hooks/useReveal';

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? 'text-amber' : 'text-ink-mute'}>★</span>
      ))}
    </div>
  );
}

export default function Resenas() {
  const [reviews, setReviews] = useState([]);
  const [ref, visible] = useReveal();

  useEffect(() => {
    publicAPI.getReviews().then((r) => setReviews(r.data)).catch(() => null);
  }, []);

  if (!reviews.length) return null;

  // Duplica las reseñas para el efecto de scroll infinito
  const doubled = [...reviews, ...reviews];

  return (
    <section className="py-24 overflow-hidden" ref={ref}>
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="px-4 max-w-7xl mx-auto mb-12">
          <p className="section-label">Testimonios</p>
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/* Gradientes para fade en los bordes */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-0 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-0 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 animate-scroll-x w-max">
            {doubled.map((r, i) => (
              <div key={`${r._id}-${i}`} className="card-hud w-72 flex-shrink-0">
                <StarRating rating={r.rating} />
                <p className="text-ink text-sm mt-3 leading-relaxed line-clamp-4">
                  "{r.comment}"
                </p>
                <div className="mt-4 pt-4 border-t border-cyan/10">
                  <p className="font-display text-sm font-bold text-cyan">{r.author.name}</p>
                  {r.service?.name && (
                    <p className="text-xs text-ink-mute mt-0.5 font-mono">{r.service.name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
