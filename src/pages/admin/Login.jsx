import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.username, form.password);
    if (result.ok) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Invalid username or password.');
      setLoading(false);
    }
  };

  // Show full-screen loader while the API call is in flight
  if (loading) return <LoadingScreen message="Signing in..." />;

  const inputStyle = {
    background: '#0a0a0a',
    border: '1px solid rgba(201,168,76,0.2)',
    color: '#fff',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,168,76,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(201,168,76,0.05)' }}
      />

      <div className="relative w-full max-w-md">
        <div
          className="rounded-2xl p-8 shadow-2xl shadow-black/60"
          style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.2)' }}
        >
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg mb-4"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C068)', boxShadow: '0 4px 20px rgba(201,168,76,0.3)' }}
            >
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-xl font-bold text-white">BM Software</h1>
            <p className="text-sm text-[#A0A0A0] mt-1">Admin Portal</p>
          </div>

          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-6"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
          >
            <Lock className="w-4 h-4 shrink-0" style={{ color: '#C9A84C' }} />
            <p className="text-sm" style={{ color: '#C9A84C' }}>
              Restricted access. Authorized personnel only.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="bmadmin"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl placeholder-[#555] text-sm focus:outline-none transition-colors"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#C9A84C')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-xl placeholder-[#555] text-sm focus:outline-none transition-colors"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#C9A84C')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#A0A0A0] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-[#555] hover:text-[#A0A0A0] transition-colors">
              ← Back to public site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
