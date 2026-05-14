import { useEffect, useState } from 'react';
import { projectsAPI } from '../../utils/api';
import ProjectCard from './ProjectCard';

// Inline skeleton cards shown while projects load — keeps layout stable
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.08)' }}
    >
      <div style={{ height: '208px', background: '#1a1a1a' }} />
      <div className="p-6 space-y-3">
        <div style={{ height: '20px', width: '60%', background: '#1a1a1a', borderRadius: '6px' }} />
        <div style={{ height: '14px', width: '90%', background: '#1a1a1a', borderRadius: '6px' }} />
        <div style={{ height: '14px', width: '75%', background: '#1a1a1a', borderRadius: '6px' }} />
        <div className="flex gap-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '24px', width: '60px', background: '#1a1a1a', borderRadius: '6px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Systems({ onRequestDemo }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    projectsAPI.getAll()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="systems" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}
          >
            Our Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Our Systems
          </h2>
          <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
            Purpose-built platforms designed to solve real operational challenges for Ethiopian businesses.
          </p>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-20 text-[#A0A0A0]">
            No projects yet. Add some from the admin dashboard.
          </div>
        )}

        {/* Project grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onRequestDemo={onRequestDemo} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
