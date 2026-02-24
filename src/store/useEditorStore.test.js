import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from './useEditorStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Reset the store AND the module-level nextId counter to a clean slate. */
function resetStore() {
  // loadProjectData reseeds nextId = max(ids) + 1.  With empty elements → nextId = 1.
  useEditorStore.getState().loadProjectData({ elements: [], canvas: { width: 900, height: 560 } });
  useEditorStore.setState({
    selectedId: null,
    past: [],
    future: [],
    zoom: 1,
    gridSize: 0,
    mapDataUrl: null,
    mapFileName: '',
  });
}

/** Add a minimal water element and return its id. */
function addWater(overrides = {}) {
  return useEditorStore.getState().addElement({
    type: 'water',
    label: 'Water',
    color: '#3b6fd4',
    opacity: 0.45,
    w: 160,
    h: 100,
    ...overrides,
  });
}

function getStore() {
  return useEditorStore.getState();
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useEditorStore — initial state', () => {
  beforeEach(resetStore);

  it('starts with an empty element list', () => {
    expect(getStore().elements).toHaveLength(0);
  });

  it('starts with no selection', () => {
    expect(getStore().selectedId).toBeNull();
  });

  it('starts with empty undo/redo stacks', () => {
    expect(getStore().past).toHaveLength(0);
    expect(getStore().future).toHaveLength(0);
  });

  it('starts with default canvas size 900×560', () => {
    const { canvasW, canvasH } = getStore();
    expect(canvasW).toBe(900);
    expect(canvasH).toBe(560);
  });

  it('starts with zoom 1 and gridSize 0', () => {
    expect(getStore().zoom).toBe(1);
    expect(getStore().gridSize).toBe(0);
  });
});

// ─── addElement ───────────────────────────────────────────────────────────────

describe('addElement', () => {
  beforeEach(resetStore);

  it('appends an element and returns its id', () => {
    const id = addWater();
    expect(id).toBeTruthy();
    expect(getStore().elements).toHaveLength(1);
    expect(getStore().elements[0].id).toBe(id);
  });

  it('selects the newly added element', () => {
    const id = addWater();
    expect(getStore().selectedId).toBe(id);
  });

  it('centers the element on the canvas', () => {
    const id = addWater(); // w=160, h=100 on 900×560 canvas
    const el = getStore().elements.find(e => e.id === id);
    expect(el.x).toBe(Math.round((900 - 160) / 2));
    expect(el.y).toBe(Math.round((560 - 100) / 2));
  });

  it('generates unique ids for consecutive elements', () => {
    const id1 = addWater();
    const id2 = addWater();
    expect(id1).not.toBe(id2);
  });

  it('applies defaults (visible, locked, rotation)', () => {
    const id = addWater();
    const el = getStore().elements.find(e => e.id === id);
    expect(el.visible).toBe(true);
    expect(el.locked).toBe(false);
    expect(el.rotation).toBe(0);
  });

  it('pushes undo history on add', () => {
    addWater();
    expect(getStore().past).toHaveLength(1);
  });

  it('clears redo stack on add', () => {
    // prime a redo entry
    addWater();
    getStore().undo();
    expect(getStore().future).toHaveLength(1);

    addWater();
    expect(getStore().future).toHaveLength(0);
  });
});

// ─── updateElement ────────────────────────────────────────────────────────────

describe('updateElement', () => {
  beforeEach(resetStore);

  it('merges updates onto the target element', () => {
    const id = addWater();
    getStore().updateElement(id, { color: '#ff0000', opacity: 0.9 });
    const el = getStore().elements.find(e => e.id === id);
    expect(el.color).toBe('#ff0000');
    expect(el.opacity).toBe(0.9);
  });

  it('does NOT push undo history', () => {
    const id = addWater();
    const histBefore = getStore().past.length;
    getStore().updateElement(id, { color: '#ff0000' });
    expect(getStore().past.length).toBe(histBefore);
  });

  it('does not mutate other elements', () => {
    const id1 = addWater();
    const id2 = addWater({ type: 'obstacle', label: 'Obs', w: 180, h: 30 });
    getStore().updateElement(id1, { color: '#ff0000' });
    const el2 = getStore().elements.find(e => e.id === id2);
    expect(el2.color).not.toBe('#ff0000');
  });
});

