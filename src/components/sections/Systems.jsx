import { useEffect, useState } from 'react';
import { projectsAPI } from '../../utils/api';
import ProjectCard from './ProjectCard';

export default function Systems({ onRequestDemo }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectsAPI.getAll()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  return (
    <section id="systems" className="py-24 bg-[#0a0a0a]">
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
            Our Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Our Systems
          </h2>
          <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
            Purpose-built platforms designed to solve real operational challenges for Ethiopian businesses.
          </p>
        </div>

        {/* Project grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 text-[#A0A0A0]">
            No projects yet. Add some from the admin dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onRequestDemo={onRequestDemo}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
