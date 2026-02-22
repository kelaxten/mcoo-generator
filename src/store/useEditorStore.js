import { create } from 'zustand';

let nextId = 1;
const genId = () => `el_${String(nextId++).padStart(4, '0')}`;

const MAX_HISTORY = 50;

function snapshot(elements) {
  return JSON.parse(JSON.stringify(elements));
}

export const useEditorStore = create((set, get) => ({
  // Canvas state
  canvasW: 900,
  canvasH: 560,
  mapDataUrl: null,
  mapFileName: '',

  // Elements
  elements: [],
  selectedId: null,

  // Undo/redo
  past: [],
  future: [],

  // ── Canvas / Map ──────────────────────────────────────────────────────────
  setMapImage: (dataUrl, fileName, w, h) => set({
    mapDataUrl: dataUrl,
    mapFileName: fileName,
    canvasW: w,
    canvasH: h,
  }),

  setCanvasSize: (w, h) => set({ canvasW: w, canvasH: h }),

  // ── Elements ──────────────────────────────────────────────────────────────
  addElement: (defaults) => {
    const { elements, canvasW, canvasH } = get();
    const el = {
      id: genId(),
      visible: true,
      rotation: 0,
      locked: false,
      body: '',
      ...defaults,
      x: Math.round(canvasW / 2 - defaults.w / 2),
      y: Math.round(canvasH / 2 - defaults.h / 2),
    };
    const updated = [...elements, el];
    get()._pushHistory(elements);
    set({ elements: updated, selectedId: el.id });
    return el.id;
  },

  updateElement: (id, updates) => {
    const { elements } = get();
    set({ elements: elements.map(el => el.id === id ? { ...el, ...updates } : el) });
  },

  updateElementWithHistory: (id, updates) => {
    const { elements } = get();
    get()._pushHistory(elements);
    set({ elements: elements.map(el => el.id === id ? { ...el, ...updates } : el) });
  },

  deleteElement: (id) => {
    const { elements } = get();
    get()._pushHistory(elements);
    set({ elements: elements.filter(el => el.id !== id), selectedId: null });
  },

  selectElement: (id) => set({ selectedId: id }),

  clearAll: () => {
    const { elements } = get();
    if (elements.length === 0) return;
    get()._pushHistory(elements);
    set({ elements: [], selectedId: null });
  },

  duplicateElement: (id) => {
    const { elements } = get();
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const copy = { ...el, id: genId(), x: el.x + 20, y: el.y + 20 };
    get()._pushHistory(elements);
    set({ elements: [...elements, copy], selectedId: copy.id });
  },

  bringToFront: (id) => {
    const { elements } = get();
    const el = elements.find(e => e.id === id);
    if (!el) return;
    set({ elements: [...elements.filter(e => e.id !== id), el] });
  },

  sendToBack: (id) => {
    const { elements } = get();
    const el = elements.find(e => e.id === id);
    if (!el) return;
    set({ elements: [el, ...elements.filter(e => e.id !== id)] });
  },

  bringForward: (id) => {
    const { elements } = get();
    const idx = elements.findIndex(e => e.id === id);
    if (idx < 0 || idx === elements.length - 1) return;
    const arr = [...elements];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    set({ elements: arr });
  },

  sendBackward: (id) => {
    const { elements } = get();
    const idx = elements.findIndex(e => e.id === id);
    if (idx <= 0) return;
    const arr = [...elements];
    [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]];
    set({ elements: arr });
  },

  toggleVisibility: (id) => {
    const { elements } = get();
    set({ elements: elements.map(el => el.id === id ? { ...el, visible: !el.visible } : el) });
  },

  // ── History ───────────────────────────────────────────────────────────────
  _pushHistory: (elementsSnapshot) => {
    const { past } = get();
    const newPast = [...past, snapshot(elementsSnapshot)];
    if (newPast.length > MAX_HISTORY) newPast.shift();
    set({ past: newPast, future: [] });
  },

  undo: () => {
    const { past, elements, future } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      future: [snapshot(elements), ...future].slice(0, MAX_HISTORY),
      elements: prev,
      selectedId: null,
    });
  },

  redo: () => {
    const { past, elements, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      past: [...past, snapshot(elements)].slice(-MAX_HISTORY),
      future: future.slice(1),
      elements: next,
      selectedId: null,
    });
  },

  // ── Project save/load ─────────────────────────────────────────────────────
  getProjectData: () => {
    const { elements, canvasW, canvasH, mapFileName } = get();
    return {
      version: '1.0',
      meta: {
        title: 'MCOO Project',
        created: new Date().toISOString(),
        classification: 'UNCLASSIFIED//FOUO',
      },
      canvas: { width: canvasW, height: canvasH, mapFileName },
      elements: snapshot(elements),
    };
  },

  loadProjectData: (data) => {
    const { canvas = {}, elements = [] } = data;
    // Re-seed nextId so new elements don't collide
    const maxNum = elements.reduce((m, el) => {
      const n = parseInt((el.id || '').replace('el_', ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    nextId = maxNum + 1;
    set({
      elements,
      selectedId: null,
      past: [],
      future: [],
      canvasW: canvas.width || 900,
      canvasH: canvas.height || 560,
    });
  },
}));