// ─── updateElementWithHistory ─────────────────────────────────────────────────

describe('updateElementWithHistory', () => {
  beforeEach(resetStore);

  it('merges updates and pushes undo history', () => {
    const id = addWater();
    const histBefore = getStore().past.length;
    getStore().updateElementWithHistory(id, { label: 'Changed' });
    expect(getStore().elements.find(e => e.id === id).label).toBe('Changed');
    expect(getStore().past.length).toBe(histBefore + 1);
  });
});

// ─── deleteElement ────────────────────────────────────────────────────────────

describe('deleteElement', () => {
  beforeEach(resetStore);

  it('removes the element', () => {
    const id = addWater();
    getStore().deleteElement(id);
    expect(getStore().elements.find(e => e.id === id)).toBeUndefined();
  });

  it('clears selectedId', () => {
    const id = addWater();
    getStore().deleteElement(id);
    expect(getStore().selectedId).toBeNull();
  });

  it('pushes undo history', () => {
    const id = addWater();
    const histBefore = getStore().past.length;
    getStore().deleteElement(id);
    expect(getStore().past.length).toBe(histBefore + 1);
  });

  it('does not affect other elements', () => {
    const id1 = addWater();
    const id2 = addWater();
    getStore().deleteElement(id1);
    expect(getStore().elements.find(e => e.id === id2)).toBeDefined();
  });
});

// ─── selectElement ────────────────────────────────────────────────────────────

describe('selectElement', () => {
  beforeEach(resetStore);

  it('sets selectedId', () => {
    const id = addWater();
    getStore().selectElement(null);
    getStore().selectElement(id);
    expect(getStore().selectedId).toBe(id);
  });

  it('can clear selection with null', () => {
    addWater();
    getStore().selectElement(null);
    expect(getStore().selectedId).toBeNull();
  });
});

// ─── clearAll ─────────────────────────────────────────────────────────────────

describe('clearAll', () => {
  beforeEach(resetStore);

  it('removes all elements', () => {
    addWater();
    addWater();
    getStore().clearAll();
    expect(getStore().elements).toHaveLength(0);
  });

  it('clears selectedId', () => {
    addWater();
    getStore().clearAll();
    expect(getStore().selectedId).toBeNull();
  });

  it('pushes undo history when elements exist', () => {
    addWater();
    const histBefore = getStore().past.length;
    getStore().clearAll();
    expect(getStore().past.length).toBe(histBefore + 1);
  });

  it('is a no-op (no history push) when already empty', () => {
    const histBefore = getStore().past.length;
    getStore().clearAll();
    expect(getStore().past.length).toBe(histBefore);
  });
});

// ─── duplicateElement ─────────────────────────────────────────────────────────

describe('duplicateElement', () => {
  beforeEach(resetStore);

  it('appends a copy with a new id', () => {
    const id = addWater();
    getStore().duplicateElement(id);
    expect(getStore().elements).toHaveLength(2);
    const [orig, copy] = getStore().elements;
    expect(copy.id).not.toBe(orig.id);
  });

  it('offsets the copy by +20px', () => {
    const id = addWater();
    const orig = getStore().elements.find(e => e.id === id);
    getStore().duplicateElement(id);
    const copy = getStore().elements[getStore().elements.length - 1];
    expect(copy.x).toBe(orig.x + 20);
    expect(copy.y).toBe(orig.y + 20);
  });

  it('selects the copy', () => {
    const id = addWater();
    getStore().duplicateElement(id);
    const copy = getStore().elements[getStore().elements.length - 1];
    expect(getStore().selectedId).toBe(copy.id);
  });

  it('is a no-op for unknown id', () => {
    addWater();
    const countBefore = getStore().elements.length;
    getStore().duplicateElement('nonexistent');
    expect(getStore().elements.length).toBe(countBefore);
  });
});

