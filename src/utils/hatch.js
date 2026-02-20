/**
 * Create a tiled canvas hatch pattern for Konva fillPatternImage.
 * Returns an HTMLCanvasElement for use as fillPatternImage.
 */
const cache = {};

export function getHatchPattern(color, spacing = 10, lineWidthPx = 1.2) {
  const key = `${color}_${spacing}_${lineWidthPx}`;
  if (cache[key]) return cache[key];

  const canvas = document.createElement('canvas');
  canvas.width = spacing;
  canvas.height = spacing;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, spacing, spacing);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidthPx;

  // 45-degree diagonal lines (bottom-left to top-right tiling)
  ctx.beginPath();
  ctx.moveTo(0, spacing);
  ctx.lineTo(spacing, 0);
  ctx.stroke();

  // Edge tiles for seamless repeat
  ctx.beginPath();
  ctx.moveTo(-spacing / 2, spacing / 2);
  ctx.lineTo(spacing / 2, -spacing / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(spacing / 2, spacing + spacing / 2);
  ctx.lineTo(spacing + spacing / 2, spacing / 2);
  ctx.stroke();

  cache[key] = canvas;
  return canvas;
}

export function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
