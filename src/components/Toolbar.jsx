import { useEditorStore } from '../store/useEditorStore';
import { ELEMENT_REGISTRY, TOOLBAR_SECTIONS } from '../elements/index';

// Mini SVG icons per element type
const ICONS = {
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
  aa: (
    <svg width="28" height="14" viewBox="0 0 28 14">
      <line x1="0" y1="7" x2="22" y2="7" stroke="#d63030" strokeWidth="4"/>
      <polygon points="22,2 28,7 22,12" fill="#d63030"/>
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
      {TOOLBAR_SECTIONS.map(section => (
        <div key={section.title} className="tb-section">
          <div className="tb-section-title">{section.title}</div>
          {section.types.map(type => {
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
      ))}
    </div>
  );
}
