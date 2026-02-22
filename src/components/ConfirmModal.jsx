import { useEffect } from 'react';

export function ConfirmModal({ message, onConfirm, onCancel }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div
      className="callout-editor-backdrop"
      style={{ zIndex: 10001 }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--red)',
          borderRadius: 1,
          padding: 24,
          width: 340,
          maxWidth: '90vw',
          boxShadow: '0 12px 40px rgba(0,0,0,0.85)',
        }}
      >
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--red)',
          letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12,
        }}>
          // CONFIRM OPERATION
        </div>
        <div style={{
          fontFamily: 'var(--cond)', fontSize: 15, color: 'var(--text)',
          marginBottom: 20, lineHeight: 1.4,
        }}>
          {message}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            className="ce-btn ce-cancel"
            onClick={onCancel}
            style={{ flex: 'none', padding: '7px 20px' }}
          >
            CANCEL
          </button>
          <button
            className="ce-btn"
            onClick={onConfirm}
            autoFocus
            style={{
              flex: 'none', padding: '7px 20px',
              background: 'var(--red)', color: '#fff', border: 'none',
            }}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
}
