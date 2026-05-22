/**
 * BookingPage — formulario completo de reserva.
 * Consulta disponibilidad al backend y envía la reserva.
 * El anticipo se cobra con Mercado Pago (CardPayment Brick).
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav    from '../components/Nav';
import Footer from '../components/Footer';
import { publicAPI } from '../lib/api';

const INITIAL = {
  name: '', email: '', phone: '',
  serviceId: '', date: '', time: '18:00',
  notes: '',
};

export default function BookingPage() {
  const navigate = useNavigate();
  const [services, setServices]       = useState([]);
  const [form, setForm]               = useState(INITIAL);
  const [availability, setAvailability] = useState([]);
  const [step, setStep]               = useState(1); // 1: datos, 2: pago
  const [status, setStatus]           = useState('idle');
  const [booking, setBooking]         = useState(null);

  useEffect(() => {
    publicAPI.getServices().then((r) => {
      setServices(r.data);
      if (r.data.length) setForm((f) => ({ ...f, serviceId: r.data[0]._id }));
    }).catch(() => null);
  }, []);

  // Carga disponibilidad cuando cambia el servicio o el mes
  useEffect(() => {
    if (!form.serviceId || !form.date) return;
    const d = new Date(form.date);
    publicAPI.getAvailability({ serviceId: form.serviceId, month: d.getMonth() + 1, year: d.getFullYear() })
      .then((r) => setAvailability(r.data))
      .catch(() => null);
  }, [form.serviceId, form.date]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const isDateTaken = (dateStr) =>
    availability.some((b) => b.date.startsWith(dateStr) && b.time === form.time);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const selectedService = services.find((s) => s._id === form.serviceId);
      const res = await publicAPI.createBooking({
        client:    { name: form.name, email: form.email, phone: form.phone },
        serviceId: form.serviceId,
        date:      form.date,
        time:      form.time,
        notes:     form.notes,
      });
      setBooking({ ...res.data, service: selectedService });
      setStep(2);
      setStatus('idle');
    } catch (err) {
      setStatus(err.response?.data?.message ?? 'Error al crear la reserva');
    }
  };

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 px-4 max-w-2xl mx-auto">
        <p className="section-label mt-8">Reservas</p>
        <h1 className="section-title mb-2">Reserva tu fecha</h1>
        <p className="text-ink-dim mb-10">
          Completa el formulario y asegura tu evento con un anticipo de $1,500 MXN.
        </p>

        {/* Indicador de pasos */}
        <div className="flex items-center gap-4 mb-10">
          {[{ n: 1, label: 'Datos del evento' }, { n: 2, label: 'Pago del anticipo' }].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-sm font-bold border-2 transition-colors ${
                step >= n ? 'bg-cyan border-cyan text-bg-0' : 'border-cyan/20 text-ink-mute'
              }`}>
                {n}
              </div>
              <span className={`text-sm font-body ${step >= n ? 'text-ink' : 'text-ink-mute'}`}>{label}</span>
              {n < 2 && <div className="w-8 h-px bg-cyan/20" />}
            </div>
          ))}
        </div>

        {/* Paso 1: Datos */}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="card-hud space-y-5" noValidate>
            {/* Datos del cliente */}
            <fieldset>
              <legend className="section-label mb-4">Datos de contacto</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="b-name" className="label-hud">Nombre completo *</label>
                  <input id="b-name" type="text" name="name" value={form.name} onChange={handleChange}
                    required className="input-hud" placeholder="Tu nombre" />
                </div>
                <div>
                  <label htmlFor="b-phone" className="label-hud">Teléfono</label>
                  <input id="b-phone" type="tel" name="phone" value={form.phone} onChange={handleChange}
                    className="input-hud" placeholder="+52 800 000 0000" />
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="b-email" className="label-hud">Email *</label>
                <input id="b-email" type="email" name="email" value={form.email} onChange={handleChange}
                  required className="input-hud" placeholder="tu@email.com" />
              </div>
            </fieldset>

            {/* Datos del evento */}
            <fieldset>
              <legend className="section-label mb-4">Detalles del evento</legend>

              {services.length > 0 && (
                <div className="mb-5">
                  <label htmlFor="b-service" className="label-hud">Paquete *</label>
                  <select id="b-service" name="serviceId" value={form.serviceId} onChange={handleChange}
                    className="input-hud">
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>{s.name} — ${s.price.toLocaleString('es-MX')}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="b-date" className="label-hud">Fecha del evento *</label>
                  <input id="b-date" type="date" name="date" value={form.date} onChange={handleChange}
                    required min={new Date().toISOString().split('T')[0]}
                    className={`input-hud ${form.date && isDateTaken(form.date) ? 'border-magenta/50 text-magenta' : ''}`} />
                  {form.date && isDateTaken(form.date) && (
                    <p className="text-magenta text-xs mt-1 font-mono">⚠ Esta fecha/hora ya está reservada</p>
                  )}
                </div>
                <div>
                  <label htmlFor="b-time" className="label-hud">Hora de inicio *</label>
                  <input id="b-time" type="time" name="time" value={form.time} onChange={handleChange}
                    required className="input-hud" />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="b-notes" className="label-hud">Notas adicionales</label>
                <textarea id="b-notes" name="notes" value={form.notes} onChange={handleChange}
                  rows={3} maxLength={1000} className="textarea-hud"
                  placeholder="Lugar del evento, indicaciones especiales..." />
              </div>
            </fieldset>

            {typeof status === 'string' && status !== 'idle' && status !== 'loading' && (
              <p className="text-magenta text-sm font-mono">⚠ {status}</p>
            )}

            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center">
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-bg-0/30 border-t-bg-0 rounded-full animate-spin" />
                  Procesando...
                </span>
              ) : 'Continuar al pago →'}
            </button>
          </form>
        )}

        {/* Paso 2: Pago */}
        {step === 2 && booking && (
          <div className="card-hud space-y-6">
            <div className="bg-neon-green/5 border border-neon-green/20 rounded-lg p-4">
              <p className="text-neon-green font-mono text-sm">✅ Reserva creada correctamente</p>
              <p className="text-ink-dim text-sm mt-1">
                Folio: <span className="text-ink font-mono">{booking._id}</span>
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="section-label mb-3">Resumen</p>
              <div className="flex justify-between text-ink-dim">
                <span>Paquete</span><span className="text-ink">{booking.service?.name}</span>
              </div>
              <div className="flex justify-between text-ink-dim">
                <span>Fecha</span><span className="text-ink">{new Date(booking.date).toLocaleDateString('es-MX')}</span>
              </div>
              <div className="flex justify-between text-ink-dim">
                <span>Anticipo a pagar</span><span className="text-cyan font-display font-bold text-base">$1,500 MXN</span>
              </div>
            </div>

            <p className="text-ink-dim text-sm">
              El pago del anticipo confirma tu fecha. Integración con Mercado Pago disponible en producción.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate('/reservar/exito')}
                className="btn-primary flex-1 justify-center"
              >
                Simular pago exitoso
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-outline flex-1 justify-center"
              >
                Pagar después
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
