// ─── Base URL ─────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('bm_token');
export const setToken = (t) => localStorage.setItem('bm_token', t);
export const clearToken = () => localStorage.removeItem('bm_token');

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    // Network error — server is unreachable (offline, sleeping on Render free tier, etc.)
    throw new Error('Cannot reach the server. Please wait a moment and try again.');
  }

  // 204 No Content
  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (username, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getProfile: () => request('/api/auth/profile'),

  updateProfile: (data) =>
    request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword, newPassword) =>
    request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll: () => request('/api/projects'),

  getOne: (id) => request(`/api/projects/${id}`),

  create: (data) =>
    request('/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        techStack: data.techStack,
        status: data.status,
        coverImage: data.coverImage,
        liveDemo: data.liveDemo,
      }),
    }),

  update: (id, data) =>
    request(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        techStack: data.techStack,
        status: data.status,
        coverImage: data.coverImage,
        liveDemo: data.liveDemo,
      }),
    }),

  delete: (id) => request(`/api/projects/${id}`, { method: 'DELETE' }),
};

// ─── Demo Requests ────────────────────────────────────────────────────────────
export const demoRequestsAPI = {
  create: (data) =>
    request('/api/demo-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => request('/api/demo-requests'),

  updateStatus: (id, status) =>
    request(`/api/demo-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  delete: (id) => request(`/api/demo-requests/${id}`, { method: 'DELETE' }),
};
