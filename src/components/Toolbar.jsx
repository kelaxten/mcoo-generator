import { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { ELEMENT_REGISTRY, TOOLBAR_SECTIONS } from '../elements/index';

// Mini SVG icons per element type
const ICONS = {
  // ── Terrain ────────────────────────────────────────────────────────────
  water: (
    <svg width="28" height="18" viewBox="0 0 28 18">
      <ellipse cx="14" cy="9" rx="12" ry="7" fill="rgba(59,111,212,0.35)" stroke="#3b6fd4" strokeWidth="1.5"/>
      <path d="M5 12 Q14 4 23 12" stroke="#3b6fd4" fill="none" strokeWidth="1.5"/>
    </svg>
  ),
  restrictive: (
    <svg width="28" height="18" viewBox="0 0 28 18">
      <rect x="2" y="2" width="24" height="14" fill="rgba(46,139,74,0.35)" stroke="#2e8b4a" strokeWidth="1.5"/>
      <line x1="4" y1="4" x2="10" y2="14" stroke="#2e8b4a" strokeWidth="1.2"/>
      <line x1="10" y1="4" x2="16" y2="14" stroke="#2e8b4a" strokeWidth="1.2"/>
      <line x1="16" y1="4" x2="22" y2="14" stroke="#2e8b4a" strokeWidth="1.2"/>
    </svg>
  ),
  severely_restrictive: (
    <svg width="28" height="18" viewBox="0 0 28 18">
      <rect x="2" y="2" width="24" height="14" fill="rgba(217,119,6,0.35)" stroke="#d97706" strokeWidth="1.5"/>
      <line x1="4" y1="4" x2="10" y2="14" stroke="#d97706" strokeWidth="1.2"/>
      <line x1="10" y1="4" x2="16" y2="14" stroke="#d97706" strokeWidth="1.2"/>
      <line x1="16" y1="4" x2="22" y2="14" stroke="#d97706" strokeWidth="1.2"/>
    </svg>
  ),
  deadground: (
    <svg width="28" height="18" viewBox="0 0 28 18">
      <ellipse cx="14" cy="9" rx="12" ry="7" fill="rgba(180,140,60,0.35)" stroke="#b48c3c" strokeWidth="1.5"/>
      <line x1="7" y1="4" x2="12" y2="14" stroke="#b48c3c" strokeWidth="1.2"/>
      <line x1="12" y1="4" x2="17" y2="14" stroke="#b48c3c" strokeWidth="1.2"/>
      <line x1="17" y1="4" x2="22" y2="14" stroke="#b48c3c" strokeWidth="1.2"/>
    </svg>
  ),

  // ── Linear obstacles ───────────────────────────────────────────────────
  obstacle: (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <line x1="0" y1="8" x2="28" y2="8" stroke="#d63030" strokeWidth="3"/>
      <line x1="7" y1="2" x2="7" y2="14" stroke="#d63030" strokeWidth="1.5"/>
      <line x1="14" y1="2" x2="14" y2="14" stroke="#d63030" strokeWidth="1.5"/>
      <line x1="21" y1="2" x2="21" y2="14" stroke="#d63030" strokeWidth="1.5"/>
    </svg>
  ),
  rail: (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <line x1="0" y1="8" x2="28" y2="8" stroke="#7c3aed" strokeWidth="2.5"/>
      <line x1="7" y1="2" x2="7" y2="14" stroke="#7c3aed" strokeWidth="1.5"/>
      <line x1="14" y1="2" x2="14" y2="14" stroke="#7c3aed" strokeWidth="1.5"/>
      <line x1="21" y1="2" x2="21" y2="14" stroke="#7c3aed" strokeWidth="1.5"/>
    </svg>
  ),
  obs_wire: (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <line x1="0" y1="11" x2="28" y2="11" stroke="#d63030" strokeWidth="2"/>
      <circle cx="7"  cy="7" r="3.5" stroke="#d63030" strokeWidth="1.5" fill="none"/>
      <circle cx="14" cy="7" r="3.5" stroke="#d63030" strokeWidth="1.5" fill="none"/>
      <circle cx="21" cy="7" r="3.5" stroke="#d63030" strokeWidth="1.5" fill="none"/>
    </svg>
  ),

  // ── Obstacle effects ───────────────────────────────────────────────────
  obs_fix: (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <rect x="1" y="1" width="26" height="14" fill="rgba(214,48,48,0.12)" stroke="#d63030" strokeWidth="1.5"/>
      <text x="14" y="11" textAnchor="middle" fill="#d63030" fontSize="8" fontWeight="bold" fontFamily="monospace">FIX</text>
    </svg>
  ),
  obs_block: (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <rect x="1" y="1" width="26" height="14" fill="rgba(214,48,48,0.12)" stroke="#d63030" strokeWidth="1.5"/>
      <text x="14" y="11" textAnchor="middle" fill="#d63030" fontSize="8" fontWeight="bold" fontFamily="monospace">BLK</text>
    </svg>
  ),
  obs_disrupt: (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <rect x="1" y="1" width="26" height="14" fill="rgba(217,119,6,0.12)" stroke="#d97706" strokeWidth="1.5"/>
      <text x="14" y="11" textAnchor="middle" fill="#d97706" fontSize="6.5" fontWeight="bold" fontFamily="monospace">DSPT</text>
    </svg>
  ),
  obs_turn: (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <rect x="1" y="1" width="26" height="14" fill="rgba(214,48,48,0.12)" stroke="#d63030" strokeWidth="1.5"/>
      <text x="14" y="11" textAnchor="middle" fill="#d63030" fontSize="7" fontWeight="bold" fontFamily="monospace">TURN</text>
    </svg>
  ),

  // ── Obstacle areas ─────────────────────────────────────────────────────
  obs_minefield: (
    <svg width="28" height="18" viewBox="0 0 28 18">
      <rect x="1" y="1" width="26" height="16" fill="rgba(214,48,48,0.07)" stroke="#d63030" strokeWidth="1.5" strokeDasharray="4,2"/>
      <line x1="7"  y1="6"  x2="11" y2="12" stroke="#d63030" strokeWidth="1.3"/>
      <line x1="11" y1="6"  x2="7"  y2="12" stroke="#d63030" strokeWidth="1.3"/>
      <line x1="17" y1="6"  x2="21" y2="12" stroke="#d63030" strokeWidth="1.3"/>
      <line x1="21" y1="6"  x2="17" y2="12" stroke="#d63030" strokeWidth="1.3"/>
    </svg>
  ),
  obs_breach: (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <rect x="1" y="2" width="26" height="12" fill="rgba(46,139,74,0.15)" stroke="#2e8b4a" strokeWidth="1.5"/>
      <line x1="4" y1="8" x2="20" y2="8" stroke="#2e8b4a" strokeWidth="1.5"/>
      <polygon points="20,5 27,8 20,11" fill="#2e8b4a"/>
    </svg>
  ),
  obs_group: (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="rgba(214,48,48,0.12)" stroke="#d63030" strokeWidth="1.5"/>
      <text x="10" y="14" textAnchor="middle" fill="#d63030" fontSize="7" fontWeight="bold" fontFamily="monospace">OG</text>
    </svg>
  ),

  // ── Tactical ───────────────────────────────────────────────────────────
  aa: (
    <svg width="28" height="14" viewBox="0 0 28 14">
      <line x1="0" y1="7" x2="22" y2="7" stroke="#d63030" strokeWidth="4"/>
      <polygon points="22,2 28,7 22,12" fill="#d63030"/>
    </svg>
  ),
  mob_corridor: (
    <svg width="28" height="20" viewBox="0 0 28 20">
      <rect x="1" y="2" width="26" height="16" fill="rgba(26,110,60,0.12)" stroke="#1a6e3c" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="4" y1="10" x2="24" y2="10" stroke="#1a6e3c" strokeWidth="1.5"/>
      <polygon points="24,7 28,10 24,13" fill="#1a6e3c"/>
      <polygon points="4,7 0,10 4,13" fill="#1a6e3c"/>
    </svg>
  ),
  keyterrain: (
    <svg width="24" height="20" viewBox="0 0 24 20">
      <circle cx="12" cy="10" r="9" fill="#7c3aed" stroke="#500090" strokeWidth="1.5"/>
      <text x="12" y="14" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace">K1</text>
    </svg>
  ),
  objective: (
    <svg width="24" height="18" viewBox="0 0 24 18">
      <rect x="2" y="3" width="20" height="12" fill="none" stroke="#e8c84a" strokeWidth="2"/>
      <text x="12" y="13" textAnchor="middle" fill="#e8c84a" fontSize="7" fontWeight="bold" fontFamily="monospace">OBJ</text>
    </svg>
  ),

  // ── Areas of interest ──────────────────────────────────────────────────
  nai: (
    <svg width="28" height="20" viewBox="0 0 28 20">
      <rect x="1" y="1" width="26" height="18" fill="none" stroke="#14284a" strokeWidth="1.5" strokeDasharray="5,3"/>
      <rect x="1" y="1" width="26" height="7" fill="#14284a"/>
      <text x="14" y="7.5" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" fontFamily="monospace">NAI</text>
    </svg>
  ),
  tai: (
    <svg width="28" height="20" viewBox="0 0 28 20">
      <rect x="1" y="1" width="26" height="18" fill="rgba(232,200,74,0.08)" stroke="#e8c84a" strokeWidth="1.5"/>
      <rect x="1" y="1" width="26" height="7" fill="rgba(232,200,74,0.85)"/>
      <text x="14" y="7.5" textAnchor="middle" fill="#333" fontSize="5" fontWeight="bold" fontFamily="monospace">TAI</text>
    </svg>
  ),
  decisionpoint: (
    <svg width="24" height="20" viewBox="0 0 24 20">
      <polygon points="12,1 23,10 12,19 1,10" fill="rgba(232,200,74,0.15)" stroke="#e8c84a" strokeWidth="1.5"/>
      <text x="12" y="13" textAnchor="middle" fill="#e8c84a" fontSize="6" fontWeight="bold" fontFamily="monospace">DP</text>
    </svg>
  ),

  // ── Control measures ───────────────────────────────────────────────────
  phase_line: (
    <svg width="28" height="14" viewBox="0 0 28 14">
      <line x1="0" y1="7" x2="28" y2="7" stroke="#3b6fd4" strokeWidth="2.5"/>
      <rect x="8" y="2" width="12" height="10" fill="#3b6fd4" rx="1"/>
      <text x="14" y="10" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" fontFamily="monospace">PL</text>
    </svg>
  ),
  limit_of_advance: (
    <svg width="28" height="14" viewBox="0 0 28 14">
      <line x1="0" y1="7" x2="28" y2="7" stroke="#d63030" strokeWidth="2.5" strokeDasharray="5,3"/>
      <rect x="5" y="2" width="18" height="10" fill="#d63030" rx="1"/>
      <text x="14" y="10" textAnchor="middle" fill="white" fontSize="4.5" fontWeight="bold" fontFamily="monospace">LOA</text>
    </svg>
  ),
  battle_position: (
    <svg width="28" height="20" viewBox="0 0 28 20">
      <rect x="1" y="1" width="26" height="18" fill="rgba(26,58,110,0.18)" stroke="#1a3a6e" strokeWidth="1.5"/>
      <rect x="1" y="1" width="26" height="7" fill="rgba(26,58,110,0.90)"/>
      <text x="14" y="7.5" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" fontFamily="monospace">BP</text>
    </svg>
  ),
  engagement_area: (
    <svg width="28" height="20" viewBox="0 0 28 20">
      <rect x="1" y="1" width="26" height="18" fill="rgba(192,64,16,0.15)" stroke="#c04010" strokeWidth="1.5"/>
      <rect x="1" y="1" width="26" height="8" fill="rgba(192,64,16,0.88)"/>
      <text x="14" y="8" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" fontFamily="monospace">EA</text>
    </svg>
  ),

  // ── Threat / SITEMP ────────────────────────────────────────────────────
  enemy_axis: (
    <svg width="28" height="14" viewBox="0 0 28 14">
      <line x1="0" y1="7" x2="20" y2="7" stroke="#cc0000" strokeWidth="5"/>
      <polygon points="18,2 28,7 18,12" fill="#cc0000"/>
    </svg>
  ),
  enemy_avenue: (
    <svg width="28" height="14" viewBox="0 0 28 14">
      <line x1="0" y1="7" x2="21" y2="7" stroke="#cc0000" strokeWidth="3"/>
      <polygon points="20,4 28,7 20,10" fill="#cc0000"/>
    </svg>
  ),
  threat_area: (
    <svg width="28" height="18" viewBox="0 0 28 18">
      <ellipse cx="14" cy="9" rx="12" ry="7" fill="rgba(204,0,0,0.25)" stroke="#cc0000" strokeWidth="1.5"/>
      <line x1="8"  y1="4" x2="12" y2="14" stroke="#cc0000" strokeWidth="1.2"/>
      <line x1="12" y1="4" x2="16" y2="14" stroke="#cc0000" strokeWidth="1.2"/>
      <line x1="16" y1="4" x2="20" y2="14" stroke="#cc0000" strokeWidth="1.2"/>
    </svg>
  ),

  // ── Callouts & labels ──────────────────────────────────────────────────
  callout: (
    <svg width="28" height="20" viewBox="0 0 28 20">
      <rect x="1" y="1" width="26" height="14" fill="rgba(232,200,74,0.15)" stroke="#e8c84a" strokeWidth="1.5" rx="2"/>
      <line x1="5" y1="5" x2="23" y2="5" stroke="#e8c84a" strokeWidth="1"/>
      <line x1="5" y1="9" x2="18" y2="9" stroke="#e8c84a" strokeWidth="1"/>
    </svg>
  ),
  aolabel: (
    <svg width="28" height="20" viewBox="0 0 28 20">
      <rect x="1" y="3" width="26" height="14" fill="rgba(214,48,48,0.15)" stroke="#d63030" strokeWidth="1.5" rx="2"/>
      <text x="14" y="14" textAnchor="middle" fill="#d63030" fontSize="8" fontWeight="bold" fontFamily="monospace">AA1</text>
    </svg>
  ),

  // ── Map elements ───────────────────────────────────────────────────────
  legend: (
    <svg width="28" height="20" viewBox="0 0 28 20">
      <rect x="1" y="1" width="26" height="18" fill="rgba(255,255,255,0.08)" stroke="#2a3a52" strokeWidth="1.5" rx="1"/>
      <rect x="1" y="1" width="26" height="5" fill="#14284a" rx="1"/>
      <text x="14" y="7" textAnchor="middle" fill="#e8c84a" fontSize="4" fontWeight="bold" fontFamily="monospace">LEGEND</text>
    </svg>
  ),
  titleblock: (
    <svg width="28" height="20" viewBox="0 0 28 20">
      <rect x="1" y="1" width="26" height="18" fill="rgba(255,255,255,0.08)" stroke="#2a3a52" strokeWidth="1.5"/>
      <rect x="1" y="1" width="26" height="5" fill="#14284a"/>
      <text x="14" y="7" textAnchor="middle" fill="#e8c84a" fontSize="4" fontWeight="bold" fontFamily="monospace">AO</text>
    </svg>
  ),
  aoboundary: (
    <svg width="28" height="20" viewBox="0 0 28 20">
      <rect x="2" y="2" width="24" height="16" fill="none" stroke="#d63030" strokeWidth="2" strokeDasharray="4,3"/>
    </svg>
  ),
  header: (
    <svg width="28" height="14" viewBox="0 0 28 14">
      <rect x="0" y="0" width="28" height="14" fill="#14284a"/>
      <text x="3" y="10" fill="#e8c84a" fontSize="7" fontWeight="bold" fontFamily="monospace">MCOO</text>
    </svg>
  ),
  footer: (
    <svg width="28" height="10" viewBox="0 0 28 10">
      <rect x="0" y="0" width="28" height="10" fill="#14284a"/>
      <text x="14" y="7" textAnchor="middle" fill="#e8c84a" fontSize="4" fontFamily="monospace">FOUO</text>
    </svg>
  ),
};

export function Toolbar() {
  const addElement = useEditorStore(s => s.addElement);
  const canvasW = useEditorStore(s => s.canvasW);
  const canvasH = useEditorStore(s => s.canvasH);

  const [collapsed, setCollapsed] = useState(() => {
    const init = {};
    TOOLBAR_SECTIONS.forEach(s => { init[s.title] = s.defaultCollapsed ?? false; });
    return init;
  });

  function toggleSection(title) {
    setCollapsed(prev => ({ ...prev, [title]: !prev[title] }));
  }

  function spawn(type) {
    const reg = ELEMENT_REGISTRY[type];
    if (!reg) return;
    const defaults = { ...reg.defaults };

    if (reg.spawnAtTop) {
      defaults.x = 0;
      defaults.y = 0;
      defaults.w = canvasW;
    } else if (reg.spawnAtBottom) {
      defaults.x = 0;
      defaults.y = canvasH - defaults.h;
      defaults.w = canvasW;
    }

    addElement(defaults);
  }

  return (
    <div className="left-toolbar">
      {TOOLBAR_SECTIONS.map(section => {
        const isCollapsed = collapsed[section.title];
        return (
          <div key={section.title} className="tb-section">
            <button
              className="tb-section-title"
              onClick={() => toggleSection(section.title)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: 'inherit',
                font: 'inherit',
                textAlign: 'left',
              }}
            >
              <span>{section.title}</span>
              <span style={{
                fontSize: 11,
                opacity: 0.65,
                display: 'inline-block',
                transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s',
                lineHeight: 1,
                marginLeft: 4,
              }}>▾</span>
            </button>
            {!isCollapsed && section.types.map(type => {
              const reg = ELEMENT_REGISTRY[type];
              if (!reg) return null;
              return (
                <button key={type} className="tool-btn" onClick={() => spawn(type)}>
                  <span className="tool-icon">{ICONS[type]}</span>
                  {reg.label}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
