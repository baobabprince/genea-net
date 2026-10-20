#!/usr/bin/env bash
# Apply anafim light-theme colors after restoring original App.tsx / ControlPanel.tsx
# Run from genea-net repo root: bash scripts/apply-anafim-colors.sh
set -euo pipefail

echo "==> Restoring originals from commit fff6553..."
curl -fsSL -o App.tsx \
  "https://raw.githubusercontent.com/baobabprince/genea-net/fff6553eeca4bc987155166586dffc1c827e8e07/App.tsx"
curl -fsSL -o components/ControlPanel.tsx \
  "https://raw.githubusercontent.com/baobabprince/genea-net/fff6553eeca4bc987155166586dffc1c827e8e07/components/ControlPanel.tsx"

echo "==> Applying anafim light-theme colors..."
python3 << 'PY'
from pathlib import Path

app = Path('App.tsx').read_text()
reps = [
    ("const pageBg = theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-100 text-gray-800';",
     "const pageBg = theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-[#f8f7f3] text-[#29392f]';"),
    ("const headerBg = theme === 'dark' ? 'bg-gray-900 bg-opacity-70 border-gray-800 text-white' : 'bg-white bg-opacity-85 border-gray-200 text-gray-800 shadow-sm';",
     "const headerBg = theme === 'dark' ? 'bg-gray-900 bg-opacity-70 border-gray-800 text-white' : 'bg-[#fefefb]/85 border-[#e7e8e0] text-[#29392f] shadow-sm';"),
    ("const canvasBgClass = theme === 'dark' ? 'bg-gray-900 border-gray-800 shadow-2xl h-full min-h-[300px]' : 'bg-white border-gray-200 shadow-lg h-full min-h-[300px] text-gray-900';",
     "const canvasBgClass = theme === 'dark' ? 'bg-gray-900 border-gray-800 shadow-2xl h-full min-h-[300px]' : 'bg-white border-[#e7e8e0] shadow-[0_4px_18px_#29392f14] h-full min-h-[300px] text-[#29392f]';"),
    ("? 'bg-gray-800/80 border-gray-700 text-cyan-400 hover:bg-gray-700 hover:text-cyan-300'\n                    : 'bg-gray-50 border-gray-200 text-cyan-750 hover:bg-gray-100 hover:text-cyan-800 shadow-sm'",
     "? 'bg-gray-800/80 border-gray-700 text-cyan-400 hover:bg-gray-700 hover:text-cyan-300'\n                    : 'bg-[#edf1e9] border-[#e7e8e0] text-[#456352] hover:bg-[#e9f0e5] hover:text-[#315b48] shadow-sm'"),
    ("? 'bg-gray-800/80 border-gray-700 text-yellow-500 hover:bg-gray-700 hover:text-yellow-400'\n                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm'",
     "? 'bg-gray-800/80 border-gray-700 text-yellow-500 hover:bg-gray-700 hover:text-yellow-400'\n                    : 'bg-[#f8eee5] border-[#e7e8e0] text-[#ac694c] hover:bg-[#f0e0d4] hover:text-[#93583f] shadow-sm'"),
    ('<GraphIcon className="w-8 h-8 text-cyan-500" />',
     '<GraphIcon className="w-8 h-8 text-[#456352]" />'),
    ("text-xs text-cyan-500 font-semibold animate-pulse",
     "text-xs text-[#456352] font-semibold animate-pulse"),
]
for old, new in reps:
    if old not in app:
        print('WARN missing in App:', old[:60])
    app = app.replace(old, new)
Path('App.tsx').write_text(app)

cp = Path('components/ControlPanel.tsx').read_text()
cp_reps = [
    ("theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'", "theme === 'dark' ? 'text-cyan-400' : 'text-[#456352]'"),
    ("theme === 'dark' ? 'text-white' : 'text-gray-900'", "theme === 'dark' ? 'text-white' : 'text-[#29392f]'"),
    ("theme === 'dark' ? 'text-gray-400' : 'text-gray-500'", "theme === 'dark' ? 'text-gray-400' : 'text-[#82877e]'"),
    ("theme === 'dark' ? 'border-cyan-500' : 'border-cyan-600'", "theme === 'dark' ? 'border-cyan-500' : 'border-[#456352]'"),
    ("theme === 'dark' ? 'bg-cyan-900/40 border-cyan-700 text-cyan-300' : 'bg-cyan-100 border-cyan-350 text-cyan-700'",
     "theme === 'dark' ? 'bg-cyan-900/40 border-cyan-700 text-cyan-300' : 'bg-[#edf1e9] border-[#d6e2cd] text-[#456352]'"),
    ("theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-700'",
     "theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-400' : 'bg-[#f8f7f3] border-[#e7e8e0] text-[#82877e] hover:text-[#456352]'"),
    ("theme === 'dark' ? 'bg-gray-950/50 border-gray-850' : 'bg-gray-50 border-gray-150'",
     "theme === 'dark' ? 'bg-gray-950/50 border-gray-850' : 'bg-[#fafcf7] border-[#e7e8e0]'"),
    ("theme === 'dark' ? 'text-cyan-500' : 'text-cyan-700'", "theme === 'dark' ? 'text-cyan-500' : 'text-[#456352]'"),
    ("theme === 'dark' ? 'group-hover:text-cyan-400' : 'group-hover:text-cyan-600'",
     "theme === 'dark' ? 'group-hover:text-cyan-400' : 'group-hover:text-[#456352]'"),
    ("theme === 'dark' ? 'hover:bg-gray-800/40' : 'hover:bg-gray-100/50'",
     "theme === 'dark' ? 'hover:bg-gray-800/40' : 'hover:bg-[#edf1e9]/80'"),
    ("theme === 'dark' ? 'bg-gray-950/80 border-gray-800' : 'bg-gray-50/90 border-gray-200'",
     "theme === 'dark' ? 'bg-gray-950/80 border-gray-800' : 'bg-[#f8f7f3]/95 border-[#e7e8e0]'"),
    ("theme === 'dark' ? 'text-gray-400' : 'text-gray-600'", "theme === 'dark' ? 'text-gray-400' : 'text-[#657157]'"),
    ("theme === 'dark' ? 'text-gray-600' : 'text-gray-400'", "theme === 'dark' ? 'text-gray-600' : 'text-[#a4a79f]'"),
    ("theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'",
     "theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-[#e7e8e0]'"),
    ("theme === 'dark' ? 'bg-gray-950 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-800'",
     "theme === 'dark' ? 'bg-gray-950 border-gray-800 text-gray-300' : 'bg-[#fafcf7] border-[#e7e8e0] text-[#29392f]'"),
    ("theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-cyan-400' : 'text-gray-700 hover:bg-gray-100 hover:text-cyan-700'",
     "theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-cyan-400' : 'text-[#657157] hover:bg-[#edf1e9] hover:text-[#456352]'"),
    ("'bg-cyan-600 shadow-[0_0_10px_rgba(8,145,178,0.4)]' : 'bg-gray-300'",
     "'bg-[#ac694c] shadow-[0_0_10px_rgba(172,105,76,0.35)]' : 'bg-[#e7e8e0]'"),
]
for old, new in cp_reps:
    cp = cp.replace(old, new)
cp = cp.replace('className="font-bold text-cyan-500"', 'className="font-bold text-[#456352]"')
Path('components/ControlPanel.tsx').write_text(cp)
print('Colors applied.')
PY

echo "==> Staging..."
git add App.tsx components/ControlPanel.tsx
git status
echo ""
echo "Run: git commit -m 'fix(design): restore App + ControlPanel with anafim light theme' && git push"
