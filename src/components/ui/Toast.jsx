import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'success', duration = 3500 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Portal — bottom right */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const isSuccess = toast.type === 'success';

  return (
    <div
      className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl min-w-[260px] max-w-sm transition-all duration-300"
      style={{
        background: '#111111',
        border: `1px solid ${isSuccess ? 'rgba(201,168,76,0.4)' : 'rgba(239,68,68,0.4)'}`,
        boxShadow: `0 8px 32px ${isSuccess ? 'rgba(201,168,76,0.15)' : 'rgba(239,68,68,0.15)'}`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
      }}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
      ) : (
        <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
      )}
      <p className="flex-1 text-sm text-white leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#555] hover:text-white transition-colors shrink-0 mt-0.5"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
