const REPO = 'kelaxten/mcoo-generator';
const REPO_URL = `https://github.com/${REPO}`;
const VERSION = '0.2.0';

const STACK = [
  { name: 'React 19', url: 'https://react.dev' },
  { name: 'react-konva', url: 'https://konvajs.org/docs/react/' },
  { name: 'Zustand 5', url: 'https://zustand-demo.pmnd.rs' },
  { name: 'jsPDF 4', url: 'https://github.com/parallax/jsPDF' },
  { name: 'Vite 5', url: 'https://vite.dev' },
];

export function AboutModal({ onClose }) {
  return (
    <div
      className="callout-editor-backdrop"
      onClick={onClose}
      style={{ zIndex: 10000 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--accent)',
          borderRadius: 1,
          padding: 24,
          width: 520,
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 12px 40px rgba(0,0,0,0.85)',
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{
              fontFamily: 'var(--cond)', fontWeight: 900, fontSize: 22,
              letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase',
            }}>
              MCOO <span style={{ color: 'var(--muted)', fontWeight: 400 }}>Generator</span>
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 4,
            }}>
              v{VERSION} &nbsp;·&nbsp; Modified Combined Obstacle Overlay Tool
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', color: 'var(--muted)',
              fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '2px 6px',
              flexShrink: 0,
            }}
            title="Close"
          >✕</button>
        </div>

        {/* ── Description ────────────────────────────────────────────── */}
        <p style={{
          fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text)',
          lineHeight: 1.6, marginBottom: 16,
        }}>
          A free, browser-based tool for producing{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>ATP 2-01.3</span>-compliant
          Modified Combined Obstacle Overlays. Drag-and-drop doctrinal graphics — terrain, obstacles,
          control measures, threat graphics — onto an uploaded map image, then export to JPG or PDF.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18,
        }}>
          {[
            '[S] No server — runs entirely in your browser',
            '[F] Save & load .mcoo project files',
            '[E] Export JPG or multi-page PDF',
            '[Z] Full undo / redo history',
          ].map(f => (
            <div key={f} style={{
              fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
              padding: '6px 10px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 1,
            }}>
              {f}
            </div>
          ))}
        </div>

        {/* ── GitHub repo ─────────────────────────────────────────────── */}
        <div style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 1,
          padding: '12px 14px',
          marginBottom: 18,
        }}>
          <div style={{
            fontFamily: 'var(--cond)', fontWeight: 700, fontSize: 11,
            color: 'var(--accent)', letterSpacing: 1.5, marginBottom: 10,
            textTransform: 'uppercase',
          }}>
            Open Source
          </div>

          {/* MIT badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10,
              background: '#238636', color: '#fff',
              padding: '3px 8px', borderRadius: 1, fontWeight: 700,
              letterSpacing: 0.5,
            }}>
              MIT License
            </span>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10,
              background: '#1f6feb', color: '#fff',
              padding: '3px 8px', borderRadius: 1, fontWeight: 700,
              letterSpacing: 0.5,
            }}>
              Open Source
            </span>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10,
              background: 'var(--surface)', color: 'var(--muted)',
              border: '1px solid var(--border)',
              padding: '3px 8px', borderRadius: 1,
            }}>
              Free Forever
            </span>
          </div>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              textDecoration: 'none',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 1,
              padding: '8px 12px',
              color: 'var(--text)',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* GitHub mark */}
              <svg width="20" height="20" viewBox="0 0 98 96" fill="currentColor" style={{ opacity: 0.7, flexShrink: 0 }}>
                <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
              </svg>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>
                github.com/{REPO}
              </span>
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)' }}>
              [->] View
            </span>
          </a>

          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 8,
            lineHeight: 1.5,
          }}>
            Star the repo, fork it, or submit a pull request. Issues and feature requests welcome.
          </div>
        </div>

        {/* ── Built with ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: 18 }}>
          <div style={{
            fontFamily: 'var(--cond)', fontWeight: 700, fontSize: 11,
            color: 'var(--accent)', letterSpacing: 1.5,
            textTransform: 'uppercase', marginBottom: 8,
          }}>
            Built With
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {STACK.map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--mono)', fontSize: 10,
                  color: 'var(--text)',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 1,
                  padding: '4px 10px',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {name}
              </a>
            ))}
          </div>
        </div>

        {/* ── Disclaimer ──────────────────────────────────────────────── */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)',
          lineHeight: 1.5,
          padding: '8px 10px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 1,
        }}>
          [!] Not an official US Army product. Not affiliated with the Department of Defense.
          For training, planning, and educational purposes only. Always follow applicable
          regulations for handling classified or sensitive information.
        </div>
      </div>
    </div>
  );
}
