import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BrandProvider, useBrand } from './context/BrandContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Projects from './pages/admin/Projects';
import Requests from './pages/admin/Requests';
import Profile from './pages/admin/Profile';

// Injects the accent color as a CSS custom property on :root so Button and
// other components can reference it without prop-drilling.
function AccentColorSync() {
  const { brand } = useBrand();
  useEffect(() => {
    const color = brand.accentColor || '#C9A84C';
    document.documentElement.style.setProperty('--accent', color);
    // Derive a slightly lighter hover shade (just bump lightness via opacity overlay)
    document.documentElement.style.setProperty('--accent-hover', color + 'cc');
  }, [brand.accentColor]);
  return null;
}

export default function App() {
  return (
    <BrandProvider>
      <AuthProvider>
        <ToastProvider>
          <AccentColorSync />
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />

              {/* Admin auth */}
              <Route path="/admin" element={<Login />} />

              {/* Protected admin routes */}
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/projects"
                element={<ProtectedRoute><Projects /></ProtectedRoute>}
              />
              <Route
                path="/admin/requests"
                element={<ProtectedRoute><Requests /></ProtectedRoute>}
              />
              <Route
                path="/admin/profile"
                element={<ProtectedRoute><Profile /></ProtectedRoute>}
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </BrandProvider>
  );
}
