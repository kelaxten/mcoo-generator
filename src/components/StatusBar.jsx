import { useEditorStore } from '../store/useEditorStore';

export function StatusBar() {
  const elements = useEditorStore(s => s.elements);
  const selectedId = useEditorStore(s => s.selectedId);
  const canvasW = useEditorStore(s => s.canvasW);
  const canvasH = useEditorStore(s => s.canvasH);
  const past = useEditorStore(s => s.past);
  const zoom = useEditorStore(s => s.zoom);

  const selected = elements.find(e => e.id === selectedId);
  const zoomPct = Math.round(zoom * 100);

  return (
    <div className="statusbar">
      <div className="sb-item">EL: <span>{elements.length}</span></div>
      <div className="sb-item">CVS: <span>{canvasW}×{canvasH}</span></div>
      <div className="sb-item">SEL: <span>{selected ? selected.label.split('\n')[0] : '--'}</span></div>
      <div className="sb-item">HIST: <span>{past.length}</span></div>
      <div className="sb-item">ZOOM: <span>{zoomPct}%</span></div>
      <div className="sb-item" style={{ marginLeft: 'auto' }}>
        [click] spawn · [drag] move · [ctrl+scroll] zoom · [ctrl+z] undo · [rclick] options · [dblclick] edit text
      </div>
    </div>
  );
}
