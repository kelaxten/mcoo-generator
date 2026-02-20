import { useState } from 'react';

const REPO = 'kelaxten/mcoo-generator';

const TYPES = [
  {
    id: 'feature',
    label: '🚀 Feature Request',
    ghLabel: 'enhancement',
    titlePlaceholder: 'e.g. Freehand polygon drawing for terrain',
    bodyTemplate: `## Feature Request

**What would you like to see?**


**Why would this help your workflow?**


**Any doctrinal reference (ATP, FM, etc.)?**

`,
  },
  {
    id: 'bug',
    label: '🐛 Bug Report',
    ghLabel: 'bug',
    titlePlaceholder: 'e.g. Obstacle line disappears after resize',
    bodyTemplate: `## Bug Report

**What happened?**


**Steps to reproduce:**
1.
2.

**Expected behavior:**


**Browser / OS:**

`,
  },
  {
    id: 'feedback',
    label: '💬 General Feedback',
    ghLabel: 'feedback',
    titlePlaceholder: 'e.g. Overall thoughts after first use',
    bodyTemplate: `## Feedback


`,
  },
];

export function FeedbackModal({ onClose }) {
  const [typeId, setTypeId] = useState('feature');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState(TYPES[0].bodyTemplate);

  const activeType = TYPES.find(t => t.id === typeId);

  function handleTypeChange(id) {
    setTypeId(id);
    setBody(TYPES.find(t => t.id === id).bodyTemplate);
  }

  function handleSubmit() {
    const params = new URLSearchParams({
      title: title.trim() || '(no title)',
      body: body,
      labels: activeType.ghLabel,
    });
    window.open(
      `https://github.com/${REPO}/issues/new?${params.toString()}`,
      '_blank',
      'noopener,noreferrer'
    );
    onClose();
  }

  return (
    <div
      className="callout-editor-backdrop"
      onClick={onClose}
      style={{ zIndex: 10000 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--accent)',
          borderRadius: 8,
          padding: 20,
          width: 480,
          maxWidth: '95vw',
          boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{
              fontFamily: 'var(--cond)', fontWeight: 900, fontSize: 16,
              letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase',
            }}>
              Submit Feedback
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>
              Opens a pre-filled GitHub issue in a new tab
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', color: 'var(--muted)',
              fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '2px 6px',
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Type selector */}
        <div style={{ marginBottom: 14 }}>
          <div className="ce-label" style={{ marginBottom: 6 }}>Type</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => handleTypeChange(t.id)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: 4,
                  border: `1px solid ${typeId === t.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: typeId === t.id ? 'rgba(232,200,74,0.12)' : 'transparent',
                  color: typeId === t.id ? 'var(--accent)' : 'var(--text)',
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  cursor: 'pointer',
                  transition: 'all .15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 12 }}>
          <div className="ce-label">Title</div>
          <input
            className="ce-input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={activeType.titlePlaceholder}
            autoFocus
            style={{ marginBottom: 0 }}
          />
        </div>

        {/* Body */}
        <div style={{ marginBottom: 14 }}>
          <div className="ce-label">Details</div>
          <textarea
            className="ce-textarea"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={8}
            style={{ marginBottom: 0, minHeight: 160 }}
          />
        </div>

        {/* Footer note */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
          marginBottom: 14, lineHeight: 1.5,
          padding: '8px 10px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 4,
        }}>
          ℹ️ Clicking "Open GitHub" will open a pre-filled issue in your browser.
          A free GitHub account is needed to submit — viewing is open to all.
        </div>

        {/* Actions */}
        <div className="ce-row">
          <button
            className="ce-btn ce-ok"
            onClick={handleSubmit}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            Open GitHub ↗
          </button>
          <button className="ce-btn ce-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
