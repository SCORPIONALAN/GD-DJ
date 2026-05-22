/**
 * FaqsAdmin — CRUD de preguntas frecuentes.
 */
import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';

const EMPTY = { question: '', answer: '', category: 'general', order: 0, isActive: true };

export default function FaqsAdmin() {
  const [faqs, setFaqs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(null);   // null = cerrado, EMPTY = nuevo, faq = editar
  const [saving, setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI.getFaqs().then((r) => setFaqs(r.data ?? [])).catch(() => null).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      if (form._id) await adminAPI.updateFaq(form._id, form);
      else          await adminAPI.createFaq(form);
      setForm(null);
      load();
    } catch { null; }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar esta FAQ?')) return;
    await adminAPI.deleteFaq(id).catch(() => null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label">Panel admin</p>
          <h1 className="section-title">FAQs</h1>
        </div>
        <button type="button" onClick={() => setForm(EMPTY)} className="btn-primary text-xs">
          + Nueva FAQ
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-bg-2 rounded animate-pulse" />)}</div>
      ) : faqs.length === 0 ? (
        <p className="text-ink-dim text-center py-20">No hay FAQs.</p>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq._id} className="card-hud flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink">{faq.question}</p>
                <p className="text-ink-dim text-sm mt-1 line-clamp-2">{faq.answer}</p>
                <div className="flex gap-3 mt-2">
                  <span className="font-mono text-xs text-ink-mute">{faq.category}</span>
                  {!faq.isActive && <span className="badge badge-cancelled text-xs">Inactiva</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button type="button" onClick={() => setForm(faq)} className="text-xs text-cyan hover:underline font-mono">Editar</button>
                <button type="button" onClick={() => remove(faq._id)} className="text-xs text-magenta hover:underline font-mono">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-bg-1 border border-cyan/20 rounded-xl p-6 w-full max-w-lg my-4">
            <h2 className="font-display text-lg font-bold text-ink mb-4">{form._id ? 'Editar FAQ' : 'Nueva FAQ'}</h2>

            <label className="label-hud">Pregunta *</label>
            <input type="text" name="question" value={form.question} onChange={handleChange}
              className="input-hud mb-4" maxLength={500} />

            <label className="label-hud">Respuesta *</label>
            <textarea name="answer" value={form.answer} onChange={handleChange}
              rows={4} className="textarea-hud mb-4" />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-hud">Categoría</label>
                <input type="text" name="category" value={form.category} onChange={handleChange} className="input-hud" />
              </div>
              <div>
                <label className="label-hud">Orden</label>
                <input type="number" name="order" value={form.order} onChange={handleChange} className="input-hud" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-ink-dim cursor-pointer mb-6">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-cyan" />
              Activa (visible en el sitio)
            </label>

            <div className="flex gap-3">
              <button type="button" onClick={save} disabled={saving} className="btn-primary flex-1 justify-center text-xs">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button type="button" onClick={() => setForm(null)} className="btn-outline flex-1 justify-center text-xs">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
