import jsPDF from 'jspdf';
import { useEditorStore } from '../store/useEditorStore';

const PIXEL_RATIO = 2;
const WATERMARK = 'TacDraw · github.com/kelaxten/mcoo-generator';

function withFullScale(stage, fn) {
  const { canvasW, canvasH } = useEditorStore.getState();
  const prevScaleX = stage.scaleX();
  const prevW = stage.width();
  const prevH = stage.height();
  const prevX = stage.x();
  const prevY = stage.y();
  stage.scaleX(1); stage.scaleY(1);
  stage.width(canvasW); stage.height(canvasH);
  stage.x(0); stage.y(0);
  const result = fn();
  stage.scaleX(prevScaleX); stage.scaleY(prevScaleX);
  stage.width(prevW); stage.height(prevH);
  stage.x(prevX); stage.y(prevY);
  return result;
}

function compositeWatermark(sourceDataUrl, canvasW, canvasH, outputMime) {
  return new Promise((resolve) => {
    const pw = canvasW * PIXEL_RATIO;
    const ph = canvasH * PIXEL_RATIO;
    const canvas = document.createElement('canvas');
    canvas.width = pw;
    canvas.height = ph;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      const fontSize = Math.max(11, Math.round(Math.min(pw, ph) * 0.012));
      ctx.font = `${fontSize}px "Share Tech Mono", "Courier New", monospace`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      const textW = ctx.measureText(WATERMARK).width;
      const padX = 10;
      const padY = 6;

      // Dark pill background for legibility
      ctx.globalAlpha = 0.42;
      ctx.fillStyle = '#000000';
      ctx.fillRect(
        pw - textW - padX * 2.5,
        ph - fontSize - padY * 2.5,
        textW + padX * 2,
        fontSize + padY * 2,
      );

      // Amber watermark text
      ctx.globalAlpha = 0.58;
      ctx.fillStyle = '#d98b2a';
      ctx.fillText(WATERMARK, pw - padX, ph - padY);

      const quality = outputMime === 'image/png' ? undefined : 0.95;
      resolve(canvas.toDataURL(outputMime, quality));
    };
    img.src = sourceDataUrl;
  });
}

export async function exportToJPG(stageRef, filename = 'MCOO_export.jpg') {
  const stage = stageRef.current;
  const { canvasW, canvasH } = useEditorStore.getState();
  const source = withFullScale(stage, () =>
    stage.toDataURL({ mimeType: 'image/jpeg', quality: 0.95, pixelRatio: PIXEL_RATIO })
  );
  const dataUrl = await compositeWatermark(source, canvasW, canvasH, 'image/jpeg');
  const a = document.createElement('a');
  a.download = filename;
  a.href = dataUrl;
  a.click();
}

export async function exportToPNG(stageRef, filename = 'MCOO_export.png') {
  const stage = stageRef.current;
  const { canvasW, canvasH } = useEditorStore.getState();
  const source = withFullScale(stage, () =>
    stage.toDataURL({ mimeType: 'image/png', pixelRatio: PIXEL_RATIO })
  );
  const dataUrl = await compositeWatermark(source, canvasW, canvasH, 'image/png');
  const a = document.createElement('a');
  a.download = filename;
  a.href = dataUrl;
  a.click();
}

export async function exportToPDF(stageRef, filename = 'MCOO_export.pdf') {
  const stage = stageRef.current;
  const { canvasW, canvasH } = useEditorStore.getState();
  const source = withFullScale(stage, () =>
    stage.toDataURL({ mimeType: 'image/jpeg', quality: 0.95, pixelRatio: PIXEL_RATIO })
  );
  const dataUrl = await compositeWatermark(source, canvasW, canvasH, 'image/jpeg');
  const orientation = canvasW >= canvasH ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ orientation, unit: 'px', format: [canvasW, canvasH] });
  pdf.addImage(dataUrl, 'JPEG', 0, 0, canvasW, canvasH);
  pdf.save(filename);
}

export function saveProject(data, filename = 'mcoo-project.mcoo') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = filename;
  a.href = url;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function loadProjectFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mcoo,application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          resolve(JSON.parse(ev.target.result));
        } catch (err) {
          reject(new Error('Invalid .mcoo file'));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}
