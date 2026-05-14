const statusColors = {
  active: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  'in development': 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  completed: 'bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30',
};

export function StatusBadge({ status }) {
  const label =
    status === 'in development'
      ? 'In Development'
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-[#1a1a1a] text-[#A0A0A0]'}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function TechBadge({ label }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#1a1a1a] text-[#A0A0A0] border border-[#C9A84C]/20">
      {label}
    </span>
  );
}
