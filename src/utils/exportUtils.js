import jsPDF from 'jspdf';

export function exportToJPG(stageRef, filename = 'MCOO_export.jpg') {
  const dataUrl = stageRef.current.toDataURL({ mimeType: 'image/jpeg', quality: 0.95, pixelRatio: 2 });
  const a = document.createElement('a');
  a.download = filename;
  a.href = dataUrl;
  a.click();
}

export function exportToPNG(stageRef, filename = 'MCOO_export.png') {
  const dataUrl = stageRef.current.toDataURL({ mimeType: 'image/png', pixelRatio: 2 });
  const a = document.createElement('a');
  a.download = filename;
  a.href = dataUrl;
  a.click();
}

export function exportToPDF(stageRef, canvasW, canvasH, filename = 'MCOO_export.pdf') {
  const dataUrl = stageRef.current.toDataURL({ mimeType: 'image/jpeg', quality: 0.95, pixelRatio: 2 });

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
