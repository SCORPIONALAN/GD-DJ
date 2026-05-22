/**
 * BookingsAdmin — lista de reservas con filtro por estado y actualización de status.
 */
import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';

const STATUSES = ['', 'pending', 'confirmed', 'cancelled', 'completed'];
const STATUS_LABELS = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada' };

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [filter, setFilter]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setLoading(true);
    adminAPI.getBookings({ page, limit: 20, ...(filter && { status: filter }) })
      .then((r) => { setBookings(r.data.bookings ?? []); setTotal(r.data.total ?? 0); })
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, filter]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await adminAPI.updateBooking(id, { status }).catch(() => null);
    setUpdating(null);
    load();
  };

  return (
    <div>
      <p className="section-label">Panel admin</p>
      <h1 className="section-title mb-6">Reservas</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button key={s} type="button"
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
              filter === s ? 'border-cyan text-cyan bg-cyan/10' : 'border-cyan/20 text-ink-dim hover:border-cyan/40'
            }`}
          >
            {s ? STATUS_LABELS[s] : 'Todas'}
          </button>
        ))}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-bg-2 rounded animate-pulse" />)}
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-ink-dim text-center py-20">No hay reservas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan/10 text-left">
                {['Cliente', 'Fecha', 'Hora', 'Precio', 'Estado', 'Pago', 'Acciones'].map((h) => (
                  <th key={h} className="pb-3 pr-4 font-mono text-xs uppercase tracking-wider text-ink-mute">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan/5">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-bg-1 transition-colors">
                  <td className="py-3 pr-4">
                    <p className="text-ink font-medium">{b.client.name}</p>
                    <p className="text-ink-mute font-mono text-xs">{b.client.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-ink-dim font-mono text-xs">
                    {new Date(b.date).toLocaleDateString('es-MX')}
                  </td>
                  <td className="py-3 pr-4 text-ink-dim font-mono text-xs">{b.time}</td>
                  <td className="py-3 pr-4 text-cyan font-display font-bold">
                    ${b.price.toLocaleString('es-MX')}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`badge ${
                      b.status === 'confirmed' ? 'badge-confirmed' :
                      b.status === 'cancelled' ? 'badge-cancelled' :
                      b.status === 'completed' ? 'badge-completed' : 'badge-pending'
                    }`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-ink-dim text-xs font-mono">{b.paymentStatus}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b._id, e.target.value)}
                      disabled={updating === b._id}
                      className="bg-bg-2 border border-cyan/20 text-ink text-xs rounded px-2 py-1 font-mono"
                    >
                      {STATUSES.filter(Boolean).map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {total > 20 && (
        <div className="flex items-center gap-3 mt-6">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40">←</button>
          <span className="font-mono text-xs text-ink-dim">Página {page} / {Math.ceil(total / 20)}</span>
          <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / 20)}
            className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40">→</button>
        </div>
      )}
    </div>
  );
}
