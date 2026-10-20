#!/usr/bin/env python3
from pathlib import Path

def main():
    p = Path('App.tsx')
    t = p.read_text()

    broken = "onClearSelection={() = onLoadShared={handleLoadShared} onSaveShared={handleSaveShared} hasShared={hasSharedExport()} sharedSummary={formatSharedSummary(loadSharedExport())}> setSelectedNode(null)}"
    fixed = """onClearSelection={() => setSelectedNode(null)}
            onLoadShared={handleLoadShared}
            onSaveShared={handleSaveShared}
            hasShared={hasSharedExport()}
            sharedSummary={formatSharedSummary(loadSharedExport())}"""
    if broken in t:
        t = t.replace(broken, fixed, 1)
        print('fixed ControlPanel props')
    elif 'onLoadShared={handleLoadShared}' not in t:
        # try softer fix
        if 'onClearSelection={() =' in t:
            raise SystemExit('broken pattern changed')

    # auto-load once on mount when ?baobab=shared
    if 'baobab=shared' not in t and 'handleLoadShared' in t:
        marker = '  const handleAnalyze = useCallback(() => {'
        # better: after handleLoadShared definition ends - inject useEffect near other effects
        effect = '''
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('baobab') === 'shared') {
        handleLoadShared();
        // clean query without reload
        params.delete('baobab');
        const next = params.toString();
        const url = window.location.pathname + (next ? '?' + next : '') + window.location.hash;
        window.history.replaceState({}, '', url);
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

'''
        # insert before export default or before return of App
        # find first return ( of App component - after handlers
        idx = t.find('  return (')
        if idx < 0:
            raise SystemExit('return not found')
        t = t[:idx] + effect + t[idx:]
        print('added auto-load effect')

    p.write_text(t)
    print('size', p.stat().st_size)
    print('broken remains', 'onClearSelection={() =' in t)
    print('onLoadShared ok', 'onLoadShared={handleLoadShared}' in t)

if __name__ == '__main__':
    main()
