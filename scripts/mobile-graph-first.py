#!/usr/bin/env python3
"""Make genea-net mobile: full-screen graph, control panel as bottom sheet."""
from pathlib import Path
import re

def main():
    p = Path('App.tsx')
    t = p.read_text()

    # 1) Add mobilePanelOpen state near other useState
    if 'mobilePanelOpen' not in t:
        needle = "const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);"
        if needle not in t:
            # try alternate
            needle = "const [theme, setTheme] = useState<'light' | 'dark'>('light');"
        if needle not in t:
            raise SystemExit('state anchor not found')
        t = t.replace(
            needle,
            needle + "\n  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);",
            1,
        )
        print('added mobilePanelOpen state')

    # Close panel when graph loads (mobile focus on graph)
    if 'setMobilePanelOpen(false)' not in t or 'graphData && window' not in t:
        marker = '  const handleAnalyze = useCallback(() => {'
        if marker not in t:
            marker = '  return ('
        inject = '''
  // On mobile, prefer graph once data is loaded
  useEffect(() => {
    if (!graphData) {
      setMobilePanelOpen(true);
      return;
    }
    try {
      if (window.matchMedia('(max-width: 767px)').matches) {
        setMobilePanelOpen(false);
      }
    } catch (_) {}
  }, [graphData]);

'''
        if 'matchMedia' not in t:
            t = t.replace(marker, inject + marker, 1)
            print('added auto-close effect')

    # 2) Compact header on mobile
    t = t.replace(
        'className={`backdrop-blur-md p-4 z-10 border-b flex-shrink-0 transition-colors duration-200 ${headerBg}`}',
        'className={`backdrop-blur-md p-2.5 sm:p-4 z-10 border-b flex-shrink-0 transition-colors duration-200 ${headerBg}`}',
        1,
    )
    t = t.replace(
        '<GraphIcon className="w-8 h-8 text-[#456352]" />',
        '<GraphIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#456352] flex-shrink-0" />',
        1,
    )
    t = t.replace(
        'className="text-xl md:text-2xl font-bold tracking-tight"',
        'className="text-base sm:text-xl md:text-2xl font-bold tracking-tight truncate"',
        1,
    )

    # 3) Replace main layout: panel drawer on mobile
    old_main = '''      <main className="flex-grow flex flex-col md:flex-row container mx-auto p-4 gap-4 min-h-0 overflow-hidden md:overflow-visible">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 h-[45vh] md:h-full flex flex-col min-h-0 overflow-hidden">
          <ControlPanel'''

    new_main = '''      <main className="flex-grow flex flex-col md:flex-row container mx-auto p-0 sm:p-3 md:p-4 gap-0 md:gap-4 min-h-0 overflow-hidden relative">
        {/* Mobile: floating open-panel button */}
        {!mobilePanelOpen && (
          <button
            type="button"
            className="md:hidden fixed bottom-4 z-30 px-4 py-2.5 rounded-full shadow-lg border text-sm font-semibold flex items-center gap-2"
            style={{
              [language === 'he' ? 'left' : 'right']: '1rem',
              background: theme === 'dark' ? '#1f2937' : '#fefefb',
              borderColor: theme === 'dark' ? '#374151' : '#e7e8e0',
              color: theme === 'dark' ? '#e5e7eb' : '#456352',
            }}
            onClick={() => setMobilePanelOpen(true)}
          >
            {language === 'he' ? 'לוח בקרה' : 'Controls'}
          </button>
        )}

        {/* Backdrop + bottom sheet on mobile; side panel on md+ */}
        {mobilePanelOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobilePanelOpen(false)}
            aria-hidden
          />
        )}

        <div
          className={
            (mobilePanelOpen
              ? 'fixed inset-x-0 bottom-0 z-50 max-h-[78vh] rounded-t-2xl shadow-2xl '
              : 'hidden ') +
            'md:relative md:flex md:inset-auto md:bottom-auto md:z-auto md:max-h-none md:rounded-none md:shadow-none ' +
            'w-full md:w-1/3 lg:w-1/4 flex-shrink-0 md:h-full flex flex-col min-h-0 overflow-hidden ' +
            (theme === 'dark' ? 'bg-gray-900' : 'bg-[#f8f7f3]')
          }
        >
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b flex-shrink-0" style={{ borderColor: theme === 'dark' ? '#374151' : '#e7e8e0' }}>
            <span className="text-sm font-bold" style={{ color: theme === 'dark' ? '#e5e7eb' : '#456352' }}>
              {language === 'he' ? 'לוח בקרה' : 'Controls'}
            </span>
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{
                background: theme === 'dark' ? '#374151' : '#edf1e9',
                color: theme === 'dark' ? '#e5e7eb' : '#456352',
              }}
              onClick={() => setMobilePanelOpen(false)}
            >
              {language === 'he' ? 'חזרה לגרף' : 'Back to graph'}
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col p-2 md:p-0">
          <ControlPanel'''

    if old_main not in t:
        if 'mobilePanelOpen' in t and 'חזרה לגרף' in t:
            print('layout already patched')
        else:
            raise SystemExit('main layout block not found')
    else:
        t = t.replace(old_main, new_main, 1)
        # Close the extra wrappers after ControlPanel closing
        # Find ControlPanel self-closing end /> after our insertion
        # Original was: </div> after ControlPanel then graph div
        close_old = '''          />
        </div>
        <div className={`flex-grow flex-1 rounded-lg overflow-hidden relative border transition-colors duration-250 ${canvasBgClass}`}>'''
        close_new = '''          />
          </div>
        </div>
        <div className={`flex-grow flex-1 min-h-0 rounded-none md:rounded-lg overflow-hidden relative border-0 md:border transition-colors duration-250 ${canvasBgClass}`}>'''
        if close_old not in t:
            raise SystemExit('ControlPanel close block not found')
        t = t.replace(close_old, close_new, 1)
        print('layout patched')

    # 4) Smaller legend on mobile via class on GraphLegend wrapper - patch GraphLegend file
    legend = Path('components/GraphLegend.tsx')
    if legend.exists():
        lt = legend.read_text()
        old_leg = 'className={`absolute top-4 ${lang === \'he\' ? \'left-4\' : \'right-4\'} ${containerStyle} p-3 rounded-xl border z-10 transition-all duration-200`}'
        new_leg = 'className={`absolute top-2 ${lang === \'he\' ? \'left-2\' : \'right-2\'} sm:top-4 ${lang === \'he\' ? \'sm:left-4\' : \'sm:right-4\'} ${containerStyle} p-2 sm:p-3 rounded-lg sm:rounded-xl border z-10 transition-all duration-200 max-w-[42vw] sm:max-w-none text-[10px] sm:text-xs opacity-90 sm:opacity-100`}'
        if old_leg in lt:
            legend.write_text(lt.replace(old_leg, new_leg, 1))
            print('legend compact mobile')
        else:
            print('legend pattern skip')

    p.write_text(t)
    print('App size', p.stat().st_size)

if __name__ == '__main__':
    main()