// ─── z-order: bringToFront / sendToBack ───────────────────────────────────────

describe('bringToFront / sendToBack', () => {
  beforeEach(resetStore);

  it('bringToFront moves element to last position', () => {
    const id1 = addWater();
    const id2 = addWater();
    const id3 = addWater();
    getStore().bringToFront(id1);
    const ids = getStore().elements.map(e => e.id);
    expect(ids[ids.length - 1]).toBe(id1);
    // others preserved in order
    expect(ids).toContain(id2);
    expect(ids).toContain(id3);
  });

  it('bringToFront is a no-op when already at front', () => {
    const id1 = addWater();
    const id2 = addWater();
    const before = getStore().elements.map(e => e.id);
    getStore().bringToFront(id2);
    expect(getStore().elements.map(e => e.id)).toEqual(before);
  });

  it('sendToBack moves element to first position', () => {
    const id1 = addWater();
    const id2 = addWater();
    getStore().sendToBack(id2);
    expect(getStore().elements[0].id).toBe(id2);
    expect(getStore().elements[1].id).toBe(id1);
  });

  it('sendToBack is a no-op when already at back', () => {
    const id1 = addWater();
    addWater();
    const before = getStore().elements.map(e => e.id);
    getStore().sendToBack(id1);
    expect(getStore().elements.map(e => e.id)).toEqual(before);
  });
});

// ─── z-order: bringForward / sendBackward ────────────────────────────────────

describe('bringForward / sendBackward', () => {
  beforeEach(resetStore);

  it('bringForward swaps with next element', () => {
    const id1 = addWater();
    const id2 = addWater();
    getStore().bringForward(id1);
    const ids = getStore().elements.map(e => e.id);
    expect(ids[0]).toBe(id2);
    expect(ids[1]).toBe(id1);
  });

  it('bringForward is a no-op when already last', () => {
    addWater();
    const id2 = addWater();
    const before = getStore().elements.map(e => e.id);
    getStore().bringForward(id2);
    expect(getStore().elements.map(e => e.id)).toEqual(before);
  });

  it('sendBackward swaps with previous element', () => {
    const id1 = addWater();
    const id2 = addWater();
    getStore().sendBackward(id2);
    const ids = getStore().elements.map(e => e.id);
    expect(ids[0]).toBe(id2);
    expect(ids[1]).toBe(id1);
  });

  it('sendBackward is a no-op when already first', () => {
    const id1 = addWater();
    addWater();
    const before = getStore().elements.map(e => e.id);
    getStore().sendBackward(id1);
    expect(getStore().elements.map(e => e.id)).toEqual(before);
  });
});

// ─── toggleVisibility / toggleLock ───────────────────────────────────────────

describe('toggleVisibility', () => {
  beforeEach(resetStore);

  it('flips visible to false then back to true', () => {
    const id = addWater();
    getStore().toggleVisibility(id);
    expect(getStore().elements.find(e => e.id === id).visible).toBe(false);
    getStore().toggleVisibility(id);
    expect(getStore().elements.find(e => e.id === id).visible).toBe(true);
  });
});

describe('toggleLock', () => {
  beforeEach(resetStore);

  it('flips locked to true then back to false', () => {
    const id = addWater();
    getStore().toggleLock(id);
    expect(getStore().elements.find(e => e.id === id).locked).toBe(true);
    getStore().toggleLock(id);
    expect(getStore().elements.find(e => e.id === id).locked).toBe(false);
  });
});

// ─── reorderElement ───────────────────────────────────────────────────────────

