import { createContext, useContext, useState } from 'react';
import { authAPI, setToken, clearToken, getToken } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(getToken())
  );

  // Returns { ok: true } or { ok: false, error: string }
  async function login(username, password) {
    try {
      const data = await authAPI.login(username, password);
      setToken(data.token);
      setIsAuthenticated(true);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function logout() {
    clearToken();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
