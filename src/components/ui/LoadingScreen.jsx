/**
 * LoadingScreen — full-screen branded loader.
 * Uses /logo.png from the public folder (place your logo there).
 * Falls back to the text mark "BM Software" if the image fails to load.
 */
export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '28px',
        zIndex: 9999,
      }}
    >
      <style>{`
        @keyframes bmPulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.4; transform: scale(0.95); }
        }
        @keyframes bmBar {
          0%   { width: 0%;    opacity: 1; }
          80%  { width: 100%;  opacity: 1; }
          100% { width: 100%;  opacity: 0; }
        }
        .bm-logo-pulse {
          animation: bmPulse 2s ease-in-out infinite;
        }
        .bm-loading-bar-fill {
          animation: bmBar 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* Logo */}
      <img
        src="/logo.png"
        alt="BM Software"
        className="bm-logo-pulse"
        style={{ height: '120px', width: 'auto', objectFit: 'contain' }}
        onError={(e) => {
          // Fallback: hide broken image, show text mark
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />

      {/* Text fallback (hidden by default, shown if logo.png is missing) */}
      <div
        className="bm-logo-pulse"
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '10px',
          fontSize: '28px',
          fontWeight: '800',
          letterSpacing: '-0.5px',
        }}
      >
        <span style={{ color: '#C9A84C' }}>BM</span>
        <span style={{ color: '#ffffff' }}>Software</span>
      </div>

      {/* Gold loading bar */}
      <div
        style={{
          width: '180px',
          height: '3px',
          borderRadius: '999px',
          background: 'rgba(201,168,76,0.15)',
          overflow: 'hidden',
        }}
      >
        <div
          className="bm-loading-bar-fill"
          style={{
            height: '100%',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #C9A84C, #E2C068)',
            width: '0%',
          }}
        />
      </div>

      {/* Label */}
      <p
        style={{
          fontSize: '13px',
          fontWeight: '500',
          letterSpacing: '0.08em',
          color: '#C9A84C',
          opacity: 0.8,
          marginTop: '-8px',
        }}
      >
        {message}
      </p>
    </div>
  );
}
