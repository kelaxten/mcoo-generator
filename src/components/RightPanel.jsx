import { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { useIsMobile } from '../hooks/useIsMobile';

const TEXT_TYPES = new Set(['callout', 'aolabel']);

// Shared numeric + range row
function PropSlider({ label, value, min, max, step = 1, onChange, disabled }) {
  return (
    <div className="prop-row">
      <span className="prop-label">{label}</span>
      <input
        className="prop-input"
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ flex: 1 }}
        disabled={disabled}
      />
      <input
        className="prop-input"
        type="number"
        min={min} max={max} step={step}
        value={value}
        onChange={e => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)));
        }}
        style={{ width: 48 }}
        disabled={disabled}
      />
    </div>
  );
}

export function RightPanel({ onEditCallout }) {
  const elements = useEditorStore(s => s.elements);
  const selectedId = useEditorStore(s => s.selectedId);
  const selectElement = useEditorStore(s => s.selectElement);
  const updateElement = useEditorStore(s => s.updateElement);
  const toggleVisibility = useEditorStore(s => s.toggleVisibility);
  const toggleLock = useEditorStore(s => s.toggleLock);
  const deleteElement = useEditorStore(s => s.deleteElement);
  const reorderElement = useEditorStore(s => s.reorderElement);
  const isMobile = useIsMobile();

  const [dragOverId, setDragOverId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const selected = elements.find(e => e.id === selectedId);

  function layerRow(el) {
    const isSelected = el.id === selectedId;
    const isDragOver = dragOverId === el.id && draggingId !== el.id;
    return (
      <div
        key={el.id}
        draggable
        onDragStart={(e) => { setDraggingId(el.id); e.dataTransfer.effectAllowed = 'move'; }}
        onDragOver={(e) => { e.preventDefault(); if (el.id !== draggingId) setDragOverId(el.id); }}
        onDragLeave={() => setDragOverId(null)}
        onDrop={(e) => {
          e.preventDefault();
          if (draggingId && draggingId !== el.id) reorderElement(draggingId, el.id);
          setDraggingId(null); setDragOverId(null);
        }}
        onDragEnd={() => { setDraggingId(null); setDragOverId(null); }}
        className={[
          'layer-item',
          isSelected ? 'selected' : '',
          el.locked ? 'locked' : '',
          isDragOver ? 'drag-over' : '',
        ].filter(Boolean).join(' ')}
        onClick={() => selectElement(el.id)}
      >
        <span className="layer-drag-handle" title="Drag to reorder">[≡]</span>
        <div className="layer-dot" style={{ background: el.color }} />
        <span className="layer-name" title={el.label.split('\n')[0]}>{el.label.split('\n')[0]}</span>
        <span
          className={`layer-lock${el.locked ? ' active' : ''}`}
          title={el.locked ? 'Unlock' : 'Lock'}
          onClick={e => { e.stopPropagation(); toggleLock(el.id); }}
        >
          {el.locked ? '[L]' : '[ ]'}
        </span>
        <span
          className="layer-vis"
          title={el.visible ? 'Hide' : 'Show'}
          onClick={e => { e.stopPropagation(); toggleVisibility(el.id); }}
        >
          {el.visible ? 'ON' : '--'}
        </span>
      </div>
    );
  }

  // ── Mobile ──────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        className="mobile-props-sheet"
        style={{ transform: selected ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="mobile-drawer-handle" />
        <div className="mobile-sheet-header">
          <span style={{ fontFamily: 'var(--cond)', fontWeight: 700 }}>
            Properties{selected?.locked ? ' [LOCKED]' : ''}
          </span>
          <button onClick={() => selectElement(null)}>✕</button>
        </div>

        {selected && (
          <div style={{ padding: '12px 16px' }}>
            <div className="prop-row">
              <span className="prop-label">Label</span>
              <input
                className="prop-input"
                type="text"
                value={selected.label.split('\n')[0]}
                onChange={e => updateElement(selectedId, {
                  label: e.target.value + (selected.label.includes('\n')
                    ? '\n' + selected.label.split('\n').slice(1).join('\n') : '')
                })}
                style={{ flex: 1 }}
                disabled={selected.locked}
              />
            </div>
            <div className="prop-row">
              <span className="prop-label">Color</span>
              <input
                className="prop-input" type="color"
                value={selected.color}
                onChange={e => updateElement(selectedId, { color: e.target.value })}
                disabled={selected.locked}
              />
            </div>
            <PropSlider
              label="Opacity" min={5} max={100}
              value={Math.round(selected.opacity * 100)}
              onChange={v => updateElement(selectedId, { opacity: v / 100 })}
              disabled={selected.locked}
            />
            <PropSlider
              label="Width" min={30} max={600}
              value={selected.w}
              onChange={v => updateElement(selectedId, { w: v })}
              disabled={selected.locked}
            />
            <PropSlider
              label="Rotate" min={-180} max={180}
              value={Math.round(selected.rotation || 0)}
              onChange={v => updateElement(selectedId, { rotation: v })}
              disabled={selected.locked}
            />

            {TEXT_TYPES.has(selected.type) && !selected.locked && (
              <div style={{ marginTop: 8 }}>
                <button className="tb-btn" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onEditCallout(selected)}>
                  [EDT] Edit Text
                </button>
              </div>
            )}
            <div style={{ marginTop: 8 }}>
              <button
                className={`tb-btn${selected.locked ? '' : ' danger'}`}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => selected.locked ? toggleLock(selectedId) : deleteElement(selectedId)}
              >
                {selected.locked ? '[L] Unlock to Edit' : '[DEL] Delete Element'}
              </button>
            </div>

            <div className="mobile-sheet-divider" />

            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>
              Layers ({elements.length})
            </div>
            <div style={{ overflowY: 'auto', maxHeight: '30vh' }}>
              {[...elements].reverse().map(layerRow)}
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

  // ── Desktop ─────────────────────────────────────────────────────────────────
  return (
    <div className="right-panel">
      {/* Properties */}
      <div className="rp-section">
        <div className="rp-title">
          Properties{selected?.locked ? <span style={{ color: 'var(--accent)', marginLeft: 6 }}>[LOCKED]</span> : ''}
        </div>
        {!selected ? (
          <div className="no-selection-hint">
            Click an element<br />to edit its properties
          </div>
        ) : (
          <div>
            <div className="prop-row">
              <span className="prop-label">Label</span>
              <input
                className="prop-input" type="text"
                value={selected.label.split('\n')[0]}
                onChange={e => updateElement(selectedId, {
                  label: e.target.value + (selected.label.includes('\n')
                    ? '\n' + selected.label.split('\n').slice(1).join('\n') : '')
                })}
                disabled={selected.locked}
              />
            </div>
            <div className="prop-row">
              <span className="prop-label">Color</span>
              <input
                className="prop-input" type="color"
                value={selected.color}
                onChange={e => updateElement(selectedId, { color: e.target.value })}
                disabled={selected.locked}
              />
            </div>
            <PropSlider
              label="Opacity" min={5} max={100}
              value={Math.round(selected.opacity * 100)}
              onChange={v => updateElement(selectedId, { opacity: v / 100 })}
              disabled={selected.locked}
            />
            <PropSlider
              label="Width" min={30} max={600}
              value={selected.w}
              onChange={v => updateElement(selectedId, { w: v })}
              disabled={selected.locked}
            />
            <PropSlider
              label="Rotate" min={-180} max={180}
              value={Math.round(selected.rotation || 0)}
              onChange={v => updateElement(selectedId, { rotation: v })}
              disabled={selected.locked}
            />

            {TEXT_TYPES.has(selected.type) && !selected.locked && (
              <div style={{ marginTop: 8 }}>
                <button className="tb-btn" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onEditCallout(selected)}>
                  [EDT] Edit Text
                </button>
              </div>
            )}
            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
              <button
                className={`tb-btn${selected.locked ? '' : ' danger'}`}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => toggleLock(selectedId)}
                title={selected.locked ? 'Unlock element' : 'Lock element'}
              >
                {selected.locked ? '[ ] Unlock' : '[L] Lock'}
              </button>
              {!selected.locked && (
                <button
                  className="tb-btn danger"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => deleteElement(selectedId)}
                >
                  [DEL]
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Layers */}
      <div className="rp-section" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="rp-title">Layers ({elements.length})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[...elements].reverse().map(layerRow)}
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
