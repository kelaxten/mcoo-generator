import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line, Image as KonvaImage, Transformer } from 'react-konva';
import { useEditorStore } from '../store/useEditorStore';
import { ElementRenderer } from '../elements/ElementRenderer';
import { useIsMobile } from '../hooks/useIsMobile';

// Elements that prefer ratio-locked transforms
const KEEP_RATIO_TYPES = new Set(['keyterrain']);
// Elements where rotation doesn't make sense (full-width bars)
const NO_ROTATE_TYPES = new Set(['header', 'footer']);

export function Canvas({ stageRef, onContextMenu, onDblClickElement }) {
  const elements = useEditorStore(s => s.elements);
  const selectedId = useEditorStore(s => s.selectedId);
  const canvasW = useEditorStore(s => s.canvasW);
  const canvasH = useEditorStore(s => s.canvasH);
  const mapDataUrl = useEditorStore(s => s.mapDataUrl);
  const selectElement = useEditorStore(s => s.selectElement);
  const updateElement = useEditorStore(s => s.updateElement);
  const zoom = useEditorStore(s => s.zoom);
  const setZoom = useEditorStore(s => s.setZoom);
  const gridSize = useEditorStore(s => s.gridSize);

  const transformerRef = useRef(null);
  const containerRef = useRef(null);
  const [mapImage, setMapImage] = useState(null);
  const [autoScale, setAutoScale] = useState(1);
  const isMobile = useIsMobile();

  const effectiveScale = autoScale * zoom;

  // Load map image
  useEffect(() => {
    if (!mapDataUrl) { setMapImage(null); return; }
    const img = new window.Image();
    img.onload = () => setMapImage(img);
    img.src = mapDataUrl;
  }, [mapDataUrl]);

  // Auto-scale stage to fit container width
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const containerW = entries[0].contentRect.width;
      setAutoScale(containerW < canvasW ? containerW / canvasW : 1);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [canvasW]);

  // Prevent browser Ctrl+scroll zoom on the canvas container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => { if (e.ctrlKey || e.metaKey) e.preventDefault(); };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  // Sync Transformer to selected node — skip locked elements
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    const el = selectedId ? elements.find(e => e.id === selectedId) : null;

    if (selectedId && el && !el.locked) {
      const node = stageRef.current.findOne('#' + selectedId);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.keepRatio(KEEP_RATIO_TYPES.has(el.type));
        transformerRef.current.rotateEnabled(!NO_ROTATE_TYPES.has(el.type));
        if (el.type === 'obstacle' || el.type === 'rail') {
          transformerRef.current.enabledAnchors(['middle-left', 'middle-right']);
        } else {
          transformerRef.current.enabledAnchors([
            'top-left', 'top-center', 'top-right',
            'middle-right', 'middle-left',
            'bottom-left', 'bottom-center', 'bottom-right',
          ]);
        }
      } else {
        transformerRef.current.nodes([]);
      }
    } else {
      transformerRef.current.nodes([]);
    }
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId, elements]);

  const handleStageClick = useCallback((e) => {
    if (e.target === e.target.getStage() || e.target.getClassName() === 'Image') {
      selectElement(null);
    }
  }, [selectElement]);

  const handleDragEnd = useCallback((el, e) => {
    // Locked elements snap back to their stored position
    if (el.locked) {
      e.target.x(el.x);
      e.target.y(el.y);
      e.target.getLayer()?.batchDraw();
      return;
    }
    const s = (v) => gridSize > 0 ? Math.round(v / gridSize) * gridSize : Math.round(v);
    updateElement(el.id, { x: s(e.target.x()), y: s(e.target.y()) });
  }, [updateElement, gridSize]);

  const handleTransformEnd = useCallback((el, e) => {
    if (el.locked) return;
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    const s = (v) => gridSize > 0 ? Math.round(v / gridSize) * gridSize : Math.round(v);
    updateElement(el.id, {
      x: s(node.x()),
      y: s(node.y()),
      w: Math.max(20, Math.round(el.w * scaleX)),
      h: Math.max(20, Math.round(el.h * scaleY)),
      rotation: node.rotation(),
    });
  }, [updateElement, gridSize]);

  // Ctrl+wheel → zoom in/out
  const handleWheel = useCallback((e) => {
    if (!e.evt.ctrlKey && !e.evt.metaKey) return;
    e.evt.preventDefault();
    const factor = e.evt.deltaY < 0 ? 1.1 : 1 / 1.1;
    setZoom(zoom * factor);
  }, [zoom, setZoom]);

  // Build grid lines
  const gridLines = [];
  if (gridSize > 0) {
    for (let y = 0; y <= canvasH; y += gridSize)
      gridLines.push(<Line key={`h${y}`} points={[0, y, canvasW, y]} stroke="rgba(255,255,255,0.07)" strokeWidth={0.5} />);
    for (let x = 0; x <= canvasW; x += gridSize)
      gridLines.push(<Line key={`v${x}`} points={[x, 0, x, canvasH]} stroke="rgba(255,255,255,0.07)" strokeWidth={0.5} />);
  }

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <Stage
        ref={stageRef}
        width={canvasW * effectiveScale}
        height={canvasH * effectiveScale}
        scaleX={effectiveScale}
        scaleY={effectiveScale}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTap={handleStageClick}
        style={{ display: 'block', boxShadow: '0 0 40px rgba(0,0,0,0.6)' }}
      >
        {/* Background layer: map image */}
        <Layer listening={false}>
          {mapImage ? (
            <KonvaImage image={mapImage} x={0} y={0} width={canvasW} height={canvasH} />
          ) : (
            <KonvaImage x={0} y={0} width={canvasW} height={canvasH} fillAfterStrokeEnabled={false} />
          )}
        </Layer>

        {/* Elements layer */}
        <Layer>
          {elements.map(el => (
            <ElementRenderer
              key={el.id}
              el={el}
              isSelected={el.id === selectedId}
              onSelect={() => selectElement(el.id)}
              onDblClick={() => onDblClickElement(el)}
              onContextMenu={(e) => {
                e.evt.preventDefault();
                selectElement(el.id);
                onContextMenu(e.evt, el);
              }}
              onDragEnd={(e) => handleDragEnd(el, e)}
              onTransformEnd={(e) => handleTransformEnd(el, e)}
            />
          ))}
          <Transformer
            ref={transformerRef}
            borderStroke="#d98b2a"
            borderStrokeWidth={1.5}
            anchorFill="#d98b2a"
            anchorStroke="#00070d"
            anchorStrokeWidth={1}
            anchorSize={isMobile ? 14 : 8}
            anchorCornerRadius={1}
            rotateAnchorOffset={16}
            padding={4}
          />
        </Layer>

        {/* Grid overlay layer */}
        {gridSize > 0 && (
          <Layer listening={false}>
            {gridLines}
          </Layer>
        )}
      </Stage>
    </div>
  );
}
