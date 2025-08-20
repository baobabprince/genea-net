import React from 'react';
import { sampleData, Sample } from '../services/sampleData';
import { PlayCircleIcon } from './ui/Icons';

interface SampleDataSelectorProps {
    onSelect: (content: string, type: 'ged' | 'txt') => void;
}

const SampleDataSelector: React.FC<SampleDataSelectorProps> = ({ onSelect }) => {
    return (
        <div className="flex flex-col gap-2">
            {sampleData.map((sample: Sample) => (
                <button
                    key={sample.name}
                    onClick={() => onSelect(sample.content, sample.type)}
                    className="w-full flex items-center justify-start gap-3 px-3 py-2 text-sm font-medium text-cyan-200 bg-gray-700 bg-opacity-50 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors duration-200"
                >
                    <PlayCircleIcon className="w-5 h-5 flex-shrink-0" />
                    <span>{sample.name}</span>
                </button>
            ))}
        </div>
    );
};

export default SampleDataSelector;