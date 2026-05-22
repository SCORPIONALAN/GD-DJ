/**
 * BlogAdmin — CRUD de publicaciones del blog con imagen destacada.
 */
import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';

const EMPTY = { title: '', content: '', excerpt: '', category: '', tags: '', status: 'draft' };

export default function BlogAdmin() {
  const [posts, setPosts]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [filter, setFilter]   = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(null);
  const [image, setImage]     = useState(null);
  const [saving, setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI.getBlogPosts({ page, limit: 10, ...(filter && { status: filter }) })
      .then((r) => { setPosts(r.data.posts ?? []); setTotal(r.data.total ?? 0); })
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, filter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      if (image) fd.append('featuredImage', image);

      if (form._id) await adminAPI.updateBlogPost(form._id, fd);
      else          await adminAPI.createBlogPost(fd);
      setForm(null);
      setImage(null);
      load();
    } catch { null; }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar este post?')) return;
    await adminAPI.deleteBlogPost(id).catch(() => null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label">Panel admin</p>
          <h1 className="section-title">Blog</h1>
        </div>
        <button type="button" onClick={() => { setForm(EMPTY); setImage(null); }} className="btn-primary text-xs">
          + Nuevo post
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {[['', 'Todos'], ['draft', 'Borradores'], ['published', 'Publicados']].map(([v, l]) => (
          <button key={v} type="button" onClick={() => { setFilter(v); setPage(1); }}
            className={`px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
              filter === v ? 'border-cyan text-cyan bg-cyan/10' : 'border-cyan/20 text-ink-dim hover:border-cyan/40'
            }`}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-bg-2 rounded animate-pulse" />)}</div>
      ) : posts.length === 0 ? (
        <p className="text-ink-dim text-center py-20">No hay posts.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post._id} className="flex items-center gap-4 bg-bg-1 border border-cyan/10 rounded-lg p-4">
              {post.featuredImage?.url && (
                <img src={post.featuredImage.url} alt="" className="w-16 h-12 object-cover rounded opacity-70 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate">{post.title}</p>
                <p className="text-xs text-ink-mute font-mono mt-0.5">
                  {post.category} · {post.status === 'published' ? '✅ Publicado' : '📝 Borrador'} · {new Date(post.createdAt).toLocaleDateString('es-MX')}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button type="button" onClick={() => { setForm({ ...post, tags: post.tags?.join(', ') ?? '' }); setImage(null); }}
                  className="text-xs text-cyan hover:underline font-mono">Editar</button>
                <button type="button" onClick={() => remove(post._id)}
                  className="text-xs text-magenta hover:underline font-mono">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > 10 && (
        <div className="flex items-center gap-3 mt-6">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40">←</button>
          <span className="font-mono text-xs text-ink-dim">{page} / {Math.ceil(total / 10)}</span>
          <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / 10)}
            className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40">→</button>
        </div>
      )}

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-bg-1 border border-cyan/20 rounded-xl p-6 w-full max-w-2xl my-4 space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">{form._id ? 'Editar post' : 'Nuevo post'}</h2>

            <div>
              <label className="label-hud">Título *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} className="input-hud" />
            </div>
            <div>
              <label className="label-hud">Extracto</label>
              <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} maxLength={500} className="textarea-hud" />
            </div>
            <div>
              <label className="label-hud">Contenido</label>
              <textarea name="content" value={form.content} onChange={handleChange} rows={8} className="textarea-hud" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-hud">Categoría</label>
                <input type="text" name="category" value={form.category} onChange={handleChange} className="input-hud" />
              </div>
              <div>
                <label className="label-hud">Estado</label>
                <select name="status" value={form.status} onChange={handleChange} className="input-hud">
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label-hud">Tags (separados por coma)</label>
              <input type="text" name="tags" value={form.tags} onChange={handleChange} className="input-hud" placeholder="dj, boda, musica" />
            </div>
            <div>
              <label className="label-hud">Imagen destacada</label>
              <input type="file" accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImage(e.target.files[0] ?? null)}
                className="block w-full text-sm text-ink-dim file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-cyan/10 file:text-cyan file:font-mono file:text-xs cursor-pointer" />
            </div>
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
