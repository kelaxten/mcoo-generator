import { useEffect } from 'react';

export function Toast({ message, type = 'success', onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  const isError = type === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 36,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20000,
        background: isError ? '#120404' : '#03120a',
        border: `1px solid ${isError ? 'var(--red)' : '#2aff6e'}`,
        color: isError ? 'var(--red)' : '#2aff6e',
        fontFamily: 'var(--mono)',
        fontSize: 11,
        letterSpacing: 2,
        textTransform: 'uppercase',
        padding: '8px 20px',
        borderRadius: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.75)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
}
