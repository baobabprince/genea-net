#!/usr/bin/env python3
from pathlib import Path

BTN = r'''
              {/* Open family tree in Anafim — informative label, header placement */}
              <a
                href="https://baobabprince.github.io/anafim/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try {
                    if (rawFileContent && isGedcom) {
                      saveSharedExport({
                        source: 'genea-net',
                        filename: 'family.ged',
                        gedcom: rawFileContent,
                        meta: { title: 'from genea-net' },
                      });
                    }
                  } catch (_) {}
                }}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border font-semibold transition-all duration-200 no-underline ${
                  theme === 'dark'
                    ? 'bg-gray-800/80 border-gray-700 text-gray-200 hover:bg-gray-700'
                    : 'bg-[#fefefb] border-[#e7e8e0] text-[#456352] hover:bg-[#edf1e9] shadow-sm'
                }`}
                title={language === 'he' ? 'פתיחת אותו אילן במבט משפחתי' : 'Open the same tree in family view'}
              >
                {language === 'he' ? 'אילן המשפחה' : 'Family tree'}
              </a>
'''

def main():
    p = Path('App.tsx')
    t = p.read_text()
    if 'אילן המשפחה' in t or 'baobabprince.github.io/anafim/' in t and 'Family tree' in t:
        print('already present')
        return
    needle = '              {/* Language Switcher */}'
    if needle not in t:
        raise SystemExit('language switcher anchor not found')
    t = t.replace(needle, BTN + '\n' + needle, 1)
    p.write_text(t)
    print('added family tree nav')

if __name__ == '__main__':
    main()
