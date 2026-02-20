import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/useEditorStore';

export function ContextMenu({ menu, onClose, onEditText }) {
  const ref = useRef(null);
  const duplicateElement = useEditorStore(s => s.duplicateElement);
  const deleteElement = useEditorStore(s => s.deleteElement);
  const bringToFront = useEditorStore(s => s.bringToFront);
  const sendToBack = useEditorStore(s => s.sendToBack);

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
  const menuW = 170;
  const menuH = 180;
  const x = Math.min(menu.x, viewW - menuW);
  const y = Math.min(menu.y, viewH - menuH);

  const { elementId } = menu;

  return (
    <div
      ref={ref}
      className="ctx-menu"
      style={{ left: x, top: y }}
      onClick={e => e.stopPropagation()}
    >
      <div className="ctx-item" onClick={() => { onEditText(elementId); onClose(); }}>
        ✏️ Edit Text
      </div>
      <div className="ctx-item" onClick={() => { duplicateElement(elementId); onClose(); }}>
        ⧉ Duplicate
      </div>
      <div className="ctx-sep" />
      <div className="ctx-item" onClick={() => { bringToFront(elementId); onClose(); }}>
        ⬆ Bring to Front
      </div>
      <div className="ctx-item" onClick={() => { sendToBack(elementId); onClose(); }}>
        ⬇ Send to Back
      </div>
      <div className="ctx-sep" />
      <div className="ctx-item danger" onClick={() => { deleteElement(elementId); onClose(); }}>
        🗑 Delete
      </div>
    </div>
  );
}
