import { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { exportToJPG, exportToPDF, saveProject, loadProjectFile } from '../utils/exportUtils';

const MAX_CANVAS_W = 1600;

export function Topbar({ stageRef, onFeedback, onAbout, onClear, onToast }) {
  const fileInputRef = useRef(null);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const mapFileName = useEditorStore(s => s.mapFileName);
  const canvasW = useEditorStore(s => s.canvasW);
  const canvasH = useEditorStore(s => s.canvasH);
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
      onToast('[LOAD] Project loaded', 'success');
    } catch (e) {
      onToast('[ERR] ' + e.message, 'error');
    }
  }

  function handleExportJPG() {
    try {
      exportToJPG(stageRef);
      onToast('[EXPORT] JPG saved', 'success');
    } catch (e) {
      onToast('[ERR] JPG export failed', 'error');
    }
  }

  function handleExportPDF() {
    try {
      exportToPDF(stageRef, canvasW, canvasH);
      onToast('[EXPORT] PDF saved', 'success');
    } catch (e) {
      onToast('[ERR] PDF export failed', 'error');
    }
  }

  function handleSave() {
    try {
      saveProject(getProjectData());
      onToast('[SAVE] Project saved', 'success');
    } catch (e) {
      onToast('[ERR] Save failed', 'error');
    }
  }

  return (
    <div className="topbar">
      <div className="topbar-logo">MCOO <span>GEN</span></div>
      <div className="topbar-sep" />

      {/* Map loading */}
      <label>
        <div className="tb-btn" style={{ cursor: 'pointer' }} aria-label="Load map image">
          [MAP]<span className="topbar-desktop-only" style={{ marginLeft: 6 }}>Load Map</span>
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

      {/* Undo / Redo */}
      <button
        className="tb-btn"
        onClick={undo}
        disabled={past.length === 0}
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
        style={{ opacity: past.length === 0 ? 0.4 : 1 }}
      >
        ↩<span className="topbar-desktop-only" style={{ marginLeft: 4 }}>Undo</span>
      </button>
      <button
        className="tb-btn"
        onClick={redo}
        disabled={future.length === 0}
        title="Redo (Ctrl+Y)"
        aria-label="Redo"
        style={{ opacity: future.length === 0 ? 0.4 : 1 }}
      >
        ↪<span className="topbar-desktop-only" style={{ marginLeft: 4 }}>Redo</span>
      </button>

      {/* Save / Load — desktop only */}
      <div className="topbar-sep topbar-desktop-only" />
      <button className="tb-btn topbar-desktop-only" onClick={handleSave} title="Save .mcoo project file">
        [SAV] Save
      </button>
      <button className="tb-btn topbar-desktop-only" onClick={handleLoad} title="Load .mcoo project file">
        [OPN] Open
      </button>

      <div className="topbar-spacer" />

      {/* Export — always visible */}
      <button
        className="tb-btn"
        onClick={handleExportJPG}
        title="Export as JPG"
        aria-label="Export as JPG"
      >
        JPG
      </button>
      <button
        className="tb-btn primary"
        onClick={handleExportPDF}
        title="Export as PDF"
        aria-label="Export as PDF"
      >
        PDF
      </button>

      {/* Feedback / About / Clear — desktop only */}
      <div className="topbar-sep topbar-desktop-only" />
      <button
        className="tb-btn topbar-desktop-only"
        onClick={onFeedback}
        title="Submit a feature request or bug report"
        style={{ borderColor: 'var(--purple)', color: 'var(--purple)' }}
      >
        [?] Feedback
      </button>
      <button
        className="tb-btn topbar-desktop-only"
        onClick={onAbout}
        title="About MCOO Generator"
        style={{ borderColor: 'var(--muted)', color: 'var(--muted)' }}
      >
        [i] About
      </button>
      <div className="topbar-sep topbar-desktop-only" />
      <button
        className="tb-btn danger topbar-desktop-only"
        onClick={onClear}
        title="Clear all elements"
      >
        [DEL] Clear
      </button>

      {/* Mobile-only overflow button */}
      <button
        className="tb-btn topbar-mobile-only"
        onClick={(e) => { e.stopPropagation(); setOverflowOpen(o => !o); }}
        title="More options"
        aria-label="More options"
      >
        [•••]
      </button>

      {/* Overflow dropdown */}
      {overflowOpen && (
        <div className="topbar-overflow-menu" onClick={(e) => e.stopPropagation()}>
          <div className="ctx-item" onClick={() => { handleSave(); setOverflowOpen(false); }}>
            [SAV] Save Project
          </div>
          <div className="ctx-item" onClick={() => { handleLoad(); setOverflowOpen(false); }}>
            [OPN] Open Project
          </div>
          <div className="ctx-sep" />
          <div className="ctx-item" onClick={() => { onFeedback(); setOverflowOpen(false); }}>
            [?] Feedback
          </div>
          <div className="ctx-item" onClick={() => { onAbout(); setOverflowOpen(false); }}>
            [i] About
          </div>
          <div className="ctx-sep" />
          <div className="ctx-item danger" onClick={() => { onClear(); setOverflowOpen(false); }}>
            [DEL] Clear All
          </div>
        </div>
      )}
    </div>
  );
}
