import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, MessageSquare, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { projectsAPI, demoRequestsAPI } from '../../utils/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    projectsAPI.getAll().then(setProjects).catch(() => {});
    demoRequestsAPI.getAll().then(setRequests).catch(() => {});
  }, []);

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
      iconColor: '#C9A84C',
      bgStyle: { background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' },
      action: () => navigate('/admin/projects'),
    },
    {
      label: 'Demo Requests',
      value: requests.length,
      icon: MessageSquare,
      iconColor: '#a78bfa',
      bgStyle: { background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' },
      action: () => navigate('/admin/requests'),
    },
    {
      label: 'Active Systems',
      value: projects.filter((p) => p.status === 'active').length,
      icon: CheckCircle2,
      iconColor: '#34d399',
      bgStyle: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' },
      action: () => navigate('/admin/projects'),
    },
    {
      label: 'New Requests',
      value: requests.filter((r) => r.status === 'new').length,
      icon: TrendingUp,
      iconColor: '#fbbf24',
      bgStyle: { background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' },
      action: () => navigate('/admin/requests'),
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-[#A0A0A0] mt-1">Welcome back. Here's an overview of your portfolio.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map(({ label, value, icon: Icon, iconColor, bgStyle, action }) => (
            <button
              key={label}
              onClick={action}
              className="text-left p-6 rounded-2xl transition-all hover:-translate-y-0.5 group"
              style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.12)' }}
              onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid rgba(201,168,76,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.border = '1px solid rgba(201,168,76,0.12)')}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={bgStyle}>
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-sm text-[#A0A0A0] flex items-center gap-1">
                {label}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#C9A84C' }} />
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent projects */}
          <div className="rounded-2xl p-6" style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">Recent Projects</h2>
              <button onClick={() => navigate('/admin/projects')} className="text-xs transition-colors" style={{ color: '#C9A84C' }}
                onMouseEnter={(e) => (e.target.style.color = '#E2C068')} onMouseLeave={(e) => (e.target.style.color = '#C9A84C')}>
                View all →
              </button>
            </div>
            {projects.length === 0 ? (
              <p className="text-sm text-[#555] py-4 text-center">No projects yet.</p>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] overflow-hidden shrink-0">
                      {p.coverImage && <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{p.title}</div>
                      <div className="text-xs text-[#555] capitalize">{p.status}</div>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
                      {(p.techStack || []).slice(0, 2).map((t) => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#1a1a1a', color: '#A0A0A0' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent requests */}
          <div className="rounded-2xl p-6" style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">Recent Demo Requests</h2>
              <button onClick={() => navigate('/admin/requests')} className="text-xs transition-colors" style={{ color: '#C9A84C' }}
                onMouseEnter={(e) => (e.target.style.color = '#E2C068')} onMouseLeave={(e) => (e.target.style.color = '#C9A84C')}>
                View all →
              </button>
            </div>
            {requests.length === 0 ? (
              <p className="text-sm text-[#555] py-4 text-center">No requests yet.</p>
            ) : (
              <div className="space-y-3">
                {requests.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}>
                      {r.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{r.fullName}</div>
                      <div className="text-xs text-[#555] truncate">{r.companyName} · {r.interestedIn || 'General'}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={r.status === 'new'
                        ? { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }
                        : { background: 'rgba(255,255,255,0.05)', color: '#A0A0A0' }}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