describe('reorderElement', () => {
  beforeEach(resetStore);

  it('moves an element forward in the array', () => {
    const id1 = addWater();
    const id2 = addWater();
    const id3 = addWater();
    // Move id1 (idx 0) to before id3 (idx 2) → id1 ends up at idx 1
    getStore().reorderElement(id1, id3);
    const ids = getStore().elements.map(e => e.id);
    expect(ids).toEqual([id2, id1, id3]);
  });

  it('moves an element backward in the array', () => {
    const id1 = addWater();
    const id2 = addWater();
    const id3 = addWater();
    // Move id3 (idx 2) to before id1 (idx 0)
    getStore().reorderElement(id3, id1);
    const ids = getStore().elements.map(e => e.id);
    expect(ids).toEqual([id3, id1, id2]);
  });

  it('pushes undo history', () => {
    const id1 = addWater();
    const id2 = addWater();
    const histBefore = getStore().past.length;
    getStore().reorderElement(id1, id2);
    expect(getStore().past.length).toBe(histBefore + 1);
  });

  it('is a no-op when fromId === toId', () => {
    const id = addWater();
    const histBefore = getStore().past.length;
    getStore().reorderElement(id, id);
    expect(getStore().past.length).toBe(histBefore);
  });

  it('is a no-op when id not found', () => {
    const id = addWater();
    const histBefore = getStore().past.length;
    getStore().reorderElement('bad', id);
    expect(getStore().past.length).toBe(histBefore);
  });
});

// ─── Undo / Redo ─────────────────────────────────────────────────────────────

describe('undo', () => {
  beforeEach(resetStore);

  it('restores previous element state', () => {
    addWater();
    addWater();
    getStore().undo();
    expect(getStore().elements).toHaveLength(1);
  });

  it('clears selectedId after undo', () => {
    addWater();
    getStore().undo();
    expect(getStore().selectedId).toBeNull();
  });

  it('is a no-op when history is empty', () => {
    getStore().undo(); // should not throw
    expect(getStore().elements).toHaveLength(0);
  });

  it('pushes to future stack', () => {
    addWater();
    getStore().undo();
    expect(getStore().future).toHaveLength(1);
  });
});

describe('redo', () => {
  beforeEach(resetStore);

  it('restores undone state', () => {
    addWater();
    getStore().undo();
    getStore().redo();
    expect(getStore().elements).toHaveLength(1);
  });

  it('clears selectedId after redo', () => {
    addWater();
    getStore().undo();
    getStore().redo();
    expect(getStore().selectedId).toBeNull();
  });

  it('is a no-op when future is empty', () => {
    addWater();
    getStore().redo(); // should not throw
    expect(getStore().elements).toHaveLength(1);
  });

  it('moves state to past stack', () => {
    addWater();
    const pastLen = getStore().past.length;
    getStore().undo();
    getStore().redo();
    expect(getStore().past.length).toBe(pastLen);
  });
});

describe('undo/redo round-trip', () => {
  beforeEach(resetStore);

  it('preserves element properties through undo→redo cycle', () => {
    const id = addWater();
    getStore().updateElementWithHistory(id, { color: '#abcdef', opacity: 0.7 });
    getStore().undo();
    // After undo the color should be back to original
    expect(getStore().elements.find(e => e.id === id)?.color).not.toBe('#abcdef');
    getStore().redo();
    expect(getStore().elements.find(e => e.id === id)?.color).toBe('#abcdef');
  });
});

// ─── Zoom ─────────────────────────────────────────────────────────────────────

describe('zoom', () => {
  beforeEach(resetStore);

  it('setZoom stores the value', () => {
    getStore().setZoom(2);
    expect(getStore().zoom).toBe(2);
  });

  it('setZoom clamps below 0.25 to 0.25', () => {
    getStore().setZoom(0.1);
    expect(getStore().zoom).toBe(0.25);
  });

  it('setZoom clamps above 8 to 8', () => {
    getStore().setZoom(100);
    expect(getStore().zoom).toBe(8);
  });

  it('resetZoom sets zoom to 1', () => {
    getStore().setZoom(4);
    getStore().resetZoom();
    expect(getStore().zoom).toBe(1);
  });
});

