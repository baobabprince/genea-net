
import React from 'react';

interface GraphLegendProps {
    isGedcom: boolean;
    isAdvancedMode: boolean;
    hasCommunities?: boolean;
}

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm shadow-sm border border-gray-600" style={{ backgroundColor: color }}></div>
        <span className="text-xs text-gray-300 font-medium">{label}</span>
    </div>
);

const GraphLegend: React.FC<GraphLegendProps> = ({ isGedcom, isAdvancedMode, hasCommunities }) => {
    const basicGedcomItems = [
        { color: 'rgba(135, 206, 250, 0.7)', label: 'Parent-Child Link' },
        { color: 'rgba(255, 165, 0, 0.9)', label: 'Marriage Link' },
    ];
    
    const advancedGedcomItems = [
        { color: '#0284c7', label: 'Person' },
        { color: '#16a34a', label: 'Place' },
        { color: '#ea580c', label: 'Date' },
        { color: '#9333ea', label: 'Source' },
        { color: 'rgba(74, 222, 128, 0.5)', label: 'Event Link' },
    ];

    const defaultItems = [
        { color: '#06b6d4', label: 'Node' },
        { color: 'rgba(107, 114, 128, 0.5)', label: 'Link' },
    ];

    const communityItems = [
        { color: 'linear-gradient(to right, #1f77b4, #ff7f0e, #2ca02c)', label: 'קהילות שונות' }
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

    return (
        <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 backdrop-blur-md p-3 rounded-lg border border-gray-700 shadow-xl z-10">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-700 pb-1">Legend</h4>
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm shadow-sm border border-gray-600" style={{ background: item.color }}></div>
                        <span className="text-xs text-gray-300 font-medium">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GraphLegend;
