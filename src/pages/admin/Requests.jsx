import { useEffect, useState } from 'react';
import { Search, Mail, Phone, Building2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getDemoRequests, updateRequestStatus } from '../../data/store';

const STATUS_OPTIONS = ['new', 'contacted', 'demo scheduled', 'closed'];

const statusStyles = {
  new: { background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' },
  contacted: { background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' },
  'demo scheduled': { background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' },
  closed: { background: 'rgba(255,255,255,0.05)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.08)' },
};

function RequestRow({ request, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(request.submittedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div
      className="rounded-2xl overflow-hidden transition-colors"
      style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.12)' }}
      onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid rgba(201,168,76,0.25)')}
      onMouseLeave={(e) => (e.currentTarget.style.border = '1px solid rgba(201,168,76,0.12)')}
    >
      {/* Row header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
          style={{
            background: 'rgba(201,168,76,0.12)',
            border: '1px solid rgba(201,168,76,0.25)',
            color: '#C9A84C',
          }}
        >
          {request.fullName?.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-white">{request.fullName}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={statusStyles[request.status] || statusStyles.new}
            >
              {request.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-0.5 text-xs text-[#555]">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {request.companyName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
            {request.interestedIn && (
              <span style={{ color: '#C9A84C' }}>→ {request.interestedIn}</span>
            )}
          </div>
        </div>

        {/* Status selector */}
        <select
          value={request.status}
          onChange={(e) => onStatusChange(request.id, e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg text-[#A0A0A0] focus:outline-none transition-colors"
          style={{ background: '#0a0a0a', border: '1px solid rgba(201,168,76,0.2)' }}
          onFocus={(e) => (e.target.style.borderColor = '#C9A84C')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 text-[#555] hover:text-white transition-colors"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="px-5 pb-5 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}
        >
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 shrink-0" style={{ color: '#C9A84C' }} />
            <a
              href={`mailto:${request.email}`}
              className="text-[#A0A0A0] truncate transition-colors"
              onMouseEnter={(e) => (e.target.style.color = '#C9A84C')}
              onMouseLeave={(e) => (e.target.style.color = '#A0A0A0')}
            >
              {request.email}
            </a>
          </div>
          {request.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 shrink-0" style={{ color: '#C9A84C' }} />
              <a
                href={`tel:${request.phone}`}
                className="text-[#A0A0A0] transition-colors"
                onMouseEnter={(e) => (e.target.style.color = '#C9A84C')}
                onMouseLeave={(e) => (e.target.style.color = '#A0A0A0')}
              >
                {request.phone}
              </a>
            </div>
          )}
          {request.message && (
            <div className="sm:col-span-2">
              <div className="text-xs text-[#555] mb-1">Message</div>
              <p
                className="text-sm text-[#A0A0A0] rounded-xl p-4 leading-relaxed"
                style={{ background: '#0a0a0a', border: '1px solid rgba(201,168,76,0.1)' }}
              >
                {request.message}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const load = () => setRequests(getDemoRequests());
  useEffect(() => { load(); }, []);

  const handleStatusChange = (id, status) => {
    updateRequestStatus(id, status);
    load();
  };

  const filtered = requests.filter((r) => {
    const matchSearch =
      r.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Demo Requests</h1>
          <p className="text-[#A0A0A0] mt-1">
            {requests.length} total · {requests.filter((r) => r.status === 'new').length} new
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, or email..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-[#555] text-sm focus:outline-none transition-colors"
              style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.15)' }}
              onFocus={(e) => (e.target.style.borderColor = '#C9A84C')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.15)')}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl text-[#A0A0A0] text-sm focus:outline-none transition-colors"
            style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.15)' }}
            onFocus={(e) => (e.target.style.borderColor = '#C9A84C')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.15)')}
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#555]">
            {search || filterStatus !== 'all'
              ? 'No requests match your filters.'
              : 'No demo requests yet. They will appear here when clients submit the contact form.'}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <RequestRow key={r.id} request={r} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
