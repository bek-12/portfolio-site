import { createContext, useContext, useState } from 'react';

const ADMIN_USERNAME = 'bmadmin';
const BRAND_KEY = 'bm_brand';

// Always read the live password from localStorage so profile changes take effect immediately
function getCurrentPassword() {
  try {
    const raw = localStorage.getItem(BRAND_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.password) return parsed.password;
    }
  } catch {
    // fall through
  }
  return 'BMSoftware2025!';
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('bm_auth') === 'true'
  );

  function login(username, password) {
    if (username === ADMIN_USERNAME && password === getCurrentPassword()) {
      sessionStorage.setItem('bm_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem('bm_auth');
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
