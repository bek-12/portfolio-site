import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, MessageSquare,
  UserCog, LogOut, Menu, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';

const NAV = [
  { label: 'Dashboard',     icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Projects',      icon: FolderKanban,    path: '/admin/projects'  },
  { label: 'Demo Requests', icon: MessageSquare,   path: '/admin/requests'  },
  { label: 'Profile',       icon: UserCog,         path: '/admin/profile'   },
];

// Sidebar logo mark — shows custom image if uploaded, otherwise text+initials box
function SidebarLogo({ companyName, accentColor, logoImage }) {
  const words = (companyName || 'BM Software').trim().split(/\s+/);
  const initials = words.slice(0, 2).map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="flex items-center gap-2.5">
      {logoImage ? (
        <img
          src={logoImage}
          alt={`${companyName} logo`}
          className="w-8 h-8 rounded-lg object-cover shrink-0"
          style={{ boxShadow: `0 4px 12px ${accentColor}35` }}
        />
      ) : (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-[11px]"
          style={{
            background: accentColor,
            color: '#000',
            letterSpacing: '-0.5px',
            boxShadow: `0 4px 12px ${accentColor}35`,
          }}
        >
          {initials}
        </div>
      )}
      <div>
        <div className="text-sm font-bold leading-tight">
          <span style={{ color: accentColor }}>{words[0]}</span>
          {words.length > 1 && (
            <span className="text-white"> {words.slice(1).join(' ')}</span>
          )}
        </div>
        <div className="text-xs text-[#555]">Admin Portal</div>
      </div>
    </div>
  );
}

// Circular avatar — shows logo image if uploaded, otherwise initials
function Avatar({ companyName, accentColor, logoImage, size = 7 }) {
  const initials = (companyName || 'BM Software')
    .trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  const px = size * 4;
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden"
      style={{
        background: logoImage ? 'transparent' : `${accentColor}18`,
        border: `1px solid ${accentColor}45`,
        color: accentColor,
        width: `${px}px`,
        height: `${px}px`,
        fontSize: size <= 7 ? '11px' : '13px',
      }}
    >
      {logoImage ? (
        <img src={logoImage} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const { brand } = useBrand();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const gold = brand.accentColor || '#C9A84C';

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const activeStyle = {
    background: `${gold}18`,
    color: gold,
    border: `1px solid ${gold}35`,
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: `1px solid ${gold}20` }}
      >
        <SidebarLogo companyName={brand.companyName} accentColor={gold} logoImage={brand.logoImage} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => { navigate(path); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={active ? activeStyle : { color: '#A0A0A0', border: '1px solid transparent' }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#A0A0A0';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: gold }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom strip */}
      <div className="px-3 py-4" style={{ borderTop: `1px solid ${gold}20` }}>
        {/* Profile quick-link */}
        <button
          onClick={() => { navigate('/admin/profile'); setSidebarOpen(false); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all"
          style={{ border: '1px solid transparent' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${gold}0a`;
            e.currentTarget.style.border = `1px solid ${gold}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.border = '1px solid transparent';
          }}
        >
          <Avatar companyName={brand.companyName} accentColor={gold} logoImage={brand.logoImage} size={7} />
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs font-medium text-white truncate">{brand.fullName}</div>
            <div className="text-xs text-[#555] truncate">{brand.email}</div>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#A0A0A0] hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <a
          href="/"
          className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#555] hover:text-[#A0A0A0] hover:bg-white/5 transition-all"
        >
          ← Public Site
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 fixed inset-y-0 left-0 z-30"
        style={{ background: '#111111', borderRight: `1px solid ${gold}15` }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#111111', borderRight: `1px solid ${gold}15` }}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 backdrop-blur-md px-4 sm:px-6 h-14 flex items-center gap-4"
          style={{ background: 'rgba(10,10,10,0.95)', borderBottom: `1px solid ${gold}12` }}
        >
          <button
            className="lg:hidden p-1.5 text-[#A0A0A0] hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          {/* Top-bar avatar */}
          <button
            onClick={() => navigate('/admin/profile')}
            className="flex items-center gap-2 transition-opacity hover:opacity-75"
          >
            <Avatar companyName={brand.companyName} accentColor={gold} logoImage={brand.logoImage} size={7} />
            <span className="text-xs text-[#555] hidden sm:block">{brand.fullName}</span>
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
