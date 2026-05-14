import { Zap, Mail, Phone, MapPin, Clock, Globe, MessageCircle, GitBranch } from 'lucide-react';

const FOOTER_LINKS = {
  Company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Systems', href: '#systems' },
    { label: 'Contact', href: '#contact' },
    { label: 'Admin Portal', href: '/admin' },
  ],
  Solutions: [
    { label: 'Pharmacy Inventory ERP', href: '#systems' },
    { label: 'Café Menu Management', href: '#systems' },
  ],
};

const SOCIAL = [
  { icon: Globe, href: '#', label: 'LinkedIn' },
  { icon: MessageCircle, href: '#', label: 'Twitter' },
  { icon: GitBranch, href: '#', label: 'GitHub' },
];

export default function Footer() {
  const handleNav = (href) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#C9A84C]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C068)' }}
              >
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-bold">
                <span style={{ color: '#C9A84C' }}>BM</span>{' '}
                <span className="text-white">Software</span>
              </span>
            </div>
            <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6">
              Building purpose-driven enterprise software for Ethiopian businesses. Powerful, intuitive, and built for the way local businesses actually work.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[#A0A0A0] transition-all duration-200"
                  style={{}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#C9A84C';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1a1a1a';
                    e.currentTarget.style.color = '#A0A0A0';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNav(link.href)}
                      className="text-sm text-[#A0A0A0] transition-colors"
                      onMouseEnter={(e) => (e.target.style.color = '#C9A84C')}
                      onMouseLeave={(e) => (e.target.style.color = '#A0A0A0')}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                <a
                  href="mailto:mebratubereket94@gmail.com"
                  className="text-sm text-[#A0A0A0] transition-colors"
                  onMouseEnter={(e) => (e.target.style.color = '#C9A84C')}
                  onMouseLeave={(e) => (e.target.style.color = '#A0A0A0')}
                >
                  mebratubereket94@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                <a
                  href="tel:+251944250799"
                  className="text-sm text-[#A0A0A0] transition-colors"
                  onMouseEnter={(e) => (e.target.style.color = '#C9A84C')}
                  onMouseLeave={(e) => (e.target.style.color = '#A0A0A0')}
                >
                  +251 944 250 799
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                <span className="text-sm text-[#A0A0A0]">Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                <span className="text-sm text-[#A0A0A0]">Mon–Fri, 9am–6pm EAT</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#C9A84C]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#A0A0A0]/60">
            © {new Date().getFullYear()} BM Software. All rights reserved.
          </p>
          <p className="text-sm text-[#A0A0A0]/40">
            Founded June 2025 · Addis Ababa, Ethiopia
          </p>
        </div>
      </div>
    </footer>
  );
}
