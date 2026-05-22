/**
 * ReviewsAdmin — moderación de reseñas (aprobar / rechazar / eliminar).
 */
import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter]   = useState('pending');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminAPI.getReviews(filter ? { status: filter } : {})
      .then((r) => setReviews(r.data ?? []))
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const setStatus = async (id, status) => {
    await adminAPI.updateReview(id, { status }).catch(() => null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar esta reseña?')) return;
    await adminAPI.deleteReview(id).catch(() => null);
    load();
  };

  return (
    <div>
      <p className="section-label">Panel admin</p>
      <h1 className="section-title mb-6">Reseñas</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {[['pending', 'Pendientes'], ['approved', 'Aprobadas'], ['rejected', 'Rechazadas'], ['', 'Todas']].map(([v, l]) => (
          <button key={v} type="button" onClick={() => setFilter(v)}
            className={`px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
              filter === v ? 'border-cyan text-cyan bg-cyan/10' : 'border-cyan/20 text-ink-dim hover:border-cyan/40'
            }`}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-bg-2 rounded animate-pulse" />)}</div>
      ) : reviews.length === 0 ? (
        <p className="text-ink-dim text-center py-20">No hay reseñas en esta categoría.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="card-hud">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-display text-sm font-bold text-ink">{r.author.name}</p>
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => <span key={s} className={s <= r.rating ? 'text-amber' : 'text-ink-mute'}>★</span>)}
                    </div>
                    <span className={`badge ${
                      r.status === 'approved' ? 'badge-confirmed' :
                      r.status === 'rejected' ? 'badge-cancelled' : 'badge-pending'
                    }`}>
                      {r.status === 'approved' ? 'Aprobada' : r.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                    </span>
                  </div>
                  <p className="text-ink-dim text-sm leading-relaxed">{r.comment}</p>
                  {r.service?.name && <p className="font-mono text-xs text-ink-mute mt-2">{r.service.name}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {r.status !== 'approved' && (
                    <button type="button" onClick={() => setStatus(r._id, 'approved')}
                      className="px-3 py-1 text-xs font-mono border border-neon-green/30 text-neon-green rounded hover:bg-neon-green/10 transition-colors">
                      Aprobar
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button type="button" onClick={() => setStatus(r._id, 'rejected')}
                      className="px-3 py-1 text-xs font-mono border border-amber/30 text-amber rounded hover:bg-amber/10 transition-colors">
                      Rechazar
                    </button>
                  )}
                  <button type="button" onClick={() => remove(r._id)}
                    className="px-3 py-1 text-xs font-mono border border-magenta/30 text-magenta rounded hover:bg-magenta/10 transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
