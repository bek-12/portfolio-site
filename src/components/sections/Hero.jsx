import { ArrowRight, ChevronDown, Shield, Cpu, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';
import { useBrand } from '../../context/BrandContext';

const STATS = [
  { value: '8+',           label: 'Happy Clients'    },
  { value: '2',            label: 'Systems Deployed' },
  { value: '99.9%',        label: 'Uptime SLA'       },
  { value: 'Since Jun 2025', label: 'Est. Addis Ababa' },
];

const FEATURES = [
  { icon: Shield,    label: 'Built for Ethiopia'  },
  { icon: Cpu,       label: 'Modern Tech Stack'   },
  { icon: TrendingUp, label: 'Scalable Systems'   },
];

export default function Hero() {
  const { brand } = useBrand();
  const gold = brand.accentColor || '#C9A84C';
  const tagline = brand.tagline || 'Enterprise Software Solutions';

  const scrollToSystems = () =>
    document.querySelector('#systems')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToContact = () =>
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${gold}99 1px, transparent 1px), linear-gradient(90deg, ${gold}99 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: `${gold}0f` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: `${gold}08` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow / tagline badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{
              background: `${gold}14`,
              border: `1px solid ${gold}40`,
              color: gold,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: gold }}
            />
            {tagline} · Addis Ababa, Ethiopia
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Systems That{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(135deg, ${gold}, ${gold}cc)` }}
            >
              Power
            </span>{' '}
            Your Business
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-[#A0A0A0] leading-relaxed max-w-2xl mx-auto mb-10">
            BM Software builds purpose-driven enterprise platforms for Ethiopian businesses — from pharmacy inventory management to café operations — engineered to be powerful, intuitive, and built for the way local businesses actually work.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#A0A0A0',
                }}
              >
                <Icon className="w-4 h-4" style={{ color: gold }} />
                {label}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button size="lg" onClick={scrollToContact}>
              Request a Demo
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="secondary" onClick={scrollToSystems}>
              Explore Our Systems
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: gold }}>
                  {value}
                </div>
                <div className="text-sm text-[#A0A0A0]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToSystems}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-colors animate-bounce"
        style={{ color: `${gold}66` }}
        aria-label="Scroll down"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </section>
  );
}
