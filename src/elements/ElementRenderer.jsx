import { useMemo, forwardRef } from 'react';
import {
  Group, Rect, Ellipse, Circle, Line, Arrow, Text,
} from 'react-konva';
import { getHatchPattern, hexToRgba } from '../utils/hatch';

// ── Transparent bounding-box hit target ───────────────────────────────────
const HitRect = ({ w, h }) => (
  <Rect x={0} y={0} width={w} height={h} fill="transparent" />
);

// ── Terrain: oval with hatch (water, deadground) ──────────────────────────
const OvalTerrainElement = ({ el }) => {
  const cx = el.w / 2, cy = el.h / 2;
  const hatch = useMemo(() => getHatchPattern(hexToRgba(el.color, 0.5), 10), [el.color]);
  return (
    <>
      <Ellipse
        x={cx} y={cy} radiusX={el.w / 2} radiusY={el.h / 2}
        fill={hexToRgba(el.color, 0.28)} listening={false}
      />
      <Group
        clipFunc={ctx => {
          ctx.beginPath();
          ctx.ellipse(cx, cy, el.w / 2, el.h / 2, 0, 0, Math.PI * 2);
          ctx.closePath();
        }}
        listening={false}
      >
        <Rect
          x={0} y={0} width={el.w} height={el.h}
          fillPatternImage={hatch}
          fillPatternRepeat="repeat"
          listening={false}
        />
      </Group>
      <Ellipse
        x={cx} y={cy} radiusX={el.w / 2} radiusY={el.h / 2}
        stroke={el.color} strokeWidth={2} fill="transparent" listening={false}
      />
      <Text
        x={0} y={cy - 6} width={el.w} align="center"
        text={el.label.split('\n')[0]}
        fill={el.color} fontFamily="Share Tech Mono, monospace"
        fontSize={10} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── Terrain: rect with hatch (restrictive, severely_restrictive) ──────────
const RectTerrainElement = ({ el }) => {
  const hatch = useMemo(() => getHatchPattern(hexToRgba(el.color, 0.5), 10), [el.color]);
  return (
    <>
      <Rect
        x={0} y={0} width={el.w} height={el.h}
        fill={hexToRgba(el.color, 0.22)} listening={false}
      />
      <Group
        clipFunc={ctx => { ctx.rect(0, 0, el.w, el.h); }}
        listening={false}
      >
        <Rect
          x={0} y={0} width={el.w} height={el.h}
          fillPatternImage={hatch}
          fillPatternRepeat="repeat"
          listening={false}
        />
      </Group>
      <Rect
        x={0} y={0} width={el.w} height={el.h}
        stroke={el.color} strokeWidth={2} fill="transparent" listening={false}
      />
      <Text
        x={0} y={el.h / 2 - 6} width={el.w} align="center"
        text={el.label.split('\n')[0]}
        fill={el.color} fontFamily="Share Tech Mono, monospace"
        fontSize={10} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── Obstacle / Rail (horizontal line + tick marks) ─────────────────────────
const ObstacleElement = ({ el }) => {
  const midY = el.h / 2;
  const lw = el.type === 'obstacle' ? 4 : 3;
  const tickCount = Math.max(3, Math.floor(el.w / 22));
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => ({
    tx: (el.w / tickCount) * i,
  }));
  return (
    <>
      <HitRect w={el.w} h={el.h} />
      <Line
        points={[0, midY, el.w, midY]}
        stroke={el.color} strokeWidth={lw} listening={false}
      />
      {ticks.map(({ tx }, i) => (
        <Line
          key={i}
          points={[tx, midY - 9, tx, midY + 9]}
          stroke={el.color} strokeWidth={1.8} listening={false}
        />
      ))}
      <Text
        x={0} y={midY + 12} width={el.w} align="center"
        text={el.label}
        fill={el.color} fontFamily="Share Tech Mono, monospace"
        fontSize={10} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── Avenue of Approach ────────────────────────────────────────────────────
const AAElement = ({ el }) => {
  const midY = el.h / 2;
  const lines = el.label.split('\n');
  const boxW = Math.min(100, Math.max(70, el.w * 0.48));
  const boxH = 34;
  const boxX = el.w / 2 - boxW / 2;
  const boxY = midY - boxH - 4;
  return (
    <>
      <HitRect w={el.w} h={el.h} />
      <Arrow
        points={[0, midY, el.w, midY]}
        stroke={el.color} strokeWidth={5}
        fill={el.color}
        pointerLength={14} pointerWidth={16}
        listening={false}
      />
      <Rect
        x={boxX} y={boxY} width={boxW} height={boxH}
        fill={hexToRgba(el.color, 0.88)} stroke={el.color} strokeWidth={1.5}
        cornerRadius={2} listening={false}
      />
      <Text
        x={boxX} y={boxY + 4} width={boxW} align="center"
        text={lines[0] || ''}
        fill="white" fontFamily="Barlow Condensed, sans-serif"
        fontSize={13} fontStyle="bold" listening={false}
      />
      <Text
        x={boxX} y={boxY + 18} width={boxW} align="center"
        text={(lines[1] || '').toUpperCase()}
        fill="white" fontFamily="Barlow Condensed, sans-serif"
        fontSize={10} listening={false}
      />
    </>
  );
};

// ── Key Terrain ───────────────────────────────────────────────────────────
const KeyTerrainElement = ({ el }) => {
  const r = Math.min(el.w, el.h) / 2;
  const cx = el.w / 2, cy = el.h / 2;
  return (
    <>
      <Circle x={cx} y={cy} radius={r} fill={el.color} listening={false} />
      <Text
        x={0} y={cy - Math.max(9, r * 0.6) * 0.7} width={el.w} align="center"
        text={el.label}
        fill="white" fontFamily="Share Tech Mono, monospace"
        fontSize={Math.max(9, Math.floor(r * 0.6))} fontStyle="bold"
        listening={false}
      />
    </>
  );
};

// ── Objective ─────────────────────────────────────────────────────────────
const ObjectiveElement = ({ el }) => (
  <>
    <Rect
      x={0} y={0} width={el.w} height={el.h}
      fill={hexToRgba('#1a2235', 0.88)} listening={false}
    />
    <Rect
      x={0} y={0} width={el.w} height={el.h}
      stroke={el.color} strokeWidth={2} fill="transparent" listening={false}
    />
    <Text
      x={0} y={el.h / 2 - 7} width={el.w} align="center"
      text={el.label}
      fill={el.color} fontFamily="Share Tech Mono, monospace"
      fontSize={12} fontStyle="bold" listening={false}
    />
  </>
);

// ── Analyst Callout Box ───────────────────────────────────────────────────
const CalloutElement = ({ el }) => {
  const titleH = 22;
  const bgColor = getCalloutBg(el.color);
  const bodyLines = (el.body || '').split('\n').slice(0, 6);
  return (
    <>
      <Rect
        x={0} y={0} width={el.w} height={el.h}
        fill={bgColor} stroke={el.color} strokeWidth={2} cornerRadius={2} listening={false}
      />
      <Rect
        x={0} y={0} width={el.w} height={titleH}
        fill={el.color} cornerRadius={[2, 2, 0, 0]} listening={false}
      />
      <Text
        x={6} y={5} width={el.w - 12}
        text={el.label.length > 32 ? el.label.substring(0, 30) + '…' : el.label}
        fill="white" fontFamily="Share Tech Mono, monospace"
        fontSize={10} fontStyle="bold" listening={false}
      />
      {bodyLines.map((line, i) => (
        <Text
          key={i}
          x={7} y={titleH + 6 + i * 14}
          width={el.w - 14}
          text={line.substring(0, 38)}
          fill="#111111" fontFamily="Barlow, sans-serif"
          fontSize={9} listening={false}
        />
      ))}
    </>
  );
};

// ── AA Label Box ──────────────────────────────────────────────────────────
const AALabelElement = ({ el }) => {
  const lines = el.label.split('\n');
  return (
    <>
      <Rect
        x={0} y={0} width={el.w} height={el.h}
        fill={hexToRgba(el.color, 0.88)} stroke={el.color} strokeWidth={2} cornerRadius={2}
        listening={false}
      />
      <Text
        x={0} y={el.h / 2 - 13} width={el.w} align="center"
        text={lines[0] || ''}
        fill="white" fontFamily="Barlow Condensed, sans-serif"
        fontSize={13} fontStyle="bold" listening={false}
      />
      <Text
        x={0} y={el.h / 2 + 1} width={el.w} align="center"
        text={(lines[1] || '').toUpperCase()}
        fill="white" fontFamily="Barlow Condensed, sans-serif"
        fontSize={10} listening={false}
      />
    </>
  );
};

// ── Legend Block ──────────────────────────────────────────────────────────
const LEGEND_ENTRIES = [
  { color: '#d63030', label: 'AO Boundary', drawType: 'dash' },
  { color: '#3b6fd4', label: 'Water (Unfordable)', drawType: 'fill' },
  { color: '#2e8b4a', label: 'Restrictive Terrain', drawType: 'fill' },
  { color: '#d97706', label: 'Severely Restrictive', drawType: 'fill' },
  { color: '#b48c3c', label: 'Dead Ground / Defilade', drawType: 'fill' },
  { color: '#d63030', label: 'Linear Obstacle', drawType: 'tick' },
  { color: '#7c3aed', label: 'Elevated Rail', drawType: 'tick' },
  { color: '#7c3aed', label: 'Key Terrain (K#)', drawType: 'circle' },
  { color: '#d63030', label: 'Avenue of Approach', drawType: 'arrow' },
];

const LegendElement = ({ el }) => {
  const headerH = 22;
  const rowH = 20;
  const swatchSx = 10;
  const swatchW = 42;

  return (
    <>
      <Rect x={0} y={0} width={el.w} height={el.h}
        fill="rgba(255,255,255,0.96)" stroke="#14284a" strokeWidth={2} listening={false}
      />
      <Rect x={0} y={0} width={el.w} height={headerH} fill="#14284a" listening={false} />
      <Text
        x={0} y={0} width={el.w} height={headerH}
        align="center" verticalAlign="middle"
        text="LEGEND"
        fill="#e8c84a" fontFamily="Barlow Condensed, sans-serif"
        fontSize={11} fontStyle="bold" listening={false}
      />

      {LEGEND_ENTRIES.map((entry, idx) => {
        const ey = headerH + idx * rowH;
        if (ey + rowH > el.h) return null;
        const sy = ey + rowH / 2;
        return (
          <Group key={idx} listening={false}>
            {entry.drawType === 'fill' && (
              <Rect
                x={swatchSx} y={ey + 3} width={swatchW} height={rowH - 6}
                fill={hexToRgba(entry.color, 0.35)} stroke={entry.color} strokeWidth={1.5}
                listening={false}
              />
            )}
            {entry.drawType === 'dash' && (
              <Line
                points={[swatchSx, sy, swatchSx + swatchW, sy]}
                stroke={entry.color} strokeWidth={2} dash={[5, 4]} listening={false}
              />
            )}
            {entry.drawType === 'tick' && (
              <>
                <Line
                  points={[swatchSx, sy, swatchSx + swatchW, sy]}
                  stroke={entry.color} strokeWidth={2.5} listening={false}
                />
                {[10, 21, 32].map(tx => (
                  <Line
                    key={tx}
                    points={[swatchSx + tx, sy - 6, swatchSx + tx, sy + 6]}
                    stroke={entry.color} strokeWidth={1.5} listening={false}
                  />
                ))}
              </>
            )}
            {entry.drawType === 'circle' && (
              <>
                <Circle x={swatchSx + 10} y={sy} radius={8} fill={entry.color} listening={false} />
                <Text
                  x={swatchSx} y={sy - 5} width={20} align="center"
                  text="K#"
                  fill="white" fontFamily="Share Tech Mono, monospace"
                  fontSize={7} fontStyle="bold" listening={false}
                />
              </>
            )}
            {entry.drawType === 'arrow' && (
              <Arrow
                points={[swatchSx, sy, swatchSx + swatchW, sy]}
                stroke={entry.color} strokeWidth={3}
                fill={entry.color}
                pointerLength={8} pointerWidth={9}
                listening={false}
              />
            )}
            <Text
              x={swatchSx + 52} y={ey + 5}
              width={el.w - swatchSx - 58}
              text={entry.label}
              fill="#111111" fontFamily="Barlow, sans-serif"
              fontSize={9} listening={false}
            />
          </Group>
        );
      })}
    </>
  );
};

// ── Title Block ───────────────────────────────────────────────────────────
const TitleBlockElement = ({ el }) => {
  const lines = el.label.split('\n');
  const fields = [
    'GRID: UTM 17R',
    'SCALE: 1:5,000',
    'DATUM: WGS 84',
    lines[2] ? 'DTG: ' + lines[2] : 'DTG:',
    '',
    'PREPARED BY:',
    lines[1] || '',
  ];
  return (
    <>
      <Rect x={0} y={0} width={el.w} height={el.h}
        fill="rgba(255,255,255,0.96)" stroke="#14284a" strokeWidth={2} listening={false}
      />
      <Rect x={0} y={0} width={el.w} height={24} fill="#14284a" listening={false} />
      <Text
        x={0} y={0} width={el.w} height={24}
        align="center" verticalAlign="middle"
        text={lines[0] || 'AO TITLE'}
        fill="#e8c84a" fontFamily="Barlow Condensed, sans-serif"
        fontSize={11} fontStyle="bold" listening={false}
      />
      {fields.map((f, i) => (
        <Text
          key={i}
          x={8} y={36 + i * 14} width={el.w - 16}
          text={f}
          fill="#111111" fontFamily="Share Tech Mono, monospace"
          fontSize={9} listening={false}
        />
      ))}
    </>
  );
};

// ── AO Boundary (dashed rect) ─────────────────────────────────────────────
const AOBoundaryElement = ({ el }) => (
  <>
    <HitRect w={el.w} h={el.h} />
    <Rect
      x={0} y={0} width={el.w} height={el.h}
      stroke={el.color} strokeWidth={2.5}
      fill="transparent" dash={[10, 6]} listening={false}
    />
  </>
);

// ── Header Bar ────────────────────────────────────────────────────────────
const HeaderElement = ({ el }) => (
  <>
    <Rect x={0} y={0} width={el.w} height={el.h} fill="#14284a" listening={false} />
    <Text
      x={12} y={0} height={el.h} verticalAlign="middle"
      text={el.label || 'MCOO'}
      fill="#e8c84a" fontFamily="Barlow Condensed, sans-serif"
      fontSize={18} fontStyle="bold" listening={false}
    />
    <Text
      x={0} y={0} width={el.w - 12} height={el.h} verticalAlign="middle"
      align="right"
      text="UNCLASSIFIED // FOR OFFICIAL USE ONLY"
      fill="#e8c84a" fontFamily="Barlow Condensed, sans-serif"
      fontSize={11} fontStyle="bold" listening={false}
    />
  </>
);

// ── Footer Bar ────────────────────────────────────────────────────────────
const FooterElement = ({ el }) => (
  <>
    <Rect x={0} y={0} width={el.w} height={el.h} fill="#14284a" listening={false} />
    <Text
      x={0} y={0} width={el.w} height={el.h}
      align="center" verticalAlign="middle"
      text={el.label || 'UNCLASSIFIED // FOR OFFICIAL USE ONLY'}
      fill="#e8c84a" fontFamily="Barlow Condensed, sans-serif"
      fontSize={10} fontStyle="bold" listening={false}
    />
  </>
);

// ── Utility ───────────────────────────────────────────────────────────────
function getCalloutBg(color) {
  const map = {
    '#8c6a00': '#fffbe6', '#aa0000': '#fff0f0', '#003caa': '#e8eeff',
    '#6a009a': '#f5eeff', '#7a5500': '#fff6e0', '#aa5500': '#fff0e0',
    '#d63030': '#fff5f5',
  };
  return map[color.toLowerCase()] || '#fffff0';
}

// ── Renderer dispatch table ───────────────────────────────────────────────
const RENDERERS = {
  water: OvalTerrainElement,
  deadground: OvalTerrainElement,
  restrictive: RectTerrainElement,
  severely_restrictive: RectTerrainElement,
  obstacle: ObstacleElement,
  rail: ObstacleElement,
  aa: AAElement,
  keyterrain: KeyTerrainElement,
  objective: ObjectiveElement,
  callout: CalloutElement,
  aolabel: AALabelElement,
  legend: LegendElement,
  titleblock: TitleBlockElement,
  aoboundary: AOBoundaryElement,
  header: HeaderElement,
  footer: FooterElement,
};

// ── Main forwardRef element ───────────────────────────────────────────────
export const ElementRenderer = forwardRef(function ElementRenderer(
  { el, onSelect, onDblClick, onContextMenu, onDragEnd, onTransformEnd },
  ref
) {
  const Renderer = RENDERERS[el.type];
  if (!Renderer) return null;

  return (
    <Group
      ref={ref}
      id={el.id}
      name="mcoo-element"
      x={el.x}
      y={el.y}
      width={el.w}
      height={el.h}
      rotation={el.rotation || 0}
      opacity={el.visible ? el.opacity : 0}
      draggable={!el.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={onDblClick}
      onDblTap={onDblClick}
      onContextMenu={onContextMenu}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    >
      <Renderer el={el} />
    </Group>
  );
});
