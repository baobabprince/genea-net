#!/usr/bin/env python3
from pathlib import Path
import re

def main():
    app = Path('App.tsx')
    t = app.read_text()

    # Hide GraphLegend on mobile
    if 'hidden sm:block' not in t or 'GraphLegend' not in t[t.find('GraphLegend')-80:t.find('GraphLegend')+20]:
        old = '''              <GraphLegend 
                isGedcom={isGedcom} 
                isAdvancedMode={isAdvancedMode} 
                hasCommunities={!!analysisResult?.communities} 
                lang={language}
                theme={theme}
              />'''
        new = '''              {/* Legend hidden on phones — frees graph space */}
              <div className="hidden sm:block">
                <GraphLegend 
                  isGedcom={isGedcom} 
                  isAdvancedMode={isAdvancedMode} 
                  hasCommunities={!!analysisResult?.communities} 
                  lang={language}
                  theme={theme}
                />
              </div>'''
        if old in t:
            t = t.replace(old, new, 1)
            print('legend wrapped')
        else:
            # try single-line-ish
            t2, n = re.subn(
                r'(<GraphLegend\s[^>]*/>)',
                r'<div className="hidden sm:block">\1</div>',
                t,
                count=1,
            )
            if n:
                t = t2
                print('legend wrapped single')
            else:
                print('legend pattern miss')

    # Compact header on mobile
    t = t.replace(
        'p-2.5 sm:p-4 z-10 border-b',
        'px-2 py-1.5 sm:p-4 z-10 border-b',
    )

    # Hide status pulse text on xs
    t = t.replace(
        "text-xs text-[#456352] font-semibold animate-pulse`}>{finalStatusMsg}</span>",
        "text-xs text-[#456352] font-semibold animate-pulse hidden sm:inline truncate max-w-[36vw]`}>{finalStatusMsg}</span>",
    )

    # Taller graph: reduce bottom sheet max height
    t = t.replace('max-h-[78vh]', 'max-h-[65vh]')
    t = t.replace('max-h-[70vh]', 'max-h-[65vh]')

    # Main: no top padding on mobile so canvas is edge-to-edge
    t = t.replace(
        'container mx-auto p-0 sm:p-3 md:p-4 gap-0 md:gap-4',
        'container mx-auto p-0 md:p-4 gap-0 md:gap-4',
    )

    app.write_text(t)
    print('App done')

    # ControlPanel: collapse heavy analysis under details when analysisResult
    cp = Path('components/ControlPanel.tsx')
    c = cp.read_text()

    # Hide degree distribution on mobile
    if 'DegreeDistributionChart' in c and 'hidden sm:block' not in c[c.find('DegreeDistributionChart')-60:c.find('DegreeDistributionChart')]:
        c = c.replace(
            '<DegreeDistributionChart',
            '<div className="hidden sm:block"><DegreeDistributionChart',
            1,
        )
        # close after component — multiline until />
        def close_after_dd(text):
            i = text.find('<div className="hidden sm:block"><DegreeDistributionChart')
            if i < 0:
                return text
            j = text.find('/>', i)
            if j < 0:
                return text
            return text[: j + 2] + '</div>' + text[j + 2 :]
        c = close_after_dd(c)
        print('degree hidden mobile')

    # Compact shared storage labels already ok
    # Reduce vertical spacing in analysis section titles on mobile via class on outer
    if 'cp-root' not in c:
        # find main return outer div of ControlPanel export
        m = re.search(r'export default function ControlPanel[\s\S]*?return \(\s*<div className="([^"]*)"', c)
        if m:
            old_cls = m.group(1)
            if 'cp-root' not in old_cls:
                c = c.replace(
                    f'className="{old_cls}"',
                    f'className="{old_cls} cp-root"',
                    1,
                )
                print('cp-root class')

    cp.write_text(c)

    css = Path('index.css')
    if css.exists():
        x = css.read_text()
        block = '''
/* Mobile graph-first denser controls */
@media (max-width: 767px) {
  .cp-root { font-size: 12px; }
  .cp-root .space-y-8 { gap: 1rem; }
}
'''
        if 'Mobile graph-first denser' not in x:
            css.write_text(x.rstrip() + '\n' + block)
            print('css')

if __name__ == '__main__':
    main()
