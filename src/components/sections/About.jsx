import { CheckCircle2, MapPin, Lightbulb, Heart } from 'lucide-react';

const COMMITMENTS = [
  'Deep understanding of the Ethiopian business environment',
  'Software that is powerful without being complicated',
  'Transparent development process with regular client updates',
  'Responsive support and continuous product improvement',
  'Affordable pricing designed for local businesses',
  'Systems that grow and adapt as your business evolves',
];

const PILLARS = [
  {
    icon: MapPin,
    title: 'Built for Ethiopia',
    description:
      'We understand the local business environment deeply. Our systems are designed around the real challenges Ethiopian businesses face every day.',
  },
  {
    icon: Lightbulb,
    title: 'Simple Yet Powerful',
    description:
      'We believe great software should be easy to use without sacrificing depth. Every feature we build is intentional.',
  },
  {
    icon: Heart,
    title: 'Growing With You',
    description:
      'We are at the start of our journey and we grow alongside our clients. Your feedback shapes every update we release.',
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.25)',
              color: '#C9A84C',
            }}
          >
            Who We Are
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            About BM Software
          </h2>
          <p className="text-lg text-[#A0A0A0] max-w-3xl mx-auto leading-relaxed">
            BM Software is an Addis Ababa-based software startup founded in June 2025 by{' '}
            <span className="text-white font-medium">Bereket Mebratu</span>. We build purpose-driven enterprise software that solves real operational problems for Ethiopian businesses. From pharmacy inventory management to café operations, our systems are designed to be powerful, intuitive, and built for the way local businesses actually work. We are a young and ambitious team with a clear mission: to make enterprise-grade software accessible to every Ethiopian business.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-8 rounded-2xl transition-colors"
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(201,168,76,0.12)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid rgba(201,168,76,0.35)')}
              onMouseLeave={(e) => (e.currentTarget.style.border = '1px solid rgba(201,168,76,0.12)')}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.2)',
                }}
              >
                <Icon className="w-6 h-6" style={{ color: '#C9A84C' }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Commitments */}
        <div
          className="rounded-2xl p-8 lg:p-12"
          style={{
            background: '#0a0a0a',
            border: '1px solid rgba(201,168,76,0.12)',
          }}
        >
          <h3 className="text-xl font-bold text-white mb-8 text-center">Our Commitments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COMMITMENTS.map((value) => (
              <div key={value} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                <span className="text-sm text-[#A0A0A0]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
