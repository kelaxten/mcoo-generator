import { useRef } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { exportToJPG, exportToPDF, saveProject, loadProjectFile } from '../utils/exportUtils';

const MAX_CANVAS_W = 1600;

export function Topbar({ stageRef }) {
  const fileInputRef = useRef(null);
  const mapFileName = useEditorStore(s => s.mapFileName);
  const canvasW = useEditorStore(s => s.canvasW);
  const canvasH = useEditorStore(s => s.canvasH);
  const clearAll = useEditorStore(s => s.clearAll);
  const undo = useEditorStore(s => s.undo);
  const redo = useEditorStore(s => s.redo);
  const past = useEditorStore(s => s.past);
  const future = useEditorStore(s => s.future);
  const setMapImage = useEditorStore(s => s.setMapImage);
  const getProjectData = useEditorStore(s => s.getProjectData);
  const loadProjectData = useEditorStore(s => s.loadProjectData);

  function loadMapFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > MAX_CANVAS_W) { h = Math.round(h * MAX_CANVAS_W / w); w = MAX_CANVAS_W; }
        setMapImage(ev.target.result, file.name, w, h);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function handleLoad() {
    try {
      const data = await loadProjectFile();
      loadProjectData(data);
    } catch (e) {
      alert('Could not load project: ' + e.message);
    }
  }

  return (
    <div className="topbar">
      <div className="topbar-logo">MCOO <span>GEN</span></div>
      <div className="topbar-sep" />

      {/* Map loading */}
      <label>
        <div className="tb-btn" style={{ cursor: 'pointer' }}>🗺 Load Map</div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={e => loadMapFile(e.target.files[0])}
          style={{ display: 'none' }}
        />
      </label>

      <div className="filename-display" title={mapFileName || 'no map loaded'}>
        {mapFileName || 'no map loaded'}
      </div>

      <div className="topbar-sep" />

      {/* Undo / Redo */}
      <button
        className="tb-btn"
        onClick={undo}
        disabled={past.length === 0}
        title="Undo (Ctrl+Z)"
        style={{ opacity: past.length === 0 ? 0.4 : 1 }}
      >
        ↩ Undo
      </button>
      <button
        className="tb-btn"
        onClick={redo}
        disabled={future.length === 0}
        title="Redo (Ctrl+Y)"
        style={{ opacity: future.length === 0 ? 0.4 : 1 }}
      >
        ↪ Redo
      </button>

      <div className="topbar-sep" />

      {/* Save / Load project */}
      <button className="tb-btn" onClick={() => saveProject(getProjectData())} title="Save .mcoo project file">
        💾 Save
      </button>
      <button className="tb-btn" onClick={handleLoad} title="Load .mcoo project file">
        📂 Open
      </button>

      <div className="topbar-spacer" />

      <button
        className="tb-btn danger"
        onClick={() => { if (window.confirm('Clear all MCOO elements?')) clearAll(); }}
        title="Clear all elements"
      >
        🗑 Clear
      </button>

      <div className="topbar-sep" />

      <button
        className="tb-btn"
        onClick={() => exportToJPG(stageRef)}
        title="Export as JPG"
      >
        ⬇ JPG
      </button>
      <button
        className="tb-btn primary"
        onClick={() => exportToPDF(stageRef, canvasW, canvasH)}
        title="Export as PDF"
      >
        ⬇ PDF
      </button>
    </div>
  );
}
