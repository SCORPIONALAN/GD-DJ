/**
 * ServicesAdmin — CRUD de servicios con subida de imágenes.
 */
import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';

const EMPTY = { name: '', description: '', price: '', duration: '', category: '', isActive: true };

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(null);
  const [images, setImages]     = useState([]);
  const [saving, setSaving]     = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI.getServices().then((r) => setServices(r.data ?? [])).catch(() => null).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null) fd.append(k, v); });
      images.forEach((f) => fd.append('images', f));

      if (form._id) await adminAPI.updateService(form._id, fd);
      else          await adminAPI.createService(fd);
      setForm(null);
      setImages([]);
      load();
    } catch { null; }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    await adminAPI.deleteService(id).catch(() => null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label">Panel admin</p>
          <h1 className="section-title">Servicios</h1>
        </div>
        <button type="button" onClick={() => { setForm(EMPTY); setImages([]); }} className="btn-primary text-xs">
          + Nuevo servicio
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 bg-bg-2 rounded animate-pulse" />)}
        </div>
      ) : services.length === 0 ? (
        <p className="text-ink-dim text-center py-20">No hay servicios.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s._id} className="card-hud">
              {s.images?.[0]?.url && (
                <img src={s.images[0].url} alt={s.name} className="w-full h-36 object-cover rounded mb-3 opacity-80" />
              )}
              <p className="font-display text-sm font-bold text-ink mb-1">{s.name}</p>
              <p className="font-display text-lg font-black text-cyan">${(s.price ?? 0).toLocaleString('es-MX')}</p>
              {!s.isActive && <span className="badge badge-cancelled text-xs mt-1">Inactivo</span>}
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => { setForm(s); setImages([]); }}
                  className="text-xs text-cyan hover:underline font-mono">Editar</button>
                <button type="button" onClick={() => remove(s._id)}
                  className="text-xs text-magenta hover:underline font-mono">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-bg-1 border border-cyan/20 rounded-xl p-6 w-full max-w-lg my-4 space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">{form._id ? 'Editar servicio' : 'Nuevo servicio'}</h2>

            <div>
              <label className="label-hud">Nombre *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="input-hud" />
            </div>
            <div>
              <label className="label-hud">Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="textarea-hud" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-hud">Precio (MXN) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} min={0} className="input-hud" />
              </div>
              <div>
                <label className="label-hud">Duración (min)</label>
                <input type="number" name="duration" value={form.duration} onChange={handleChange} min={0} className="input-hud" />
              </div>
            </div>
            <div>
              <label className="label-hud">Categoría</label>
              <input type="text" name="category" value={form.category} onChange={handleChange} className="input-hud" />
            </div>
            <div>
              <label className="label-hud">Imágenes (máx 5, 5MB c/u)</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))}
                className="block w-full text-sm text-ink-dim file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-cyan/10 file:text-cyan file:font-mono file:text-xs cursor-pointer" />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-dim cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-cyan" />
              Activo (visible en el sitio)
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
