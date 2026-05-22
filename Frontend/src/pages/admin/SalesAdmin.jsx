/**
 * SalesAdmin — reporte de ventas con estadísticas y listado.
 */
import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';

const STATUS_LABELS = { pending: 'Pendiente', paid: 'Pagada', cancelled: 'Cancelada', refunded: 'Reembolsada' };

export default function SalesAdmin() {
  const [stats, setStats]     = useState(null);
  const [sales, setSales]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      adminAPI.getSalesStats(),
      adminAPI.getSales({ page, limit: 20 }),
    ])
      .then(([statsRes, salesRes]) => {
        setStats(statsRes.data);
        setSales(salesRes.data.sales ?? []);
        setTotal(salesRes.data.total ?? 0);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const updateStatus = async (id, status) => {
    await adminAPI.updateSale(id, { status }).catch(() => null);
    load();
  };

  return (
    <div>
      <p className="section-label">Panel admin</p>
      <h1 className="section-title mb-6">Ventas</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card-hud text-center">
            <p className="section-label mb-2">Total recaudado</p>
            <p className="font-display text-3xl font-black text-cyan">
              ${(stats.total ?? 0).toLocaleString('es-MX')}
            </p>
          </div>
          <div className="card-hud text-center">
            <p className="section-label mb-2">Número de ventas</p>
            <p className="font-display text-3xl font-black text-magenta">{stats.count ?? 0}</p>
          </div>
          <div className="card-hud text-center">
            <p className="section-label mb-2">Promedio por venta</p>
            <p className="font-display text-3xl font-black text-amber">
              ${(stats.average ?? 0).toLocaleString('es-MX')}
            </p>
          </div>
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-bg-2 rounded animate-pulse" />)}</div>
      ) : sales.length === 0 ? (
        <p className="text-ink-dim text-center py-20">No hay ventas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan/10 text-left">
                {['Cliente', 'Total', 'Método', 'Estado', 'Fecha', 'Acciones'].map((h) => (
                  <th key={h} className="pb-3 pr-4 font-mono text-xs uppercase tracking-wider text-ink-mute">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan/5">
              {sales.map((s) => (
                <tr key={s._id} className="hover:bg-bg-1 transition-colors">
                  <td className="py-3 pr-4">
                    <p className="text-ink">{s.client.name}</p>
                    <p className="text-xs text-ink-mute font-mono">{s.client.email}</p>
                  </td>
                  <td className="py-3 pr-4 font-display font-bold text-cyan">
                    ${s.total.toLocaleString('es-MX')}
                  </td>
                  <td className="py-3 pr-4 text-xs text-ink-dim font-mono">{s.paymentMethod}</td>
                  <td className="py-3 pr-4">
                    <span className={`badge ${
                      s.status === 'paid' ? 'badge-confirmed' :
                      s.status === 'cancelled' ? 'badge-cancelled' : 'badge-pending'
                    }`}>
                      {STATUS_LABELS[s.status] ?? s.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-xs text-ink-dim font-mono">
                    {new Date(s.createdAt).toLocaleDateString('es-MX')}
                  </td>
                  <td className="py-3 pr-4">
                    <select value={s.status}
                      onChange={(e) => updateStatus(s._id, e.target.value)}
                      className="bg-bg-2 border border-cyan/20 text-ink text-xs rounded px-2 py-1 font-mono">
                      {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 20 && (
        <div className="flex items-center gap-3 mt-6">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40">←</button>
          <span className="font-mono text-xs text-ink-dim">{page} / {Math.ceil(total / 20)}</span>
          <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / 20)}
            className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40">→</button>
        </div>
      )}
    </div>
  );
}
