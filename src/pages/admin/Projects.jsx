import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProjectForm from '../../components/admin/ProjectForm';
import { StatusBadge, TechBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { projectsAPI } from '../../utils/api';

export default function Projects() {
  const [projects, setProjects]       = useState([]);
  const [search, setSearch]           = useState('');
  const [modal, setModal]             = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving]           = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  const load = () =>
    projectsAPI.getAll()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingScreen message="Loading projects..." />;

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (form) => {
    setSaving(true);
    setError('');
    try {
      if (modal === 'add') {
        await projectsAPI.create(form);
      } else {
        await projectsAPI.update(modal.project.id, form);
      }
      await load();
      setModal(null);
    } catch (err) {
      setError(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await projectsAPI.delete(id);
      await load();
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || 'Failed to delete project.');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-[#A0A0A0] mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio</p>
          </div>
          <Button onClick={() => { setError(''); setModal('add'); }}>
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">{error}</div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-[#555] text-sm focus:outline-none transition-colors"
            style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.15)' }}
            onFocus={(e) => (e.target.style.borderColor = '#C9A84C')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.15)')}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#555]">
            {search ? 'No projects match your search.' : 'No projects yet. Add your first one!'}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((project) => (
              <div key={project.id}
                className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl transition-colors"
                style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.12)' }}
                onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid rgba(201,168,76,0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.border = '1px solid rgba(201,168,76,0.12)')}>
                <div className="w-full sm:w-24 h-20 rounded-xl overflow-hidden bg-[#1a1a1a] shrink-0">
                  <img src={project.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'}
                    alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-white">{project.title}</h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="text-sm text-[#A0A0A0] mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(project.techStack || []).map((t) => <TechBadge key={t} label={t} />)}
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  {project.liveDemo && (
                    <a href={project.liveDemo} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg text-[#A0A0A0] transition-colors"
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#A0A0A0'; e.currentTarget.style.background = 'transparent'; }}>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => { setError(''); setModal({ project }); }}
                    className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteConfirm(project)}
                    className="p-2 rounded-lg text-[#A0A0A0] hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.2)' }}>
            <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
              <h2 className="text-lg font-bold text-white">{modal === 'add' ? 'Add New Project' : 'Edit Project'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 text-[#A0A0A0] hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6">
              {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">{error}</div>}
              <ProjectForm
                initial={modal !== 'add' ? modal.project : null}
                onSave={handleSave}
                onCancel={() => setModal(null)}
                saving={saving}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl shadow-2xl p-6"
            style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.2)' }}>
            <h2 className="text-lg font-bold text-white mb-2">Delete Project?</h2>
            <p className="text-sm text-[#A0A0A0] mb-6">
              Are you sure you want to delete <strong className="text-white">{deleteConfirm.title}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={() => handleDelete(deleteConfirm.id)}>Delete</Button>
              <Button variant="ghost" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
