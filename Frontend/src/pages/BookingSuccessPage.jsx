import { Link } from 'react-router-dom';
import Nav    from '../components/Nav';
import Footer from '../components/Footer';

const CONFIG = {
  exito: {
    icon: '🎉',
    title: '¡Reserva confirmada!',
    body: 'Tu anticipo fue procesado exitosamente. Te enviaremos un correo con los detalles de tu evento.',
    color: 'text-neon-green border-neon-green/20 bg-neon-green/5',
  },
  fallo: {
    icon: '❌',
    title: 'Pago no completado',
    body: 'Hubo un problema con tu pago. Tu reserva sigue guardada, pero necesitas completar el anticipo para confirmarla.',
    color: 'text-magenta border-magenta/20 bg-magenta/5',
  },
  pendiente: {
    icon: '⏳',
    title: 'Pago pendiente',
    body: 'Tu pago está siendo verificado. Te avisaremos por correo cuando se confirme.',
    color: 'text-amber border-amber/20 bg-amber/5',
  },
};

export default function BookingSuccessPage({ status }) {
  const cfg = CONFIG[status] ?? CONFIG.pendiente;

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 px-4 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className={`card-hud p-10 border ${cfg.color}`}>
            <p className="text-6xl mb-6">{cfg.icon}</p>
            <h1 className="font-display text-2xl font-black text-ink mb-4">{cfg.title}</h1>
            <p className="text-ink-dim leading-relaxed mb-8">{cfg.body}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/" className="btn-primary justify-center">Volver al inicio</Link>
              <Link to="/reservar" className="btn-outline justify-center">Nueva reserva</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
