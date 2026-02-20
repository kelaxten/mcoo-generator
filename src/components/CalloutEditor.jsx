import { useState, useEffect } from 'react';

export function CalloutEditor({ element, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (element) {
      setTitle(element.label);
      setBody(element.body || '');
    }
  }, [element]);

  if (!element) return null;

  const handleSave = () => {
    onSave(element.id, { label: title, body });
    onClose();
  };

  return (
    <div className="callout-editor-backdrop" onClick={onClose}>
      <div className="callout-editor" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--accent)', marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase' }}>
          Edit Element Text
        </div>
        <div className="ce-label">Title / Label</div>
        <input
          className="ce-input"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />
        <div className="ce-label">Body / Bullets (one per line)</div>
        <textarea
          className="ce-textarea"
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="• Bullet point 1&#10;• Bullet point 2&#10;• Bullet point 3"
        />
        <div className="ce-row">
          <button className="ce-btn ce-ok" onClick={handleSave}>Apply</button>
          <button className="ce-btn ce-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
