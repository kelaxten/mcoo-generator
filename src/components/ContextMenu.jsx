import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/useEditorStore';

const TEXT_TYPES = new Set(['callout', 'aolabel']);

export function ContextMenu({ menu, onClose, onEditText }) {
  const ref = useRef(null);
  const elements = useEditorStore(s => s.elements);
  const duplicateElement = useEditorStore(s => s.duplicateElement);
  const deleteElement = useEditorStore(s => s.deleteElement);
  const bringToFront = useEditorStore(s => s.bringToFront);
  const sendToBack = useEditorStore(s => s.sendToBack);
  const bringForward = useEditorStore(s => s.bringForward);
  const sendBackward = useEditorStore(s => s.sendBackward);

  useEffect(() => {
    const handler = () => onClose();
    document.addEventListener('click', handler);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') onClose(); });
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [onClose]);

  if (!menu) return null;

  // Keep menu inside viewport
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;
  const menuW = 180;
  const menuH = 230;
  const x = Math.min(menu.x, viewW - menuW);
  const y = Math.min(menu.y, viewH - menuH);

  const { elementId } = menu;
  const el = elements.find(e => e.id === elementId);
  const hasText = el && TEXT_TYPES.has(el.type);

  return (
    <div
      ref={ref}
      className="ctx-menu"
      style={{ left: x, top: y }}
      onClick={e => e.stopPropagation()}
    >
      {hasText && (
        <div className="ctx-item" onClick={() => { onEditText(elementId); onClose(); }}>
          [EDT] Edit Text
        </div>
      )}
      <div className="ctx-item" onClick={() => { duplicateElement(elementId); onClose(); }}>
        [DUP] Duplicate
      </div>
      <div className="ctx-sep" />
      <div className="ctx-item" onClick={() => { bringToFront(elementId); onClose(); }}>
        [TOP] Bring to Front
      </div>
      <div className="ctx-item" onClick={() => { bringForward(elementId); onClose(); }}>
        [+1] Bring Forward
      </div>
      <div className="ctx-item" onClick={() => { sendBackward(elementId); onClose(); }}>
        [-1] Send Backward
      </div>
      <div className="ctx-item" onClick={() => { sendToBack(elementId); onClose(); }}>
        [BOT] Send to Back
      </div>
      <div className="ctx-sep" />
      <div className="ctx-item danger" onClick={() => { deleteElement(elementId); onClose(); }}>
        [DEL] Delete
      </div>
    </div>
  );
}
