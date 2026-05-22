/**
 * LeadsAdmin — gestión de contactos recibidos desde el formulario público.
 */
import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';

const STATUSES = { new: 'Nuevo', contacted: 'Contactado', converted: 'Convertido', lost: 'Perdido' };

export default function LeadsAdmin() {
  const [leads, setLeads]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [filter, setFilter]   = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes]     = useState('');

  const load = () => {
    setLoading(true);
    adminAPI.getLeads({ page, limit: 20, ...(filter && { status: filter }) })
      .then((r) => { setLeads(r.data.leads ?? r.data ?? []); setTotal(r.data.total ?? 0); })
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, filter]);

  const updateLead = async (id, data) => {
    await adminAPI.updateLead(id, data).catch(() => null);
    setSelected(null);
    load();
  };

  const deleteLead = async (id) => {
    if (!confirm('¿Eliminar este lead?')) return;
    await adminAPI.deleteLead(id).catch(() => null);
    load();
  };

  return (
    <div>
      <p className="section-label">Panel admin</p>
      <h1 className="section-title mb-6">Leads de contacto</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['', ...Object.keys(STATUSES)].map((s) => (
          <button key={s} type="button"
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
              filter === s ? 'border-cyan text-cyan bg-cyan/10' : 'border-cyan/20 text-ink-dim hover:border-cyan/40'
            }`}
          >
            {s ? STATUSES[s] : 'Todos'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-bg-2 rounded animate-pulse" />)}</div>
      ) : leads.length === 0 ? (
        <p className="text-ink-dim text-center py-20">No hay leads.</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead._id} className="bg-bg-1 border border-cyan/10 rounded-lg p-4 flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink">{lead.name}</p>
                <p className="font-mono text-xs text-ink-mute">{lead.email} · {lead.phone}</p>
                {lead.message && <p className="text-sm text-ink-dim mt-2 line-clamp-2">{lead.message}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`badge ${
                  lead.status === 'new' ? 'badge-pending' :
                  lead.status === 'converted' ? 'badge-completed' :
                  'badge-confirmed'
                }`}>
                  {STATUSES[lead.status] ?? lead.status}
                </span>
                <button type="button" onClick={() => { setSelected(lead); setNotes(lead.notes ?? ''); }}
                  className="text-xs text-cyan hover:underline font-mono">Editar</button>
                <button type="button" onClick={() => deleteLead(lead._id)}
                  className="text-xs text-magenta hover:underline font-mono">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-bg-1 border border-cyan/20 rounded-xl p-6 w-full max-w-md">
            <h2 className="font-display text-lg font-bold text-ink mb-4">Actualizar lead</h2>
            <p className="text-ink-dim text-sm mb-4">{selected.name} — {selected.email}</p>

            <label className="label-hud">Estado</label>
            <select
              defaultValue={selected.status}
              onChange={(e) => setSelected({ ...selected, status: e.target.value })}
              className="input-hud mb-4"
            >
              {Object.entries(STATUSES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>

            <label className="label-hud">Notas internas</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              rows={3} className="textarea-hud mb-4" />

            <div className="flex gap-3">
              <button type="button" onClick={() => updateLead(selected._id, { status: selected.status, notes })}
                className="btn-primary flex-1 justify-center text-xs">Guardar</button>
              <button type="button" onClick={() => setSelected(null)}
                className="btn-outline flex-1 justify-center text-xs">Cancelar</button>
            </div>
          </div>
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
