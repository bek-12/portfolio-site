import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BrandProvider, useBrand } from './context/BrandContext';
import { ToastProvider } from './components/ui/Toast';
import LoadingScreen from './components/ui/LoadingScreen';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Projects from './pages/admin/Projects';
import Requests from './pages/admin/Requests';
import Profile from './pages/admin/Profile';

// Syncs the brand accent color to a CSS custom property on :root
function AccentColorSync() {
  const { brand } = useBrand();
  useEffect(() => {
    const color = brand.accentColor || '#C9A84C';
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-hover', color + 'cc');
  }, [brand.accentColor]);
  return null;
}

// Shows the branded splash screen for 1.5 s on first load
function AppShell() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (booting) return <LoadingScreen message="Loading..." />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Admin auth */}
        <Route path="/admin" element={<Login />} />

        {/* Protected admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/projects"  element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/admin/requests"  element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/admin/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <BrandProvider>
      <AuthProvider>
        <ToastProvider>
          <AccentColorSync />
          <AppShell />
        </ToastProvider>
      </AuthProvider>
    </BrandProvider>
  );
}