// ─── Grid ─────────────────────────────────────────────────────────────────────

describe('gridSize', () => {
  beforeEach(resetStore);

  it('setGridSize stores the value', () => {
    getStore().setGridSize(20);
    expect(getStore().gridSize).toBe(20);
  });

  it('setGridSize 0 turns grid off', () => {
    getStore().setGridSize(40);
    getStore().setGridSize(0);
    expect(getStore().gridSize).toBe(0);
  });
});

// ─── setMapImage ──────────────────────────────────────────────────────────────

describe('setMapImage', () => {
  beforeEach(resetStore);

  it('updates canvas size and map metadata', () => {
    getStore().setMapImage('data:image/png;base64,abc', 'map.png', 1200, 800);
    const s = getStore();
    expect(s.mapDataUrl).toBe('data:image/png;base64,abc');
    expect(s.mapFileName).toBe('map.png');
    expect(s.canvasW).toBe(1200);
    expect(s.canvasH).toBe(800);
  });

  it('resets zoom to 1', () => {
    getStore().setZoom(3);
    getStore().setMapImage('data:image/png;base64,abc', 'map.png', 1200, 800);
    expect(getStore().zoom).toBe(1);
  });
});

// ─── getProjectData ───────────────────────────────────────────────────────────

describe('getProjectData', () => {
  beforeEach(resetStore);

  it('returns version 1.0', () => {
    expect(getStore().getProjectData().version).toBe('1.0');
  });

  it('includes canvas dimensions', () => {
    const data = getStore().getProjectData();
    expect(data.canvas.width).toBe(900);
    expect(data.canvas.height).toBe(560);
  });

  it('includes a deep copy of elements', () => {
    const id = addWater();
    const data = getStore().getProjectData();
    expect(data.elements).toHaveLength(1);
    expect(data.elements[0].id).toBe(id);
    // Mutating the exported copy must not affect the store
    data.elements[0].color = 'mutated';
    expect(getStore().elements[0].color).not.toBe('mutated');
  });

  it('includes classification metadata', () => {
    const data = getStore().getProjectData();
    expect(data.meta.classification).toBe('UNCLASSIFIED//FOUO');
  });
});

// ─── loadProjectData ──────────────────────────────────────────────────────────

describe('loadProjectData', () => {
  beforeEach(resetStore);

  it('restores elements from project data', () => {
    const projectElements = [
      { id: 'el_0005', type: 'water', label: 'W', x: 100, y: 100, w: 160, h: 100 },
    ];
    getStore().loadProjectData({ elements: projectElements, canvas: { width: 1000, height: 700 } });
    expect(getStore().elements).toHaveLength(1);
    expect(getStore().elements[0].id).toBe('el_0005');
  });

  it('restores canvas dimensions', () => {
    getStore().loadProjectData({ canvas: { width: 1280, height: 720 }, elements: [] });
    expect(getStore().canvasW).toBe(1280);
    expect(getStore().canvasH).toBe(720);
  });

  it('resets undo/redo history', () => {
    addWater(); // creates history
    getStore().loadProjectData({ elements: [], canvas: {} });
    expect(getStore().past).toHaveLength(0);
    expect(getStore().future).toHaveLength(0);
  });

  it('re-seeds id counter so new ids do not collide', () => {
    const existingElements = [{ id: 'el_0010' }, { id: 'el_0007' }];
    getStore().loadProjectData({ elements: existingElements });
    const newId = addWater();
    // nextId should be 11 → 'el_0011'
    expect(newId).toBe('el_0011');
  });

  it('uses default canvas size when canvas data is missing', () => {
    getStore().loadProjectData({ elements: [] });
    expect(getStore().canvasW).toBe(900);
    expect(getStore().canvasH).toBe(560);
  });
});
