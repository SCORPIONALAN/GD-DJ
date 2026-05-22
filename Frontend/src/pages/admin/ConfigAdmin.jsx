/**
 * ConfigAdmin — gestión de configuración general del sitio.
 * Claves configurables: SITE_NAME, WHATSAPP_NUMBER, INSTAGRAM_URL, etc.
 */
import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';

export default function ConfigAdmin() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(null);
  const [saving, setSaving]   = useState(false);

  const EMPTY = { key: '', value: '', group: 'general', isPublic: false };

  const load = () => {
    setLoading(true);
    adminAPI.getConfig().then((r) => setConfigs(r.data ?? [])).catch(() => null).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await adminAPI.upsertConfig(form);
      setForm(null);
      load();
    } catch { null; }
    finally { setSaving(false); }
  };

  const remove = async (key) => {
    if (!confirm(`¿Eliminar la clave "${key}"?`)) return;
    await adminAPI.deleteConfig(key).catch(() => null);
    load();
  };

  const GROUPS = [...new Set(configs.map((c) => c.group))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label">Panel admin</p>
          <h1 className="section-title">Configuración</h1>
        </div>
        <button type="button" onClick={() => setForm(EMPTY)} className="btn-primary text-xs">
          + Nueva clave
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-bg-2 rounded animate-pulse" />)}</div>
      ) : configs.length === 0 ? (
        <p className="text-ink-dim text-center py-20">No hay configuraciones. Crea la primera.</p>
      ) : (
        <div className="space-y-8">
          {GROUPS.map((group) => (
            <div key={group}>
              <p className="section-label mb-3">{group}</p>
              <div className="space-y-2">
                {configs.filter((c) => c.group === group).map((c) => (
                  <div key={c._id} className="flex items-center gap-4 bg-bg-1 border border-cyan/10 rounded-lg px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-cyan">{c.key}</span>
                        {c.isPublic && <span className="badge badge-confirmed text-xs">Público</span>}
                      </div>
                      <p className="text-ink-dim text-sm truncate mt-0.5">
                        {typeof c.value === 'object' ? JSON.stringify(c.value) : String(c.value)}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button type="button" onClick={() => setForm({ ...c, value: typeof c.value === 'object' ? JSON.stringify(c.value) : String(c.value) })}
                        className="text-xs text-cyan hover:underline font-mono">Editar</button>
                      <button type="button" onClick={() => remove(c.key)}
                        className="text-xs text-magenta hover:underline font-mono">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-bg-1 border border-cyan/20 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">{form._id ? 'Editar clave' : 'Nueva clave de config'}</h2>

            <div>
              <label className="label-hud">Clave (KEY) *</label>
              <input type="text" value={form.key}
                onChange={(e) => setForm((p) => ({ ...p, key: e.target.value.toUpperCase() }))}
                className="input-hud font-mono" placeholder="SITE_NAME"
                disabled={!!form._id} />
            </div>
            <div>
              <label className="label-hud">Valor *</label>
              <input type="text" value={form.value}
                onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                className="input-hud" />
            </div>
            <div>
              <label className="label-hud">Grupo</label>
              <select value={form.group} onChange={(e) => setForm((p) => ({ ...p, group: e.target.value }))}
                className="input-hud">
                <option value="general">General</option>
                <option value="social">Social</option>
                <option value="pagos">Pagos</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-dim cursor-pointer">
              <input type="checkbox" checked={form.isPublic}
                onChange={(e) => setForm((p) => ({ ...p, isPublic: e.target.checked }))}
                className="accent-cyan" />
              Visible públicamente (sin autenticación)
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={save} disabled={saving} className="btn-primary flex-1 justify-center text-xs">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button type="button" onClick={() => setForm(null)} className="btn-outline flex-1 justify-center text-xs">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
