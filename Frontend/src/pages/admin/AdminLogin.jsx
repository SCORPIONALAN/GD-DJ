/**
 * AdminLogin — pantalla de acceso al panel de administración.
 * Si ya hay sesión activa, redirige al dashboard.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { admin, loading, login } = useAuth();
  const navigate  = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  // Redirige si ya hay sesión
  useEffect(() => {
    if (!loading && admin) navigate('/admin', { replace: true });
  }, [admin, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al iniciar sesión');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center px-4">
      {/* Fondo grid */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-30" aria-hidden="true" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/assets/gd-mono.png" alt="GD DJ" className="h-12 w-auto mx-auto mb-4 opacity-80" />
          <p className="section-label">Panel de administración</p>
          <h1 className="font-display text-2xl font-black text-ink">Iniciar sesión</h1>
        </div>

        <form onSubmit={handleSubmit} className="card-hud space-y-5" noValidate>
          <div>
            <label htmlFor="admin-email" className="label-hud">Email</label>
            <input
              id="admin-email" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required autoComplete="email"
              placeholder="admin@djgd.com"
              className="input-hud"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="label-hud">Contraseña</label>
            <input
              id="admin-password" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required autoComplete="current-password"
              placeholder="••••••••"
              className="input-hud"
            />
          </div>

          {error && (
            <p className="text-magenta text-sm font-mono bg-magenta/5 border border-magenta/20 rounded px-3 py-2">
              ⚠ {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full justify-center">
            {busy ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-bg-0/30 border-t-bg-0 rounded-full animate-spin" />
                Entrando...
              </span>
            ) : 'Entrar al panel'}
          </button>
        </form>

        <p className="text-center text-xs text-ink-mute mt-6 font-mono">
          Este acceso es exclusivo para administradores
        </p>
      </div>
    </div>
  );
}
