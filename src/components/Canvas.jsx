import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { useEditorStore } from '../store/useEditorStore';
import { ElementRenderer } from '../elements/ElementRenderer';

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

  const transformerRef = useRef(null);
  const [mapImage, setMapImage] = useState(null);

  // Load map image
  useEffect(() => {
    if (!mapDataUrl) { setMapImage(null); return; }
    const img = new window.Image();
    img.onload = () => setMapImage(img);
    img.src = mapDataUrl;
  }, [mapDataUrl]);

  // Sync Transformer to selected node
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    if (selectedId) {
      const node = stageRef.current.findOne('#' + selectedId);
      if (node) {
        transformerRef.current.nodes([node]);
        const el = elements.find(e => e.id === selectedId);
        if (el) {
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
    updateElement(el.id, {
      x: Math.round(e.target.x()),
      y: Math.round(e.target.y()),
    });
  }, [updateElement]);

  const handleTransformEnd = useCallback((el, e) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    updateElement(el.id, {
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      w: Math.max(20, Math.round(el.w * scaleX)),
      h: Math.max(20, Math.round(el.h * scaleY)),
      rotation: node.rotation(),
    });
  }, [updateElement]);

  return (
    <Stage
      ref={stageRef}
      width={canvasW}
      height={canvasH}
      onClick={handleStageClick}
      onTap={handleStageClick}
      style={{ display: 'block', boxShadow: '0 0 40px rgba(0,0,0,0.6)' }}
    >
      {/* Background layer: map image */}
      <Layer listening={false}>
        {mapImage ? (
          <KonvaImage image={mapImage} x={0} y={0} width={canvasW} height={canvasH} />
        ) : (
          <KonvaImage
            x={0} y={0} width={canvasW} height={canvasH}
            fillAfterStrokeEnabled={false}
          />
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
          borderStroke="#e8c84a"
          borderStrokeWidth={1.5}
          anchorFill="#e8c84a"
          anchorStroke="#0a0e14"
          anchorStrokeWidth={1}
          anchorSize={8}
          anchorCornerRadius={1}
          rotateAnchorOffset={16}
          padding={4}
        />
      </Layer>
    </Stage>
  );
}
