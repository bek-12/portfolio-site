// ─── Keys ────────────────────────────────────────────────────────────────────
const PROJECTS_KEY = 'bm_projects';
const REQUESTS_KEY = 'bm_demo_requests';
const SEEDED_KEY = 'bm_seeded_v2';

// ─── Seed projects ────────────────────────────────────────────────────────────
const SEED_PROJECTS = [
  {
    id: '1',
    title: 'Pharmacy Inventory ERP',
    description:
      'A comprehensive pharmacy management platform that streamlines inventory tracking, supplier management, stock alerts, and sales reporting. Built to help pharmacies eliminate manual errors, reduce waste, and maintain full regulatory compliance — all from a single intelligent dashboard.',
    techStack: ['React', 'Tailwind CSS', 'Go'],
    status: 'active',
    coverImage:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    liveDemo: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Café Menu Management System',
    description:
      'A modern digital menu and order management system designed for cafés and restaurants. Enables real-time menu updates, category management, item availability toggling, and daily specials — giving café owners full control of their menu from any device without technical knowledge.',
    techStack: ['React', 'Tailwind CSS', 'Go'],
    status: 'active',
    coverImage:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    liveDemo: '',
    createdAt: new Date().toISOString(),
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────
export function getProjects() {
  // Use a versioned seed key so updating seed data replaces old fake data
  const alreadySeeded = localStorage.getItem(SEEDED_KEY);
  if (!alreadySeeded) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(SEED_PROJECTS));
    localStorage.setItem(SEEDED_KEY, 'true');
    return SEED_PROJECTS;
  }
  const raw = localStorage.getItem(PROJECTS_KEY);
  return raw ? JSON.parse(raw) : SEED_PROJECTS;
}

export function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function addProject(project) {
  const projects = getProjects();
  const newProject = { ...project, id: Date.now().toString(), createdAt: new Date().toISOString() };
  saveProjects([...projects, newProject]);
  return newProject;
}

export function updateProject(id, updates) {
  const projects = getProjects();
  const updated = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveProjects(updated);
  return updated;
}

export function deleteProject(id) {
  const projects = getProjects();
  saveProjects(projects.filter((p) => p.id !== id));
}

// ─── Demo Requests ────────────────────────────────────────────────────────────
export function getDemoRequests() {
  const raw = localStorage.getItem(REQUESTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addDemoRequest(request) {
  const requests = getDemoRequests();
  const newRequest = {
    ...request,
    id: Date.now().toString(),
    submittedAt: new Date().toISOString(),
    status: 'new',
  };
  const updated = [newRequest, ...requests];
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
  return newRequest;
}

export function updateRequestStatus(id, status) {
  const requests = getDemoRequests();
  const updated = requests.map((r) => (r.id === id ? { ...r, status } : r));
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
}
