import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { useBrand } from '../../context/BrandContext';

const NAV_LINKS = [
  { label: 'Systems', href: '#systems' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

// Logo mark — custom image if uploaded, otherwise pure text (no box/square)
function LogoMark({ companyName, accentColor, logoImage }) {
  const words = (companyName || 'BM Software').trim().split(/\s+/);

  return (
    <div className="flex items-center gap-2">
      {logoImage ? (
        <img
          src={logoImage}
          alt={`${companyName} logo`}
          className="shrink-0 object-contain"
          style={{ height: '65px', width: 'auto' }}
        />
      ) : null}
      <span className="text-lg font-bold tracking-tight">
        <span style={{ color: accentColor }}>{words[0]}</span>
        {words.length > 1 && (
          <span className="text-white"> {words.slice(1).join(' ')}</span>
        )}
      </span>
    </div>
  );
}

export default function Navbar() {
  const { brand } = useBrand();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const gold = brand.accentColor || '#C9A84C';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll to section and always close the mobile menu
  const handleNav = (href) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-xl shadow-black/40'
          : 'bg-transparent'
      }`}
      style={scrolled ? { borderBottom: `1px solid ${gold}25` } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <a href="#" onClick={() => setOpen(false)} className="group">
            <LogoMark
              companyName={brand.companyName || 'BM Software'}
              accentColor={gold}
              logoImage={brand.logoImage}
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/admin"
              className="text-sm transition-colors"
              style={{ color: gold }}
              onMouseEnter={(e) => (e.target.style.opacity = '0.75')}
              onMouseLeave={(e) => (e.target.style.opacity = '1')}
            >
              Admin
            </a>
            <Button size="sm" onClick={() => handleNav('#contact')}>
              Request Demo
            </Button>
          </div>

          {/* Mobile: Admin link + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <a
              href="/admin"
              className="text-sm font-medium transition-colors"
              style={{ color: gold }}
            >
              Admin
            </a>
            <button
              className="p-2 text-[#A0A0A0] hover:text-white transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden backdrop-blur-md"
          style={{ background: 'rgba(17,17,17,0.98)', borderBottom: `1px solid ${gold}25` }}
        >
          <div className="px-4 py-4 space-y-1">
            {/* Section nav links */}
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#A0A0A0] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}

            {/* Request Demo CTA */}
            <div className="pt-3 mt-1" style={{ borderTop: `1px solid ${gold}20` }}>
              <Button className="w-full" onClick={() => handleNav('#contact')}>
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
