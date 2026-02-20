import { useRef, useState, useEffect, useCallback } from 'react';
import { useEditorStore } from './store/useEditorStore';
import { Topbar } from './components/Topbar';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { RightPanel } from './components/RightPanel';
import { StatusBar } from './components/StatusBar';
import { CalloutEditor } from './components/CalloutEditor';
import { ContextMenu } from './components/ContextMenu';

const MAX_CANVAS_W = 1600;

export default function App() {
  const stageRef = useRef(null);

  const mapDataUrl = useEditorStore(s => s.mapDataUrl);
  const setMapImage = useEditorStore(s => s.setMapImage);
  const selectedId = useEditorStore(s => s.selectedId);
  const deleteElement = useEditorStore(s => s.deleteElement);
  const updateElement = useEditorStore(s => s.updateElement);
  const selectElement = useEditorStore(s => s.selectElement);
  const undo = useEditorStore(s => s.undo);
  const redo = useEditorStore(s => s.redo);

  const [calloutEl, setCalloutEl] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      const tag = document.activeElement?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA';

      if (e.key === 'Escape') {
        selectElement(null);
        setContextMenu(null);
        setCalloutEl(null);
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        if (selectedId) deleteElement(selectedId);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, deleteElement, selectElement, undo, redo]);

  // ── Map drag-drop on the canvas area ──────────────────────────────────
  function handleAreaDragOver(e) {
    e.preventDefault();
    if (!mapDataUrl) setDragOver(true);
  }
  function handleAreaDragLeave() { setDragOver(false); }
  function handleAreaDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadMapImage(file);
  }

  function loadMapImage(file) {
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

  // ── Callout editor ────────────────────────────────────────────────────
  const handleEditCallout = useCallback((el) => {
    setCalloutEl(el);
  }, []);

  const handleSaveCallout = useCallback((id, updates) => {
    updateElement(id, updates);
  }, [updateElement]);

  // ── Context menu ──────────────────────────────────────────────────────
  const handleContextMenu = useCallback((nativeEvent, el) => {
    nativeEvent.preventDefault();
    setContextMenu({ x: nativeEvent.clientX, y: nativeEvent.clientY, elementId: el.id });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Topbar stageRef={stageRef} />

      <div className="main-layout">
        <Toolbar />

        {/* Canvas area with drop zone */}
        <div
          className="canvas-area"
          onDragOver={handleAreaDragOver}
          onDragLeave={handleAreaDragLeave}
          onDrop={handleAreaDrop}
        >
          {!mapDataUrl && (
            <div
              className={`canvas-drop-overlay${dragOver ? ' drag-over' : ''}`}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = e => { if (e.target.files[0]) loadMapImage(e.target.files[0]); };
                input.click();
              }}
            >
              <div className="dp-icon">🗺</div>
              <div className="dp-title">Load a Map Image</div>
              <div className="dp-sub">Click "Load Map" in the toolbar or drop an image here</div>
              <div className="dp-sub" style={{ marginTop: 4, opacity: .6 }}>PNG, JPG, WEBP supported</div>
            </div>
          )}

          <Canvas
            stageRef={stageRef}
            onContextMenu={handleContextMenu}
            onDblClickElement={handleEditCallout}
          />
        </div>

        <RightPanel onEditCallout={handleEditCallout} />
      </div>

      <StatusBar />

      {/* Overlays */}
      {calloutEl && (
        <CalloutEditor
          element={calloutEl}
          onSave={handleSaveCallout}
          onClose={() => setCalloutEl(null)}
        />
      )}

      {contextMenu && (
        <ContextMenu
          menu={contextMenu}
          onClose={() => setContextMenu(null)}
          onEditText={(id) => {
            const el = useEditorStore.getState().elements.find(e => e.id === id);
            if (el) setCalloutEl(el);
          }}
        />
      )}
    </div>
  );
}
