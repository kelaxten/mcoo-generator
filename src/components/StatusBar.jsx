import { useEditorStore } from '../store/useEditorStore';

export function StatusBar() {
  const elements = useEditorStore(s => s.elements);
  const selectedId = useEditorStore(s => s.selectedId);
  const canvasW = useEditorStore(s => s.canvasW);
  const canvasH = useEditorStore(s => s.canvasH);
  const past = useEditorStore(s => s.past);

  const selected = elements.find(e => e.id === selectedId);

  return (
    <div className="statusbar">
      <div className="sb-item">Elements: <span>{elements.length}</span></div>
      <div className="sb-item">Canvas: <span>{canvasW} × {canvasH}</span></div>
      <div className="sb-item">Selected: <span>{selected ? selected.label.split('\n')[0] : 'none'}</span></div>
      <div className="sb-item">History: <span>{past.length}</span></div>
      <div className="sb-item" style={{ marginLeft: 'auto' }}>
        💡 Click toolbar to spawn · Drag to move · Ctrl+Z undo · Right-click for options · Dbl-click to edit text
      </div>
    </div>
  );
}
