import { useRef, useState, useEffect, useCallback } from 'react';
import { useEditorStore } from './store/useEditorStore';
import { Topbar } from './components/Topbar';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { RightPanel } from './components/RightPanel';
import { StatusBar } from './components/StatusBar';
import { CalloutEditor } from './components/CalloutEditor';
import { ContextMenu } from './components/ContextMenu';
import { FeedbackModal } from './components/FeedbackModal';
import { AboutModal } from './components/AboutModal';
import { Toast } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';

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
  const clearAll = useEditorStore(s => s.clearAll);

  const [calloutEl, setCalloutEl] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      const tag = document.activeElement?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA';

      if (e.key === 'Escape') {
        selectElement(null);
        setContextMenu(null);
        setCalloutEl(null);
        setFeedbackOpen(false);
        setAboutOpen(false);
        setConfirmClear(false);
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
      <Topbar
        stageRef={stageRef}
        onFeedback={() => setFeedbackOpen(true)}
        onAbout={() => setAboutOpen(true)}
        onClear={() => setConfirmClear(true)}
        onToast={showToast}
      />

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
              <div className="dp-icon">[MAP]</div>
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

      {feedbackOpen && (
        <FeedbackModal onClose={() => setFeedbackOpen(false)} />
      )}

      {aboutOpen && (
        <AboutModal onClose={() => setAboutOpen(false)} />
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

      {confirmClear && (
        <ConfirmModal
          message="Clear all MCOO elements from the canvas?"
          onConfirm={() => { clearAll(); setConfirmClear(false); }}
          onCancel={() => setConfirmClear(false)}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
}
