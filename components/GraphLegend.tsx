
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
    theme = 'dark'
}) => {
    const t = (key: any) => getTranslation(lang, key);

    const basicGedcomItems = [
        { color: 'rgba(135, 206, 250, 0.7)', label: t('legendParentChild') },
        { color: 'rgba(255, 165, 0, 0.9)', label: t('legendMarriage') },
    ];
    
    const advancedGedcomItems = [
        { color: '#0284c7', label: t('legendPerson') },
        { color: '#16a34a', label: t('legendPlace') },
        { color: '#ea580c', label: t('legendDate') },
        { color: '#9333ea', label: t('legendSource') },
        { color: 'rgba(74, 222, 128, 0.5)', label: t('legendEventLink') },
    ];

    const defaultItems = [
        { color: '#06b6d4', label: t('legendNode') },
        { color: 'rgba(107, 114, 128, 0.5)', label: t('legendLink') },
    ];

    const communityItems = [
        { color: 'linear-gradient(to right, #1f77b4, #ff7f0e, #2ca02c)', label: t('legendDifferentCommunities') }
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
        : 'bg-white bg-opacity-95 border-gray-200 shadow-lg';

    const headerStyle = theme === 'dark'
        ? 'text-gray-400 border-gray-800'
        : 'text-gray-500 border-gray-200';

    const textStyle = theme === 'dark'
        ? 'text-gray-300'
        : 'text-gray-750';

    const itemBorder = theme === 'dark'
        ? 'border-gray-700'
        : 'border-gray-300';

    return (
        <div className={`absolute top-4 ${lang === 'he' ? 'left-4' : 'right-4'} ${containerStyle} p-3 rounded-lg border z-10 transition-all duration-200`}>
            <h4 className={`text-[10px] font-bold ${headerStyle} uppercase tracking-wider mb-2 border-b pb-1`}>
                {t('legendTitle')}
            </h4>
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-sm shadow-sm border ${itemBorder}`} style={{ background: item.color }}></div>
                        <span className={`text-xs ${textStyle} font-semibold`}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GraphLegend;
