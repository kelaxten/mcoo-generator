/**
 * MCOO Element Registry — ATP 2-01.3 compliant
 * Each entry defines category, toolbar label, default properties, and icon color.
 */

export const ELEMENT_REGISTRY = {
  // ── Terrain overlays ──────────────────────────────────────────────────────
  water: {
    label: 'Water / Unfordable',
    category: 'terrain',
    iconColor: '#3b6fd4',
    defaults: { type: 'water', label: 'Water / Unfordable', color: '#3b6fd4', opacity: 0.45, w: 160, h: 100 },
  },
  restrictive: {
    label: 'Restrictive Terrain',
    category: 'terrain',
    iconColor: '#2e8b4a',
    defaults: { type: 'restrictive', label: 'Restrictive Terrain', color: '#2e8b4a', opacity: 0.40, w: 170, h: 110 },
  },
  severely_restrictive: {
    label: 'Severely Restrictive',
    category: 'terrain',
    iconColor: '#d97706',
    defaults: { type: 'severely_restrictive', label: 'Severely Restrictive', color: '#d97706', opacity: 0.40, w: 160, h: 100 },
  },
  deadground: {
    label: 'Dead Ground / Defilade',
    category: 'terrain',
    iconColor: '#b48c3c',
    defaults: { type: 'deadground', label: 'Dead Ground', color: '#b48c3c', opacity: 0.40, w: 150, h: 90 },
  },

  // ── Linear obstacles ──────────────────────────────────────────────────────
  obstacle: {
    label: 'Linear Obstacle',
    category: 'obstacles',
    iconColor: '#d63030',
    defaults: { type: 'obstacle', label: 'Obstacle Line', color: '#d63030', opacity: 1.0, w: 180, h: 30 },
  },
  rail: {
    label: 'Elevated Rail',
    category: 'obstacles',
    iconColor: '#7c3aed',
    defaults: { type: 'rail', label: 'Elevated Rail', color: '#7c3aed', opacity: 1.0, w: 180, h: 30 },
  },
  obs_wire: {
    label: 'Wire / Concertina',
    category: 'obstacles',
    iconColor: '#d63030',
    defaults: { type: 'obs_wire', label: 'Wire', color: '#d63030', opacity: 1.0, w: 180, h: 34 },
  },

  // ── Obstacle effects ──────────────────────────────────────────────────────
  obs_fix: {
    label: 'Fix',
    category: 'obstacle_effects',
    iconColor: '#d63030',
    defaults: { type: 'obs_fix', label: 'FIX', color: '#d63030', opacity: 1.0, w: 200, h: 50 },
  },
  obs_block: {
    label: 'Block',
    category: 'obstacle_effects',
    iconColor: '#d63030',
    defaults: { type: 'obs_block', label: 'BLK', color: '#d63030', opacity: 1.0, w: 200, h: 50 },
  },
  obs_disrupt: {
    label: 'Disrupt',
    category: 'obstacle_effects',
    iconColor: '#d97706',
    defaults: { type: 'obs_disrupt', label: 'DSPT', color: '#d97706', opacity: 1.0, w: 200, h: 50 },
  },
  obs_turn: {
    label: 'Turn',
    category: 'obstacle_effects',
    iconColor: '#d63030',
    defaults: { type: 'obs_turn', label: 'TURN', color: '#d63030', opacity: 1.0, w: 200, h: 60 },
  },

  // ── Obstacle areas ────────────────────────────────────────────────────────
  obs_minefield: {
    label: 'Minefield Area',
    category: 'obstacle_areas',
    iconColor: '#d63030',
    defaults: { type: 'obs_minefield', label: 'MINEFIELD', color: '#d63030', opacity: 0.9, w: 190, h: 120 },
  },
  obs_breach: {
    label: 'Breach Lane',
    category: 'obstacle_areas',
    iconColor: '#2e8b4a',
    defaults: { type: 'obs_breach', label: 'BREACH', color: '#2e8b4a', opacity: 1.0, w: 150, h: 40 },
  },
  obs_group: {
    label: 'Obstacle Group',
    category: 'obstacle_areas',
    iconColor: '#d63030',
    defaults: { type: 'obs_group', label: 'OG 1', color: '#d63030', opacity: 1.0, w: 64, h: 64 },
  },

  // ── Tactical ──────────────────────────────────────────────────────────────
  aa: {
    label: 'Avenue of Approach',
    category: 'tactical',
    iconColor: '#d63030',
    defaults: { type: 'aa', label: 'AA1\nMAIN STREET', color: '#d63030', opacity: 1.0, w: 200, h: 44 },
  },
  mob_corridor: {
    label: 'Mobility Corridor',
    category: 'tactical',
    iconColor: '#1a6e3c',
    defaults: { type: 'mob_corridor', label: 'MC1\nNORTH ROUTE', color: '#1a6e3c', opacity: 0.80, w: 220, h: 60 },
  },
  keyterrain: {
    label: 'Key Terrain',
    category: 'tactical',
    iconColor: '#7c3aed',
    defaults: { type: 'keyterrain', label: 'K1', color: '#7c3aed', opacity: 1.0, w: 48, h: 48 },
  },
  objective: {
    label: 'Objective',
    category: 'tactical',
    iconColor: '#e8c84a',
    defaults: { type: 'objective', label: 'OBJ CASTLE', color: '#e8c84a', opacity: 1.0, w: 140, h: 40 },
  },

  // ── Areas of interest ─────────────────────────────────────────────────────
  nai: {
    label: 'NAI (Named Area of Interest)',
    category: 'aoi',
    iconColor: '#14284a',
    defaults: { type: 'nai', label: 'NAI 1', color: '#14284a', opacity: 1.0, w: 160, h: 90 },
  },
  tai: {
    label: 'TAI (Target Area of Interest)',
    category: 'aoi',
    iconColor: '#e8c84a',
    defaults: { type: 'tai', label: 'TAI 1', color: '#e8c84a', opacity: 1.0, w: 160, h: 90 },
  },
  decisionpoint: {
    label: 'Decision Point (DP)',
    category: 'aoi',
    iconColor: '#e8c84a',
    defaults: { type: 'decisionpoint', label: 'DP 1', color: '#e8c84a', opacity: 1.0, w: 64, h: 64 },
  },

  // ── Control measures ──────────────────────────────────────────────────────
  phase_line: {
    label: 'Phase Line (PL)',
    category: 'control',
    iconColor: '#3b6fd4',
    defaults: { type: 'phase_line', label: 'PL BLUE', color: '#3b6fd4', opacity: 1.0, w: 240, h: 36 },
  },
  limit_of_advance: {
    label: 'Limit of Advance (LOA)',
    category: 'control',
    iconColor: '#d63030',
    defaults: { type: 'limit_of_advance', label: 'LOA', color: '#d63030', opacity: 1.0, w: 240, h: 36 },
  },
  battle_position: {
    label: 'Battle Position (BP)',
    category: 'control',
    iconColor: '#1a3a6e',
    defaults: { type: 'battle_position', label: 'BP 1', color: '#1a3a6e', opacity: 0.85, w: 170, h: 110 },
  },
  engagement_area: {
    label: 'Engagement Area (EA)',
    category: 'control',
    iconColor: '#c04010',
    defaults: { type: 'engagement_area', label: 'EA DESIGNATION', color: '#c04010', opacity: 0.85, w: 210, h: 130 },
  },

  // ── Threat / SITEMP ───────────────────────────────────────────────────────
  enemy_axis: {
    label: 'Enemy Axis of Advance',
    category: 'threat',
    iconColor: '#cc0000',
    defaults: { type: 'enemy_axis', label: 'EA1\nENEMY MAIN', color: '#cc0000', opacity: 1.0, w: 210, h: 54 },
  },
  enemy_avenue: {
    label: 'Enemy Avenue (Templated)',
    category: 'threat',
    iconColor: '#cc0000',
    defaults: { type: 'enemy_avenue', label: 'EAVN1', color: '#cc0000', opacity: 0.85, w: 200, h: 44 },
  },
  threat_area: {
    label: 'Threat / Enemy Area',
    category: 'threat',
    iconColor: '#cc0000',
    defaults: { type: 'threat_area', label: 'THREAT', color: '#cc0000', opacity: 0.50, w: 170, h: 110 },
  },

  // ── Callouts & labels ─────────────────────────────────────────────────────
  callout: {
    label: 'Analyst Callout',
    category: 'callouts',
    iconColor: '#e8c84a',
    defaults: { type: 'callout', label: 'CALLOUT TITLE', body: '• Key point 1\n• Key point 2\n• Key point 3', color: '#8c6a00', opacity: 1.0, w: 230, h: 130 },
  },
  aolabel: {
    label: 'AA Label Box',
    category: 'callouts',
    iconColor: '#d63030',
    defaults: { type: 'aolabel', label: 'AA1\nFRONTIER', color: '#d63030', opacity: 1.0, w: 110, h: 46 },
  },

  // ── Map elements ──────────────────────────────────────────────────────────
  legend: {
    label: 'Legend Block',
    category: 'map',
    iconColor: '#2a3a52',
    defaults: { type: 'legend', label: 'LEGEND', color: '#14284a', opacity: 1.0, w: 250, h: 210 },
  },
  titleblock: {
    label: 'Title Block',
    category: 'map',
    iconColor: '#14284a',
    defaults: { type: 'titleblock', label: 'MAGIC KINGDOM AO\nG2 TERRAIN TEAM\nDTG: 190900ZFEB26', color: '#14284a', opacity: 1.0, w: 210, h: 170 },
  },
  aoboundary: {
    label: 'AO Boundary',
    category: 'map',
    iconColor: '#d63030',
    defaults: { type: 'aoboundary', label: 'AO Boundary', color: '#d63030', opacity: 1.0, w: 420, h: 300 },
  },
  header: {
    label: 'Header Bar',
    category: 'map',
    iconColor: '#14284a',
    defaults: { type: 'header', label: 'MCOO', color: '#14284a', opacity: 1.0, w: 900, h: 36 },
    spawnAtTop: true,
  },
  footer: {
    label: 'FOUO Footer',
    category: 'map',
    iconColor: '#14284a',
    defaults: { type: 'footer', label: 'UNCLASSIFIED // FOR OFFICIAL USE ONLY', color: '#14284a', opacity: 1.0, w: 900, h: 24 },
    spawnAtBottom: true,
  },
};

