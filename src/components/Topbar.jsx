import { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { exportToJPG, exportToPDF, saveProject, loadProjectFile } from '../utils/exportUtils';

const MAX_CANVAS_W = 1600;

export function Topbar({ stageRef, onFeedback, onAbout }) {
  const fileInputRef = useRef(null);
  const [overflowOpen, setOverflowOpen] = useState(false);

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

  // Close overflow menu when clicking outside
  useEffect(() => {
    if (!overflowOpen) return;
    const handler = () => setOverflowOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [overflowOpen]);

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

  function handleClear() {
    if (window.confirm('Clear all MCOO elements?')) clearAll();
  }

  return (
    <div className="topbar">
      <div className="topbar-logo">MCOO <span>GEN</span></div>
      <div className="topbar-sep" />

      {/* Map loading — icon-only on mobile, full label on desktop */}
      <label>
        <div className="tb-btn" style={{ cursor: 'pointer' }}>
          🗺<span className="topbar-desktop-only" style={{ marginLeft: 6 }}>Load Map</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={e => loadMapFile(e.target.files[0])}
          style={{ display: 'none' }}
        />
      </label>

      <div className="filename-display topbar-desktop-only" title={mapFileName || 'no map loaded'}>
        {mapFileName || 'no map loaded'}
      </div>

      <div className="topbar-sep topbar-desktop-only" />

      {/* Undo / Redo — always visible */}
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

      {/* Save / Load — desktop only */}
      <div className="topbar-sep topbar-desktop-only" />
      <button className="tb-btn topbar-desktop-only" onClick={() => saveProject(getProjectData())} title="Save .mcoo project file">
        💾 Save
      </button>
      <button className="tb-btn topbar-desktop-only" onClick={handleLoad} title="Load .mcoo project file">
        📂 Open
      </button>

      <div className="topbar-spacer" />

      {/* Clear — desktop only */}
      <button
        className="tb-btn danger topbar-desktop-only"
        onClick={handleClear}
        title="Clear all elements"
      >
        🗑 Clear
      </button>

      <div className="topbar-sep topbar-desktop-only" />

      {/* Export — always visible */}
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

      {/* Feedback / About — desktop only */}
      <div className="topbar-sep topbar-desktop-only" />
      <button
        className="tb-btn topbar-desktop-only"
        onClick={onFeedback}
        title="Submit a feature request or bug report"
        style={{ borderColor: 'var(--purple)', color: 'var(--purple)' }}
      >
        💡 Feedback
      </button>
      <button
        className="tb-btn topbar-desktop-only"
        onClick={onAbout}
        title="About MCOO Generator"
        style={{ borderColor: 'var(--muted)', color: 'var(--muted)' }}
      >
        ℹ About
      </button>

      {/* Mobile-only overflow button */}
      <button
        className="tb-btn topbar-mobile-only"
        onClick={(e) => { e.stopPropagation(); setOverflowOpen(o => !o); }}
        title="More options"
      >
        ⋯
      </button>

      {/* Overflow dropdown */}
      {overflowOpen && (
        <div className="topbar-overflow-menu" onClick={(e) => e.stopPropagation()}>
          <div className="ctx-item" onClick={() => { saveProject(getProjectData()); setOverflowOpen(false); }}>
            💾 Save Project
          </div>
          <div className="ctx-item" onClick={() => { handleLoad(); setOverflowOpen(false); }}>
            📂 Open Project
          </div>
          <div className="ctx-sep" />
          <div className="ctx-item danger" onClick={() => { handleClear(); setOverflowOpen(false); }}>
            🗑 Clear All
          </div>
          <div className="ctx-sep" />
          <div className="ctx-item" onClick={() => { onFeedback(); setOverflowOpen(false); }}>
            💡 Feedback
          </div>
          <div className="ctx-item" onClick={() => { onAbout(); setOverflowOpen(false); }}>
            ℹ About
          </div>
        </div>
      )}
    </div>
  );
}
