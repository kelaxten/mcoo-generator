/**
 * MCOO Element Registry
 * Each entry defines the category, toolbar label, default properties,
 * and toolbar icon SVG for one draggable element type.
 */

export const ELEMENT_REGISTRY = {
  // ── Terrain overlays ──────────────────────────────────────────────────────
  water: {
    label: 'Water / Unfordable',
    category: 'terrain',
    iconColor: '#3b6fd4',
    defaults: {
      type: 'water',
      label: 'Water / Unfordable',
      color: '#3b6fd4',
      opacity: 0.45,
      w: 160, h: 100,
    },
  },
  restrictive: {
    label: 'Restrictive Terrain',
    category: 'terrain',
    iconColor: '#2e8b4a',
    defaults: {
      type: 'restrictive',
      label: 'Restrictive Terrain',
      color: '#2e8b4a',
      opacity: 0.40,
      w: 170, h: 110,
    },
  },
  severely_restrictive: {
    label: 'Severely Restrictive',
    category: 'terrain',
    iconColor: '#d97706',
    defaults: {
      type: 'severely_restrictive',
      label: 'Severely Restrictive',
      color: '#d97706',
      opacity: 0.40,
      w: 160, h: 100,
    },
  },
  deadground: {
    label: 'Dead Ground / Defilade',
    category: 'terrain',
    iconColor: '#b48c3c',
    defaults: {
      type: 'deadground',
      label: 'Dead Ground',
      color: '#b48c3c',
      opacity: 0.40,
      w: 150, h: 90,
    },
  },

  // ── Obstacles ─────────────────────────────────────────────────────────────
  obstacle: {
    label: 'Obstacle Line',
    category: 'obstacles',
    iconColor: '#d63030',
    defaults: {
      type: 'obstacle',
      label: 'Obstacle Line',
      color: '#d63030',
      opacity: 1.0,
      w: 180, h: 30,
    },
  },
  rail: {
    label: 'Elevated Rail',
    category: 'obstacles',
    iconColor: '#7c3aed',
    defaults: {
      type: 'rail',
      label: 'Elevated Rail',
      color: '#7c3aed',
      opacity: 1.0,
      w: 180, h: 30,
    },
  },

  // ── Tactical ──────────────────────────────────────────────────────────────
  aa: {
    label: 'Avenue of Approach',
    category: 'tactical',
    iconColor: '#d63030',
    defaults: {
      type: 'aa',
      label: 'AA1\nMAIN STREET',
      color: '#d63030',
      opacity: 1.0,
      w: 200, h: 44,
    },
  },
  keyterrain: {
    label: 'Key Terrain',
    category: 'tactical',
    iconColor: '#7c3aed',
    defaults: {
      type: 'keyterrain',
      label: 'K1',
      color: '#7c3aed',
      opacity: 1.0,
      w: 48, h: 48,
    },
  },
  objective: {
    label: 'Objective',
    category: 'tactical',
    iconColor: '#e8c84a',
    defaults: {
      type: 'objective',
      label: 'OBJ CASTLE',
      color: '#e8c84a',
      opacity: 1.0,
      w: 140, h: 40,
    },
  },

  // ── Callouts & labels ─────────────────────────────────────────────────────
  callout: {
    label: 'Analyst Callout',
    category: 'callouts',
    iconColor: '#e8c84a',
    defaults: {
      type: 'callout',
      label: 'CALLOUT TITLE',
      body: '• Key point 1\n• Key point 2\n• Key point 3',
      color: '#8c6a00',
      opacity: 1.0,
      w: 230, h: 130,
    },
  },
  aolabel: {
    label: 'AA Label Box',
    category: 'callouts',
    iconColor: '#d63030',
    defaults: {
      type: 'aolabel',
      label: 'AA1\nFRONTIER',
      color: '#d63030',
      opacity: 1.0,
      w: 110, h: 46,
    },
  },

  // ── Map elements ──────────────────────────────────────────────────────────
  legend: {
    label: 'Legend Block',
    category: 'map',
    iconColor: '#2a3a52',
    defaults: {
      type: 'legend',
      label: 'LEGEND',
      color: '#14284a',
      opacity: 1.0,
      w: 250, h: 210,
    },
  },
  titleblock: {
    label: 'Title Block',
    category: 'map',
    iconColor: '#14284a',
    defaults: {
      type: 'titleblock',
      label: 'MAGIC KINGDOM AO\nG2 TERRAIN TEAM\nDTG: 190900ZFEB26',
      color: '#14284a',
      opacity: 1.0,
      w: 210, h: 170,
    },
  },
  aoboundary: {
    label: 'AO Boundary',
    category: 'map',
    iconColor: '#d63030',
    defaults: {
      type: 'aoboundary',
      label: 'AO Boundary',
      color: '#d63030',
      opacity: 1.0,
      w: 420, h: 300,
    },
  },
  header: {
    label: 'Header Bar',
    category: 'map',
    iconColor: '#14284a',
    defaults: {
      type: 'header',
      label: 'MCOO',
      color: '#14284a',
      opacity: 1.0,
      w: 900, h: 36,
    },
    spawnAtTop: true,
  },
  footer: {
    label: 'FOUO Footer',
    category: 'map',
    iconColor: '#14284a',
    defaults: {
      type: 'footer',
      label: 'UNCLASSIFIED // FOR OFFICIAL USE ONLY',
      color: '#14284a',
      opacity: 1.0,
      w: 900, h: 24,
    },
    spawnAtBottom: true,
  },
};

// Ordered toolbar sections
export const TOOLBAR_SECTIONS = [
  {
    title: 'Terrain Overlays',
    types: ['water', 'restrictive', 'severely_restrictive', 'deadground'],
  },
  {
    title: 'Obstacles',
    types: ['obstacle', 'rail'],
  },
  {
    title: 'Tactical',
    types: ['aa', 'keyterrain', 'objective'],
  },
  {
    title: 'Callouts & Labels',
    types: ['callout', 'aolabel'],
  },
  {
    title: 'Map Elements',
    types: ['legend', 'titleblock', 'aoboundary', 'header', 'footer'],
  },
];