// ── Toolbar sections with expand/collapse defaults ────────────────────────
export const TOOLBAR_SECTIONS = [
  {
    title: 'Terrain Overlays',
    types: ['water', 'restrictive', 'severely_restrictive', 'deadground'],
    defaultCollapsed: false,
  },
  {
    title: 'Linear Obstacles',
    types: ['obstacle', 'rail', 'obs_wire'],
    defaultCollapsed: false,
  },
  {
    title: 'Obstacle Effects',
    types: ['obs_fix', 'obs_block', 'obs_disrupt', 'obs_turn'],
    defaultCollapsed: false,
  },
  {
    title: 'Obstacle Areas',
    types: ['obs_minefield', 'obs_breach', 'obs_group'],
    defaultCollapsed: true,
  },
  {
    title: 'Tactical',
    types: ['aa', 'mob_corridor', 'keyterrain', 'objective'],
    defaultCollapsed: false,
  },
  {
    title: 'Areas of Interest',
    types: ['nai', 'tai', 'decisionpoint'],
    defaultCollapsed: false,
  },
  {
    title: 'Control Measures',
    types: ['phase_line', 'limit_of_advance', 'battle_position', 'engagement_area'],
    defaultCollapsed: true,
  },
  {
    title: 'Threat / SITEMP',
    types: ['enemy_axis', 'enemy_avenue', 'threat_area'],
    defaultCollapsed: true,
  },
  {
    title: 'Callouts & Labels',
    types: ['callout', 'aolabel'],
    defaultCollapsed: false,
  },
  {
    title: 'Map Elements',
    types: ['legend', 'titleblock', 'aoboundary', 'header', 'footer'],
    defaultCollapsed: true,
  },
];
