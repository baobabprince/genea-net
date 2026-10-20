#!/usr/bin/env python3
from pathlib import Path
import re

def main():
    app = Path('App.tsx')
    t = app.read_text()

    if 'baobabSharedStorage' not in t:
        needle = "from './services/graphService';"
        if needle not in t:
            raise SystemExit('graphService import missing')
        t = t.replace(
            needle,
            needle + "\nimport { saveSharedExport, loadSharedExport, hasSharedExport, formatSharedSummary } from './utils/baobabSharedStorage';",
            1,
        )

    old_loaded = (
        "        const data = isGedcomFile ? parseGedcom(content, false) : parseEdgeList(content);\n"
        "        setGraphData(data);\n"
        "        setStatusMessage({ key: 'loadedFile', param: file.name });"
    )
    new_loaded = (
        "        const data = isGedcomFile ? parseGedcom(content, false) : parseEdgeList(content);\n"
        "        setGraphData(data);\n"
        "        setStatusMessage({ key: 'loadedFile', param: file.name });\n"
        "        if (isGedcomFile) {\n"
        "          try {\n"
        "            saveSharedExport({\n"
        "              source: 'genea-net',\n"
        "              filename: file.name,\n"
        "              gedcom: content,\n"
        "              meta: { personCount: data?.nodes?.length, title: file.name },\n"
        "            });\n"
        "          } catch (_) {}\n"
        "        }"
    )
    if old_loaded in t and "source: 'genea-net'" not in t:
        t = t.replace(old_loaded, new_loaded, 1)

    if 'handleLoadShared' not in t:
        marker = '  const handleAnalyze = useCallback(() => {'
        if marker not in t:
            raise SystemExit('handleAnalyze not found')
        handlers = '''  const handleLoadShared = useCallback(() => {
    const shared = loadSharedExport();
    if (!shared?.gedcom) {
      setError(language === 'he' ? 'אין נתונים משותפים לטעינה.' : 'No shared data found.');
      return;
    }
    setError(null); setAnalysisResult(null); setSelectedNode(null); setAiSummary(null);
    try {
      const content = shared.gedcom;
      setRawFileContent(content);
      setIsGedcom(true);
      const data = parseGedcom(content, false);
      setGraphData(data);
      setStatusMessage({ key: 'loadedFile', param: shared.filename || 'shared.ged' });
    } catch (err) {
      setError(language === 'he' ? 'שגיאה בטעינת הנתונים המשותפים.' : 'Error loading shared data.');
    }
  }, [language]);

  const handleSaveShared = useCallback(() => {
    if (!rawFileContent || !isGedcom) {
      setError(language === 'he' ? 'יש לטעון קובץ GEDCOM תחילה.' : 'Load a GEDCOM file first.');
      return;
    }
    try {
      saveSharedExport({
        source: 'genea-net',
        filename: 'from-genea-net.ged',
        gedcom: rawFileContent,
        meta: { personCount: graphData?.nodes?.length },
      });
      setStatusMessage({ key: 'loadedFile', param: language === 'he' ? 'נשמר לשיתוף בין האפליקציות' : 'Saved to shared storage' });
    } catch (err) {
      setError(language === 'he' ? 'שמירה לשיתוף נכשלה (זיכרון מלא?).' : 'Failed to save shared data.');
    }
  }, [rawFileContent, isGedcom, graphData, language]);

'''
        t = t.replace(marker, handlers + marker, 1)

    if 'onLoadShared=' not in t:
        m = re.search(r'<ControlPanel\b[^>]*>', t)
        if not m:
            raise SystemExit('ControlPanel usage not found')
        tag = m.group(0)
        extra = ' onLoadShared={handleLoadShared} onSaveShared={handleSaveShared} hasShared={hasSharedExport()} sharedSummary={formatSharedSummary(loadSharedExport())}'
        if tag.endswith('/>'):
            new_tag = tag[:-2] + extra + ' />'
        else:
            new_tag = tag[:-1] + extra + '>'
        t = t.replace(tag, new_tag, 1)

    app.write_text(t)
    print('App.tsx', app.stat().st_size)

    cp = Path('components/ControlPanel.tsx')
    c = cp.read_text()
    if 'onLoadShared' not in c:
        c = c.replace(
            '  onFileSelect: (file: File) => void;\n',
            '  onFileSelect: (file: File) => void;\n  onLoadShared?: () => void;\n  onSaveShared?: () => void;\n  hasShared?: boolean;\n  sharedSummary?: string;\n',
            1,
        )
        c = c.replace(
            '  onFileSelect, onAnalyze, onDetectCommunities, onSampleSelect, error, analysisResult, isAnalyzing, isDetectingCommunities, hasGraphData, graphData,',
            '  onFileSelect, onLoadShared, onSaveShared, hasShared, sharedSummary, onAnalyze, onDetectCommunities, onSampleSelect, error, analysisResult, isAnalyzing, isDetectingCommunities, hasGraphData, graphData,',
            1,
        )
        anchor = '{!hasGraphData && <SampleDataSelector onSelect={onSampleSelect} lang={lang} theme={theme} />}'
        shared_ui = (
            "{/* Baobab shared storage */}\n"
            "              <div className={`mt-3 p-3 rounded-xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-[#e7e8e0] bg-[#fefefb]'`}>\n"
            "                <p className={`text-[10px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#82877e]'`}>\n"
            "                  {lang === 'he' ? 'שיתוף בין אפליקציות (localStorage)' : 'Cross-app share (localStorage)'}\n"
            "                </p>\n"
            "                {sharedSummary ? (\n"
            "                  <p className={`text-[10px] mb-2 truncate ${theme === 'dark' ? 'text-gray-500' : 'text-[#a4a79f]'}`}>{sharedSummary}</p>\n"
            "                ) : (\n"
            "                  <p className={`text-[10px] mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-[#a4a79f]'}`}>\n"
            "                    {lang === 'he' ? 'אין עדיין נתונים משותפים' : 'No shared data yet'}\n"
            "                  </p>\n"
            "                )}\n"
            "                <div className=\"flex gap-2\">\n"
            "                  <Button theme={theme} variant=\"secondary\" onClick={() => onLoadShared?.()} disabled={!hasShared}>\n"
            "                    {lang === 'he' ? 'טען מהשיתוף' : 'Load shared'}\n"
            "                  </Button>\n"
            "                  <Button theme={theme} variant=\"secondary\" onClick={() => onSaveShared?.()} disabled={!hasGraphData || !isGedcom}>\n"
            "                    {lang === 'he' ? 'שמור לשיתוף' : 'Save shared'}\n"
            "                  </Button>\n"
            "                </div>\n"
            "              </div>\n"
            "              " + anchor
        )
        if anchor not in c:
            raise SystemExit('SampleDataSelector anchor not found')
        c = c.replace(anchor, shared_ui, 1)
    cp.write_text(c)
    print('ControlPanel.tsx', cp.stat().st_size)

if __name__ == '__main__':
    main()
