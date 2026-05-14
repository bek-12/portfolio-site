import { ExternalLink, PlayCircle } from 'lucide-react';
import { StatusBadge, TechBadge } from '../ui/Badge';
import Button from '../ui/Button';

export default function ProjectCard({ project, onRequestDemo }) {
  return (
    <article
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: '#111111',
        border: '1px solid rgba(201,168,76,0.15)',
        boxShadow: '0 0 0 0 rgba(201,168,76,0)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1px solid rgba(201,168,76,0.4)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(201,168,76,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid rgba(201,168,76,0.15)';
        e.currentTarget.style.boxShadow = '0 0 0 0 rgba(201,168,76,0)';
      }}
    >
      {/* Cover image */}
      <div className="relative h-52 overflow-hidden bg-[#1a1a1a]">
        <img
          src={project.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-70" />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={project.status} />
        </div>

        {/* Live demo link */}
        {project.liveDemo && (
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,168,76,0.8)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.6)')}
          >
            <ExternalLink className="w-3 h-3" />
            Live Demo
          </a>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3
          className="text-lg font-bold text-white mb-2 transition-colors"
          style={{}}
          onMouseEnter={(e) => (e.target.style.color = '#C9A84C')}
          onMouseLeave={(e) => (e.target.style.color = '#fff')}
        >
          {project.title}
        </h3>
        <p className="text-sm text-[#A0A0A0] leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
        </div>

        {/* CTA */}
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onRequestDemo(project.title)}
        >
          <PlayCircle className="w-4 h-4" />
          Request Demo
        </Button>
      </div>
    </article>
  );
}
