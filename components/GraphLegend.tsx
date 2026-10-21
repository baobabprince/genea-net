import React from 'react';
import { Language, getTranslation } from '../utils/localization';

interface GraphLegendProps {
    isGedcom: boolean;
    isAdvancedMode: boolean;
    hasCommunities?: boolean;
    lang: Language;
    theme?: 'light' | 'dark';
}

const GraphLegend: React.FC<GraphLegendProps> = ({
    isGedcom,
    isAdvancedMode,
    hasCommunities,
    lang,
    theme = 'light'
}) => {
    const t = (key: any) => getTranslation(lang, key);

    const basicGedcomItems = [
        { color: 'rgba(69, 99, 82, 0.75)', label: t('legendParentChild') },
        { color: 'rgba(172, 105, 76, 0.9)', label: t('legendMarriage') },
    ];

    const advancedGedcomItems = [
        { color: '#456352', label: t('legendPerson') },
        { color: '#74975e', label: t('legendPlace') },
        { color: '#ac694c', label: t('legendDate') },
        { color: '#9333ea', label: t('legendSource') },
        { color: 'rgba(116, 151, 94, 0.5)', label: t('legendEventLink') },
    ];

    const defaultItems = [
        { color: '#456352', label: t('legendNode') },
        { color: 'rgba(130, 135, 126, 0.5)', label: t('legendLink') },
    ];

    const communityItems = [
        { color: 'linear-gradient(to right, #456352, #ac694c, #74975e)', label: t('legendDifferentCommunities') }
    ];

    let items = [];

    if (hasCommunities) {
        items = [...communityItems, ...basicGedcomItems];
    } else if (isGedcom) {
        if (isAdvancedMode) {
            items = [...advancedGedcomItems, ...basicGedcomItems];
        } else {
            items = basicGedcomItems;
        }
    } else {
        items = defaultItems;
    }

    const containerStyle = theme === 'dark'
        ? 'bg-gray-950 bg-opacity-80 border-gray-700 shadow-2xl'
        : 'bg-[#fefefb]/95 border-[#e7e8e0] shadow-[0_4px_18px_#29392f14]';

    const headerStyle = theme === 'dark'
        ? 'text-gray-400 border-gray-800'
        : 'text-[#82877e] border-[#e7e8e0]';

    const textStyle = theme === 'dark'
        ? 'text-gray-300'
        : 'text-[#29392f]';

    const itemBorder = theme === 'dark'
        ? 'border-gray-700'
        : 'border-[#e7e8e0]';

    return (
        <div className={`absolute top-2 ${lang === 'he' ? 'left-2' : 'right-2'} sm:top-4 ${lang === 'he' ? 'sm:left-4' : 'sm:right-4'} ${containerStyle} p-2 sm:p-3 rounded-lg sm:rounded-xl border z-10 transition-all duration-200 max-w-[42vw] sm:max-w-none text-[10px] sm:text-xs opacity-90 sm:opacity-100`}>
            <h4 className={`text-[10px] font-bold ${headerStyle} uppercase tracking-wider mb-2 border-b pb-1`}>
                {t('legendTitle')}
            </h4>
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-md shadow-sm border ${itemBorder}`} style={{ background: item.color }}></div>
                        <span className={`text-xs ${textStyle} font-semibold`}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GraphLegend;
