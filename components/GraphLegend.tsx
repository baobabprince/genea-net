import React from 'react';

interface GraphLegendProps {
    isGedcom: boolean;
}

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <div className="flex items-center gap-2">
        <div className="w-4 h-1" style={{ backgroundColor: color }}></div>
        <span className="text-xs text-gray-300">{label}</span>
    </div>
);

const GraphLegend: React.FC<GraphLegendProps> = ({ isGedcom }) => {
    const gedcomItems = [
        { color: 'rgba(135, 206, 250, 0.7)', label: 'Parent-Child' },
        { color: 'rgba(255, 165, 0, 0.9)', label: 'Marriage' },
    ];
    const defaultItems = [
        { color: 'rgba(107, 114, 128, 0.5)', label: 'Link' },
    ];

    const items = isGedcom ? gedcomItems : defaultItems;

    return (
        <div className="absolute top-4 left-4 bg-gray-900/70 backdrop-blur-sm p-3 rounded-lg border border-gray-700 shadow-lg">
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <LegendItem key={item.label} color={item.color} label={item.label} />
                ))}
            </div>
        </div>
    );
};

export default GraphLegend;