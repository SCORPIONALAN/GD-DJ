/**
 * AuthContext — estado global de sesión del administrador.
 *
 * La autenticación se basa en cookie httpOnly (gd_token).
 * Al montar la app, llama a /api/auth/me para saber si hay sesión activa.
 * No guarda el token en ningún lado — el browser lo maneja solo.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica sesión al cargar la app (la cookie viaja automáticamente)
  useEffect(() => {
    authAPI.me()
      .then((res) => setAdmin(res.data))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    setAdmin(res.data.admin);
    return res.data.admin;
  };

  const logout = async () => {
    await authAPI.logout().catch(() => null); // Limpia la cookie en el servidor
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
