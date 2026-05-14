// Uses --accent CSS variable (set by AccentColorSync in App.jsx) so the
// primary/secondary variants update live when the brand color changes.
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style: extraStyle = {},
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  // Variant styles — primary and secondary use the CSS variable
  const variantClass = {
    primary:   'text-black focus:ring-[var(--accent,#C9A84C)]',
    secondary: 'bg-transparent text-[var(--accent,#C9A84C)] focus:ring-[var(--accent,#C9A84C)]',
    ghost:     'bg-transparent text-[#A0A0A0] hover:text-white hover:bg-white/5 focus:ring-[#555]',
    danger:    'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500',
    success:   'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500',
  }[variant] || '';

  const variantStyle =
    variant === 'primary'
      ? {
          background: 'var(--accent, #C9A84C)',
          boxShadow: '0 4px 14px color-mix(in srgb, var(--accent, #C9A84C) 30%, transparent)',
          ...extraStyle,
        }
      : variant === 'secondary'
      ? {
          border: '1px solid var(--accent, #C9A84C)',
          ...extraStyle,
        }
      : extraStyle;

  return (
    <button
      className={`${base} ${variantClass} ${sizes[size]} ${className}`}
      style={variantStyle}
      onMouseEnter={(e) => {
        if (variant === 'primary') e.currentTarget.style.opacity = '0.88';
        if (variant === 'secondary') {
          e.currentTarget.style.background = 'color-mix(in srgb, var(--accent, #C9A84C) 12%, transparent)';
          e.currentTarget.style.color = 'var(--accent, #C9A84C)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') e.currentTarget.style.opacity = '1';
        if (variant === 'secondary') {
          e.currentTarget.style.background = 'transparent';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
