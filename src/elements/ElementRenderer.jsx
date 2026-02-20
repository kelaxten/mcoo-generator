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

// ── Wire / Concertina Obstacle ─────────────────────────────────────────────
const WireObstacleElement = ({ el }) => {
  const midY = el.h / 2;
  const loopCount = Math.max(2, Math.floor(el.w / 18));
  return (
    <>
      <HitRect w={el.w} h={el.h} />
      <Line points={[0, midY, el.w, midY]} stroke={el.color} strokeWidth={2.5} listening={false} />
      {Array.from({ length: loopCount }, (_, i) => {
        const cx = (el.w / loopCount) * i + el.w / loopCount / 2;
        return (
          <Circle key={i} x={cx} y={midY - 5} radius={4}
            stroke={el.color} strokeWidth={1.5} fill="transparent" listening={false}
          />
        );
      })}
      <Text x={0} y={midY + 12} width={el.w} align="center"
        text={el.label}
        fill={el.color} fontFamily="Share Tech Mono, monospace" fontSize={10} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── Obstacle Effects: Fix, Block, Disrupt ─────────────────────────────────
const ObstacleEffectElement = ({ el }) => {
  const midY = el.h / 2;
  return (
    <>
      <HitRect w={el.w} h={el.h} />
      <Rect x={0} y={0} width={el.w} height={el.h}
        fill={hexToRgba(el.color, 0.10)} stroke={el.color} strokeWidth={2.5} listening={false}
      />
      <Text x={0} y={midY - 12} width={el.w} align="center"
        text={el.label}
        fill={el.color} fontFamily="Share Tech Mono, monospace"
        fontSize={18} fontStyle="bold" listening={false}
      />
      {el.type === 'obs_fix' && (
        <>
          <Arrow points={[10, midY + 12, el.w / 2 - 10, midY + 12]}
            stroke={el.color} strokeWidth={2} fill={el.color}
            pointerLength={7} pointerWidth={8} listening={false}
          />
          <Arrow points={[el.w - 10, midY + 12, el.w / 2 + 10, midY + 12]}
            stroke={el.color} strokeWidth={2} fill={el.color}
            pointerLength={7} pointerWidth={8} listening={false}
          />
        </>
      )}
      {el.type === 'obs_block' && (
        <>
          {[el.w / 2 - 18, el.w / 2, el.w / 2 + 18].map((bx, i) => (
            <Line key={i} points={[bx, midY + 10, bx, midY + 22]}
              stroke={el.color} strokeWidth={3} listening={false}
            />
          ))}
          <Line points={[el.w / 2 - 24, midY + 22, el.w / 2 + 24, midY + 22]}
            stroke={el.color} strokeWidth={3} listening={false}
          />
        </>
      )}
    </>
  );
};

// ── Obstacle Turn ──────────────────────────────────────────────────────────
const ObstacleTurnElement = ({ el }) => {
  const midY = el.h / 2;
  const turnX = el.w * 0.55;
  return (
    <>
      <HitRect w={el.w} h={el.h} />
      <Rect x={0} y={0} width={el.w} height={el.h}
        fill={hexToRgba(el.color, 0.10)} stroke={el.color} strokeWidth={2.5} listening={false}
      />
      <Text x={0} y={midY - 20} width={el.w} align="center"
        text={el.label}
        fill={el.color} fontFamily="Share Tech Mono, monospace"
        fontSize={16} fontStyle="bold" listening={false}
      />
      <Line points={[el.w * 0.2, midY + 6, turnX, midY + 6, turnX, midY + 22]}
        stroke={el.color} strokeWidth={2.5} listening={false}
      />
      <Arrow points={[turnX, midY + 22, turnX, midY + 34]}
        stroke={el.color} strokeWidth={2.5} fill={el.color}
        pointerLength={8} pointerWidth={9} listening={false}
      />
    </>
  );
};

// ── Minefield Area ─────────────────────────────────────────────────────────
const MinefieldElement = ({ el }) => {
  const headerH = 20;
  const bodyH = el.h - headerH;
  const cols = Math.max(2, Math.floor(el.w / 28));
  const rows = Math.max(1, Math.floor(bodyH / 24));
  const markers = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      markers.push({
        x: (el.w / cols) * c + el.w / cols / 2,
        y: headerH + (bodyH / rows) * r + bodyH / rows / 2,
      });
    }
  }
  return (
    <>
      <Rect x={0} y={0} width={el.w} height={el.h}
        fill={hexToRgba(el.color, 0.07)} stroke={el.color} strokeWidth={2.5}
        dash={[7, 4]} listening={false}
      />
      <Rect x={0} y={0} width={el.w} height={headerH}
        fill={hexToRgba(el.color, 0.85)} listening={false}
      />
      <Text x={0} y={0} width={el.w} height={headerH}
        align="center" verticalAlign="middle"
        text={el.label}
        fill="white" fontFamily="Share Tech Mono, monospace" fontSize={9} fontStyle="bold" listening={false}
      />
      {markers.map((m, i) => (
        <Group key={i} listening={false}>
          <Line points={[m.x - 6, m.y - 6, m.x + 6, m.y + 6]} stroke={el.color} strokeWidth={1.5} listening={false} />
          <Line points={[m.x + 6, m.y - 6, m.x - 6, m.y + 6]} stroke={el.color} strokeWidth={1.5} listening={false} />
        </Group>
      ))}
    </>
  );
};

