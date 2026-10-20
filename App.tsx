/**
 * genea-net — temporary stub
 *
 * App.tsx was overwritten during the design-system migration.
 * Restore in one command from the repo root:
 *
 *   bash scripts/apply-anafim-colors.sh
 *   git commit -m "fix(design): restore App + ControlPanel with anafim light theme"
 *   git push
 *
 * The script pulls the last good versions from commit fff6553 and applies
 * anafim (ענפים) light-theme colors (cream #f8f7f3, sage #456352, clay #ac694c).
 */
export default function App() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f7f3',
        color: '#29392f',
        fontFamily: 'Heebo, system-ui, sans-serif',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
        <h1 style={{ color: '#456352', fontSize: 22, marginBottom: 12 }}>genea-net</h1>
        <p style={{ color: '#82877e', lineHeight: 1.6, marginBottom: 16 }}>
          יש לשחזר את App.tsx. מהשורש של הריפו הרץ:
        </p>
        <pre
          style={{
            background: '#edf1e9',
            border: '1px solid #e7e8e0',
            borderRadius: 8,
            padding: '12px 16px',
            textAlign: 'left',
            direction: 'ltr',
            fontSize: 13,
            overflow: 'auto',
          }}
        >
{`bash scripts/apply-anafim-colors.sh
git add App.tsx components/ControlPanel.tsx
git commit -m "fix(design): restore with anafim theme"
git push`}
        </pre>
      </div>
    </div>
  );
}
