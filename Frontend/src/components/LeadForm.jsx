/**
 * LeadForm — formulario de contacto rápido.
 * Envía los datos a POST /api/public/leads.
 */
import { useState } from 'react';
import { publicAPI } from '../lib/api';
import { useReveal } from '../hooks/useReveal';

const INITIAL = { name: '', phone: '', email: '', message: '' };

export default function LeadForm() {
  const [form, setForm]       = useState(INITIAL);
  const [status, setStatus]   = useState('idle'); // 'idle' | 'loading' | 'ok' | 'error'
  const [ref, visible] = useReveal();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await publicAPI.submitLead(form);
      setForm(INITIAL);
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contacto" className="py-24 px-4 max-w-3xl mx-auto" ref={ref}>
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="section-label">Contacto</p>
        <h2 className="section-title mb-2">Cuéntanos de tu evento</h2>
        <p className="text-ink-dim mb-10">Te responderemos en menos de 24 horas.</p>

        {status === 'ok' ? (
          <div className="card-hud text-center py-12">
            <p className="text-4xl mb-4">✅</p>
            <p className="font-display text-xl font-bold text-cyan mb-2">¡Mensaje recibido!</p>
            <p className="text-ink-dim">Te contactaremos pronto.</p>
            <button type="button" onClick={() => setStatus('idle')} className="btn-outline mt-6">
              Enviar otro
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-hud space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="lead-name" className="label-hud">Nombre *</label>
                <input
                  id="lead-name" type="text" name="name"
                  value={form.name} onChange={handleChange}
                  required maxLength={100}
                  placeholder="Tu nombre completo"
                  className="input-hud"
                />
              </div>
              <div>
                <label htmlFor="lead-phone" className="label-hud">Teléfono</label>
                <input
                  id="lead-phone" type="tel" name="phone"
                  value={form.phone} onChange={handleChange}
                  placeholder="+52 800 000 0000"
                  className="input-hud"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lead-email" className="label-hud">Email *</label>
              <input
                id="lead-email" type="email" name="email"
                value={form.email} onChange={handleChange}
                required
                placeholder="tu@email.com"
                className="input-hud"
              />
            </div>

            <div>
              <label htmlFor="lead-message" className="label-hud">Mensaje</label>
              <textarea
                id="lead-message" name="message"
                value={form.message} onChange={handleChange}
                rows={4} maxLength={2000}
                placeholder="Cuéntanos sobre tu evento: fecha, lugar, número de invitados..."
                className="textarea-hud"
              />
            </div>

            {status === 'error' && (
              <p className="text-magenta text-sm font-mono">
                ⚠ Error al enviar. Intenta de nuevo o contáctanos por WhatsApp.
              </p>
            )}

            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center">
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-bg-0/30 border-t-bg-0 rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : 'Enviar mensaje'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
