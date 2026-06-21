import React from 'react';
import { sampleData, Sample } from '../services/sampleData';
import { PlayCircleIcon } from './ui/Icons';
import { Language } from '../utils/localization';

interface SampleDataSelectorProps {
    onSelect: (content: string, type: 'ged' | 'txt', name: string) => void;
    lang: Language;
    theme?: 'light' | 'dark';
}

const getLocalizedSampleName = (name: string, lang: Language): string => {
    if (lang === 'he') return name;
    if (name.includes('الملوכה') || name.includes('המלוכה')) {
        return 'Royal Family (GEDCOM Enhanced)';
    } else if (name.includes('הקראטה') || name.includes('מועדון')) {
        return 'Karate Club (TXT - Communities)';
    } else if (name.includes('פלורנטיניות') || name.includes('משפחות')) {
        return 'Florentine Families (TXT - Centrality)';
    }
    return name;
};

const SampleDataSelector: React.FC<SampleDataSelectorProps> = ({ onSelect, lang, theme = 'dark' }) => {
    const btnClasses = theme === 'dark'
        ? "w-full flex items-center justify-test text-start gap-3 px-3 py-2 text-sm font-medium text-cyan-200 bg-gray-750 bg-opacity-50 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors duration-200"
        : "w-full flex items-center justify-test text-start gap-3 px-3 py-2 text-sm font-medium text-cyan-800 bg-gray-100 bg-opacity-70 border border-gray-200 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-cyan-500 transition-colors duration-200";

    return (
        <div className="flex flex-col gap-2">
            {sampleData.map((sample: Sample) => (
                <button
                    key={sample.name}
                    onClick={() => onSelect(sample.content, sample.type, getLocalizedSampleName(sample.name, lang))}
                    className={btnClasses}
                >
                    <PlayCircleIcon className="w-5 h-5 flex-shrink-0 text-cyan-500" />
                    <span className="truncate">{getLocalizedSampleName(sample.name, lang)}</span>
                </button>
            ))}
        </div>
    );
};

export default SampleDataSelector;