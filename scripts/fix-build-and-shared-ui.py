#!/usr/bin/env python3
from pathlib import Path
import re

def main():
    p = Path('components/ControlPanel.tsx')
    t = p.read_text()
    # Replace any baobab shared block that uses nested template classNames
    start = t.find('{/* Baobab shared storage */}')
    if start < 0:
        print('no shared block')
    else:
        end = t.find('{!hasGraphData && <SampleDataSelector', start)
        if end < 0:
            raise SystemExit('end marker not found')
        new_block = '''{/* Baobab shared storage */}
              <div
                className={
                  theme === 'dark'
                    ? 'mt-3 p-3 rounded-xl border border-gray-700 bg-gray-800/50'
                    : 'mt-3 p-3 rounded-xl border border-[#e7e8e0] bg-[#fefefb]'
                }
              >
                <p
                  className={
                    theme === 'dark'
                      ? 'text-[10px] font-semibold mb-2 text-gray-400'
                      : 'text-[10px] font-semibold mb-2 text-[#82877e]'
                  }
                >
                  {lang === 'he' ? 'שיתוף בין אפליקציות (localStorage)' : 'Cross-app share (localStorage)'}
                </p>
                {sharedSummary ? (
                  <p
                    className={
                      theme === 'dark'
                        ? 'text-[10px] mb-2 truncate text-gray-500'
                        : 'text-[10px] mb-2 truncate text-[#a4a79f]'
                    }
                  >
                    {sharedSummary}
                  </p>
                ) : (
                  <p
                    className={
                      theme === 'dark'
                        ? 'text-[10px] mb-2 text-gray-600'
                        : 'text-[10px] mb-2 text-[#a4a79f]'
                    }
                  >
                    {lang === 'he' ? 'אין עדיין נתונים משותפים' : 'No shared data yet'}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button theme={theme} variant="secondary" onClick={() => onLoadShared?.()} disabled={!hasShared}>
                    {lang === 'he' ? 'טען מהשיתוף' : 'Load shared'}
                  </Button>
                  <Button theme={theme} variant="secondary" onClick={() => onSaveShared?.()} disabled={!hasGraphData || !isGedcom}>
                    {lang === 'he' ? 'שמור לשיתוף' : 'Save shared'}
                  </Button>
                </div>
              </div>
              '''
        t = t[:start] + new_block + t[end:]
        p.write_text(t)
        print('ControlPanel fixed')

    app = Path('App.tsx')
    a = app.read_text()
    pattern = re.compile(
        r"\n  useEffect\(\(\) => \{\n    try \{\n      const params = new URLSearchParams\(window\.location\.search\);\n      if \(params\.get\('baobab'\) === 'shared'\) \{\n        handleLoadShared\(\);.*?}, \[\]\);\n",
        re.S,
    )
    matches = list(pattern.finditer(a))
    print('effects', len(matches))
    a2 = pattern.sub('\n', a)
    if 'handleLoadShared' in a2 and "params.get('baobab')" not in a2:
        insert_after = '}, [rawFileContent, isGedcom, graphData, language]);'
        idx = a2.find('const handleSaveShared')
        end = a2.find(insert_after, idx)
        if end < 0:
            insert_after = '  }, [rawFileContent, isGedcom, graphData, language]);'
            end = a2.find(insert_after, idx)
        if end >= 0:
            end = end + len(insert_after)
            effect = '''

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('baobab') === 'shared') {
        handleLoadShared();
        params.delete('baobab');
        const next = params.toString();
        const url = window.location.pathname + (next ? '?' + next : '') + window.location.hash;
        window.history.replaceState({}, '', url);
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
'''
            a2 = a2[:end] + effect + a2[end:]
            print('effect reinserted')
    app.write_text(a2)
    print('done')

if __name__ == '__main__':
    main()
