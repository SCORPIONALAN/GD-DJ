/**
 * ProductsAdmin — CRUD de productos del catálogo con imágenes.
 */
import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';

const EMPTY = { name: '', description: '', price: '', category: '', stock: 0, isActive: true };

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(null);
  const [images, setImages]     = useState([]);
  const [saving, setSaving]     = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI.getProducts({ page, limit: 12 })
      .then((r) => { setProducts(r.data.products ?? []); setTotal(r.data.total ?? 0); })
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

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

      if (form._id) await adminAPI.updateProduct(form._id, fd);
      else          await adminAPI.createProduct(fd);
      setForm(null);
      setImages([]);
      load();
    } catch { null; }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await adminAPI.deleteProduct(id).catch(() => null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label">Panel admin</p>
          <h1 className="section-title">Productos</h1>
        </div>
        <button type="button" onClick={() => { setForm(EMPTY); setImages([]); }} className="btn-primary text-xs">
          + Nuevo producto
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-48 bg-bg-2 rounded animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <p className="text-ink-dim text-center py-20">No hay productos.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p._id} className="card-hud">
              {p.images?.[0]?.url ? (
                <img src={p.images[0].url} alt={p.name} className="w-full h-36 object-cover rounded mb-3 opacity-80" />
              ) : (
                <div className="w-full h-36 bg-bg-3 rounded mb-3 flex items-center justify-center text-2xl">🎛</div>
              )}
              <p className="font-display text-xs font-bold text-ink line-clamp-2 mb-1">{p.name}</p>
              <p className="text-cyan font-display font-bold">${(p.price ?? 0).toLocaleString('es-MX')}</p>
              <p className="text-xs text-ink-mute font-mono mt-1">Stock: {p.stock}</p>
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => { setForm(p); setImages([]); }}
                  className="text-xs text-cyan hover:underline font-mono">Editar</button>
                <button type="button" onClick={() => remove(p._id)}
                  className="text-xs text-magenta hover:underline font-mono">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > 12 && (
        <div className="flex items-center gap-3 mt-6">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40">←</button>
          <span className="font-mono text-xs text-ink-dim">{page} / {Math.ceil(total / 12)}</span>
          <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / 12)}
            className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40">→</button>
        </div>
      )}

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-bg-1 border border-cyan/20 rounded-xl p-6 w-full max-w-lg my-4 space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">{form._id ? 'Editar producto' : 'Nuevo producto'}</h2>

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
                <label className="label-hud">Stock</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} min={0} className="input-hud" />
              </div>
            </div>
            <div>
              <label className="label-hud">Categoría</label>
              <input type="text" name="category" value={form.category} onChange={handleChange} className="input-hud" />
            </div>
            <div>
              <label className="label-hud">Imágenes (máx 5)</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))}
                className="block w-full text-sm text-ink-dim file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-cyan/10 file:text-cyan file:font-mono file:text-xs cursor-pointer" />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-dim cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-cyan" />
              Activo (visible en el catálogo)
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