// ── Breach Lane ────────────────────────────────────────────────────────────
const BreachLaneElement = ({ el }) => {
  const midY = el.h / 2;
  return (
    <>
      <HitRect w={el.w} h={el.h} />
      <Rect x={0} y={0} width={el.w} height={el.h}
        fill={hexToRgba(el.color, 0.15)} stroke={el.color} strokeWidth={2.5} listening={false}
      />
      <Arrow
        points={[14, midY - 4, el.w - 14, midY - 4]}
        stroke={el.color} strokeWidth={3} fill={el.color}
        pointerLength={10} pointerWidth={12} listening={false}
      />
      <Text x={0} y={midY + 8} width={el.w} align="center"
        text={el.label}
        fill={el.color} fontFamily="Share Tech Mono, monospace" fontSize={10} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── Obstacle Group Marker ──────────────────────────────────────────────────
const ObstacleGroupElement = ({ el }) => {
  const r = Math.min(el.w, el.h) / 2 - 4;
  const cx = el.w / 2, cy = el.h / 2;
  return (
    <>
      <Circle x={cx} y={cy} radius={r}
        fill={hexToRgba(el.color, 0.12)} stroke={el.color} strokeWidth={2.5} listening={false}
      />
      <Text x={0} y={cy - 8} width={el.w} align="center"
        text={el.label}
        fill={el.color} fontFamily="Share Tech Mono, monospace" fontSize={11} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── Mobility Corridor ──────────────────────────────────────────────────────
const MobCorridorElement = ({ el }) => {
  const midY = el.h / 2;
  const lines = el.label.split('\n');
  return (
    <>
      <Rect x={0} y={0} width={el.w} height={el.h}
        fill={hexToRgba(el.color, 0.12)} stroke={el.color} strokeWidth={2}
        dash={[8, 5]} listening={false}
      />
      <Arrow
        points={[16, midY, el.w - 16, midY]}
        stroke={el.color} strokeWidth={3} fill={el.color}
        pointerLength={11} pointerWidth={13} listening={false}
      />
      <Arrow
        points={[el.w - 16, midY, 16, midY]}
        stroke={el.color} strokeWidth={3} fill={el.color}
        pointerLength={11} pointerWidth={13} listening={false}
      />
      <Text x={0} y={8} width={el.w} align="center"
        text={lines[0] || ''}
        fill={el.color} fontFamily="Barlow Condensed, sans-serif" fontSize={12} fontStyle="bold" listening={false}
      />
      {lines[1] && (
        <Text x={0} y={el.h - 18} width={el.w} align="center"
          text={lines[1].toUpperCase()}
          fill={el.color} fontFamily="Barlow Condensed, sans-serif" fontSize={10} listening={false}
        />
      )}
    </>
  );
};

// ── NAI ────────────────────────────────────────────────────────────────────
const NAIElement = ({ el }) => {
  const headerH = 20;
  return (
    <>
      <Rect x={0} y={0} width={el.w} height={el.h}
        fill="transparent" stroke={el.color} strokeWidth={2}
        dash={[8, 5]} listening={false}
      />
      <Rect x={0} y={0} width={el.w} height={headerH}
        fill={el.color} listening={false}
      />
      <Text x={0} y={0} width={el.w} height={headerH}
        align="center" verticalAlign="middle"
        text={el.label}
        fill="white" fontFamily="Barlow Condensed, sans-serif" fontSize={11} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── TAI ────────────────────────────────────────────────────────────────────
const TAIElement = ({ el }) => {
  const headerH = 20;
  return (
    <>
      <Rect x={0} y={0} width={el.w} height={el.h}
        fill={hexToRgba(el.color, 0.08)} stroke={el.color} strokeWidth={2.5} listening={false}
      />
      <Rect x={0} y={0} width={el.w} height={headerH}
        fill={hexToRgba(el.color, 0.85)} listening={false}
      />
      <Text x={0} y={0} width={el.w} height={headerH}
        align="center" verticalAlign="middle"
        text={el.label}
        fill="#111" fontFamily="Barlow Condensed, sans-serif" fontSize={11} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── Decision Point (diamond) ───────────────────────────────────────────────
const DecisionPointElement = ({ el }) => {
  const cx = el.w / 2, cy = el.h / 2;
  const hw = el.w / 2 - 4, hh = el.h / 2 - 4;
  const pts = [cx, cy - hh, cx + hw, cy, cx, cy + hh, cx - hw, cy];
  return (
    <>
      <Line points={pts} closed
        stroke={el.color} strokeWidth={2.5}
        fill={hexToRgba(el.color, 0.15)} listening={false}
      />
      <Text x={0} y={cy - 8} width={el.w} align="center"
        text={el.label}
        fill={el.color} fontFamily="Share Tech Mono, monospace" fontSize={11} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── Phase Line / Limit of Advance ─────────────────────────────────────────
const PhaseLineElement = ({ el }) => {
  const midY = el.h / 2;
  const isLOA = el.type === 'limit_of_advance';
  const boxW = Math.min(90, Math.max(60, el.w * 0.35));
  const boxH = 22;
  return (
    <>
      <HitRect w={el.w} h={el.h} />
      <Line
        points={[0, midY, el.w, midY]}
        stroke={el.color} strokeWidth={3}
        dash={isLOA ? [10, 6] : undefined} listening={false}
      />
      <Rect x={el.w / 2 - boxW / 2} y={midY - boxH / 2} width={boxW} height={boxH}
        fill={el.color} cornerRadius={2} listening={false}
      />
      <Text
        x={el.w / 2 - boxW / 2} y={midY - 7} width={boxW} align="center"
        text={el.label}
        fill="white" fontFamily="Share Tech Mono, monospace" fontSize={10} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── Battle Position ────────────────────────────────────────────────────────
const BattlePositionElement = ({ el }) => {
  const headerH = 20;
  return (
    <>
      <Rect x={0} y={0} width={el.w} height={el.h}
        fill={hexToRgba(el.color, 0.20)} stroke={el.color} strokeWidth={2.5} listening={false}
      />
      <Rect x={0} y={0} width={el.w} height={headerH}
        fill={hexToRgba(el.color, 0.90)} listening={false}
      />
      <Text x={0} y={0} width={el.w} height={headerH}
        align="center" verticalAlign="middle"
        text={el.label}
        fill="white" fontFamily="Share Tech Mono, monospace" fontSize={10} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── Engagement Area ────────────────────────────────────────────────────────
const EngagementAreaElement = ({ el }) => {
  const headerH = 22;
  return (
    <>
      <Rect x={0} y={0} width={el.w} height={el.h}
        fill={hexToRgba(el.color, 0.15)} stroke={el.color} strokeWidth={2.5} listening={false}
      />
      <Rect x={0} y={0} width={el.w} height={headerH}
        fill={hexToRgba(el.color, 0.88)} listening={false}
      />
      <Text x={0} y={0} width={el.w} height={headerH}
        align="center" verticalAlign="middle"
        text={el.label}
        fill="white" fontFamily="Share Tech Mono, monospace" fontSize={11} fontStyle="bold" listening={false}
      />
    </>
  );
};

// ── Enemy Axis / Avenue of Advance ────────────────────────────────────────
const EnemyAxisElement = ({ el }) => {
  const midY = el.h / 2;
  const isAvenue = el.type === 'enemy_avenue';
  const strokeW = isAvenue ? 3 : 5;
  const ptrL = isAvenue ? 12 : 16;
  const ptrW = isAvenue ? 14 : 20;
  const lines = el.label.split('\n');
  const boxW = Math.min(110, Math.max(80, el.w * 0.5));
  const boxH = lines[1] ? 30 : 20;
  const boxX = el.w / 2 - boxW / 2;
  const boxY = midY - boxH - 4;
  return (
    <>
      <HitRect w={el.w} h={el.h} />
      <Arrow
        points={[0, midY, el.w, midY]}
        stroke={el.color} strokeWidth={strokeW}
        fill={el.color}
        pointerLength={ptrL} pointerWidth={ptrW}
        listening={false}
      />
      <Rect x={boxX} y={boxY} width={boxW} height={boxH}
        fill={hexToRgba(el.color, 0.88)} stroke={el.color} strokeWidth={1.5}
        cornerRadius={2} listening={false}
      />
      <Text x={boxX} y={boxY + 4} width={boxW} align="center"
        text={lines[0] || ''}
        fill="white" fontFamily="Barlow Condensed, sans-serif"
        fontSize={13} fontStyle="bold" listening={false}
      />
      {lines[1] && (
        <Text x={boxX} y={boxY + 17} width={boxW} align="center"
          text={lines[1].toUpperCase()}
          fill="white" fontFamily="Barlow Condensed, sans-serif"
          fontSize={10} listening={false}
        />
      )}
    </>
  );
};

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
  // Terrain
  water: OvalTerrainElement,
  deadground: OvalTerrainElement,
  restrictive: RectTerrainElement,
  severely_restrictive: RectTerrainElement,
  // Linear obstacles
  obstacle: ObstacleElement,
  rail: ObstacleElement,
  obs_wire: WireObstacleElement,
  // Obstacle effects
  obs_fix: ObstacleEffectElement,
  obs_block: ObstacleEffectElement,
  obs_disrupt: ObstacleEffectElement,
  obs_turn: ObstacleTurnElement,
  // Obstacle areas
  obs_minefield: MinefieldElement,
  obs_breach: BreachLaneElement,
  obs_group: ObstacleGroupElement,
  // Tactical
  aa: AAElement,
  mob_corridor: MobCorridorElement,
  keyterrain: KeyTerrainElement,
  objective: ObjectiveElement,
  // AOI
  nai: NAIElement,
  tai: TAIElement,
  decisionpoint: DecisionPointElement,
  // Control measures
  phase_line: PhaseLineElement,
  limit_of_advance: PhaseLineElement,
  battle_position: BattlePositionElement,
  engagement_area: EngagementAreaElement,
  // Threat / SITEMP
  enemy_axis: EnemyAxisElement,
  enemy_avenue: EnemyAxisElement,
  threat_area: OvalTerrainElement,
  // Callouts & labels
  callout: CalloutElement,
  aolabel: AALabelElement,
  // Map elements
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
      {/* Universal hit-target: ensures drag/click registers on all element types,
          including those whose visual children all have listening={false} */}
      <Rect x={0} y={0} width={el.w} height={el.h} fill="transparent" />
      <Renderer el={el} />
    </Group>
  );
});
