import { useEditorStore } from '../store/useEditorStore';
import { useIsMobile } from '../hooks/useIsMobile';

export function RightPanel({ onEditCallout }) {
  const elements = useEditorStore(s => s.elements);
  const selectedId = useEditorStore(s => s.selectedId);
  const selectElement = useEditorStore(s => s.selectElement);
  const updateElementWithHistory = useEditorStore(s => s.updateElementWithHistory);
  const updateElement = useEditorStore(s => s.updateElement);
  const toggleVisibility = useEditorStore(s => s.toggleVisibility);
  const deleteElement = useEditorStore(s => s.deleteElement);
  const isMobile = useIsMobile();

  const selected = elements.find(e => e.id === selectedId);

  // Mobile: fixed bottom sheet
  if (isMobile) {
    return (
      <div
        className="mobile-props-sheet"
        style={{ transform: selected ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="mobile-drawer-handle" />
        <div className="mobile-sheet-header">
          <span style={{ fontFamily: 'var(--cond)', fontWeight: 700 }}>Properties</span>
          <button onClick={() => selectElement(null)}>✕</button>
        </div>

        {selected && (
          <div style={{ padding: '12px 16px' }}>
            {/* Properties */}
            <div className="prop-row">
              <span className="prop-label">Label</span>
              <input
                className="prop-input"
                type="text"
                value={selected.label.split('\n')[0]}
                onChange={e => updateElement(selectedId, {
                  label: e.target.value + (selected.label.includes('\n')
                    ? '\n' + selected.label.split('\n').slice(1).join('\n')
                    : '')
                })}
                style={{ flex: 1 }}
              />
            </div>
            <div className="prop-row">
              <span className="prop-label">Color</span>
              <input
                className="prop-input"
                type="color"
                value={selected.color}
                onChange={e => updateElement(selectedId, { color: e.target.value })}
              />
            </div>
            <div className="prop-row">
              <span className="prop-label">Opacity</span>
              <input
                className="prop-input"
                type="range"
                min="10" max="100"
                value={Math.round(selected.opacity * 100)}
                onChange={e => updateElement(selectedId, { opacity: e.target.value / 100 })}
                style={{ flex: 1 }}
              />
            </div>
            <div className="prop-row">
              <span className="prop-label">Width</span>
              <input
                className="prop-input"
                type="range"
                min="30" max="600"
                value={selected.w}
                onChange={e => updateElement(selectedId, { w: parseInt(e.target.value) })}
                style={{ flex: 1 }}
              />
            </div>

            {(selected.type === 'callout' || selected.type === 'aolabel') && (
              <div style={{ marginTop: 8 }}>
                <button
                  className="tb-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onEditCallout(selected)}
                >
                  ✏️ Edit Text
                </button>
              </div>
            )}
            <div style={{ marginTop: 8 }}>
              <button
                className="tb-btn danger"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => deleteElement(selectedId)}
              >
                🗑 Delete Element
              </button>
            </div>

            <div className="mobile-sheet-divider" />

            {/* Compact layers list */}
            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>
              Layers ({elements.length})
            </div>
            <div style={{ overflowY: 'auto', maxHeight: '30vh' }}>
              {[...elements].reverse().map(el => (
                <div
                  key={el.id}
                  className={`layer-item${el.id === selectedId ? ' selected' : ''}`}
                  onClick={() => selectElement(el.id)}
                >
                  <div className="layer-dot" style={{ background: el.color }} />
                  <span className="layer-name">{el.label.split('\n')[0]}</span>
                  <span
                    className="layer-vis"
                    title={el.visible ? 'Hide' : 'Show'}
                    onClick={e => { e.stopPropagation(); toggleVisibility(el.id); }}
                  >
                    {el.visible ? '👁' : '🚫'}
                  </span>
                </div>
              ))}
              {elements.length === 0 && (
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', padding: '8px 4px' }}>
                  No elements yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop: right sidebar (unchanged)
  return (
    <div className="right-panel">
      {/* Properties */}
      <div className="rp-section">
        <div className="rp-title">Properties</div>
        {!selected ? (
          <div className="no-selection-hint">
            Click an element<br />to edit its properties
          </div>
        ) : (
          <div>
            <div className="prop-row">
              <span className="prop-label">Label</span>
              <input
                className="prop-input"
                type="text"
                value={selected.label.split('\n')[0]}
                onChange={e => updateElement(selectedId, {
                  label: e.target.value + (selected.label.includes('\n')
                    ? '\n' + selected.label.split('\n').slice(1).join('\n')
                    : '')
                })}
              />
            </div>
            <div className="prop-row">
              <span className="prop-label">Color</span>
              <input
                className="prop-input"
                type="color"
                value={selected.color}
                onChange={e => updateElement(selectedId, { color: e.target.value })}
              />
            </div>
            <div className="prop-row">
              <span className="prop-label">Opacity</span>
              <input
                className="prop-input"
                type="range"
                min="10" max="100"
                value={Math.round(selected.opacity * 100)}
                onChange={e => updateElement(selectedId, { opacity: e.target.value / 100 })}
              />
            </div>
            <div className="prop-row">
              <span className="prop-label">Width</span>
              <input
                className="prop-input"
                type="range"
                min="30" max="600"
                value={selected.w}
                onChange={e => updateElement(selectedId, { w: parseInt(e.target.value) })}
              />
            </div>
            {(selected.type === 'callout' || selected.type === 'aolabel') && (
              <div style={{ marginTop: 8 }}>
                <button
                  className="tb-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onEditCallout(selected)}
                >
                  ✏️ Edit Text
                </button>
              </div>
            )}
            <div style={{ marginTop: 8 }}>
              <button
                className="tb-btn danger"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => deleteElement(selectedId)}
              >
                🗑 Delete Element
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Layers */}
      <div className="rp-section" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="rp-title">Layers ({elements.length})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[...elements].reverse().map(el => (
            <div
              key={el.id}
              className={`layer-item${el.id === selectedId ? ' selected' : ''}`}
              onClick={() => selectElement(el.id)}
            >
              <div className="layer-dot" style={{ background: el.color }} />
              <span className="layer-name">{el.label.split('\n')[0]}</span>
              <span
                className="layer-vis"
                title={el.visible ? 'Hide' : 'Show'}
                onClick={e => { e.stopPropagation(); toggleVisibility(el.id); }}
              >
                {el.visible ? '👁' : '🚫'}
              </span>
            </div>
          ))}
          {elements.length === 0 && (
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', padding: '8px 4px' }}>
              No elements yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
