import React, { useRef, useState, useMemo } from 'react';
import { AnalysisResult, NodeObject, GraphData, NodeAnalysisResult } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import Spinner from './ui/Spinner';
import SampleDataSelector from './SampleDataSelector';
import Tooltip from './ui/Tooltip';
import { Language, getTranslation } from '../utils/localization';
import { InfoIcon, UploadIcon, BarChart2Icon, XCircleIcon, SearchIcon, SparklesIcon, UsersIcon } from './ui/Icons';

interface ControlPanelProps {
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  onDetectCommunities: () => void;
  onSampleSelect: (content: string, type: 'ged' | 'txt', name: string) => void;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  isDetectingCommunities: boolean;
  error: string | null;
  hasGraphData: boolean;
  graphData: GraphData | null;
  selectedNode: NodeObject | null;
  selectedNodeStats: NodeAnalysisResult | null;
  onNodeSelect: (node: NodeObject, event?: any) => void;
  onClearSelection: () => void;
  isAdvancedMode: boolean;
  onToggleAdvancedMode: () => void;
  isGedcom: boolean;
  onGenerateAiInsights: () => void;
  aiSummary: string | null;
  isGeneratingAi: boolean;
  lang: Language;
  theme?: 'light' | 'dark';
}

const formatStatValue = (val: any): string => {
    if (val === null || val === undefined) return 'N/A';
    const strVal = String(val);
    if (strVal === 'N/A' || strVal.includes('Skipped')) return strVal;
    
    let num = typeof val === 'number' ? val : parseFloat(strVal);
    if (isNaN(num)) return strVal;
    
    if (Number.isInteger(num)) {
        return num.toLocaleString();
    }
    
    // Use exponential notation only for very small values (like density)
    if (Math.abs(num) < 0.0001 && num !== 0) {
        return num.toExponential(4);
    }
    
    return num.toLocaleString(undefined, { 
        maximumFractionDigits: 4,
        minimumFractionDigits: 2 
    });
};

const StatItem: React.FC<{ 
  label: string; 
  value: React.ReactNode; 
  tooltip?: string; 
  highlight?: boolean;
  theme?: 'light' | 'dark' 
}> = ({ label, value, tooltip, highlight, theme = 'dark' }) => {
  const borderClass = theme === 'dark' ? 'border-gray-800' : 'border-gray-150';
  const highlightClass = highlight 
    ? (theme === 'dark' ? 'bg-cyan-500/5 px-2 -mx-2 rounded' : 'bg-cyan-500/10 px-2 -mx-2 rounded') 
    : '';
  const labelClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const valueClass = highlight 
    ? (theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700')
    : (theme === 'dark' ? 'text-white' : 'text-gray-900');

  return (
    <div className={`flex justify-between items-center py-2 border-b last:border-b-0 ${borderClass} ${highlightClass}`}>
        <span className={`text-xs ${labelClass} flex items-center gap-1`}>
            {label}
            {tooltip && (
                <Tooltip content={tooltip} theme={theme}>
                    <InfoIcon className="w-3.5 h-3.5 text-gray-500 cursor-help" />
                </Tooltip>
            )}
        </span>
        <span className={`text-sm font-bold ${valueClass}`}>
            {typeof value === 'object' && React.isValidElement(value) ? value : formatStatValue(value)}
        </span>
    </div>
  );
};

const DegreeHistogram: React.FC<{ 
  data: { degree: number; count: number }[]; 
  totalNodes: number;
  lang: Language;
  theme?: 'light' | 'dark';
}> = ({ data, totalNodes, lang, theme = 'dark' }) => {
    const [useLogScale, setUseLogScale] = useState(false);
    
    if (!data || data.length === 0) return null;
    
    const maxCount = Math.max(...data.map(d => d.count)) || 1;
    const mode = data.reduce((prev, current) => (prev.count > current.count) ? prev : current).degree;
    const avg = (data.reduce((acc, curr) => acc + (curr.degree * curr.count), 0) / totalNodes).toFixed(1);

    const linksText = lang === 'he' ? 'קשרים' : 'links';
    const nodesText = lang === 'he' ? 'צמתים' : 'nodes';

    const headerBorder = theme === 'dark' ? 'border-cyan-500' : 'border-cyan-600';
    const descText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const btnClass = useLogScale 
      ? (theme === 'dark' ? 'bg-cyan-900/40 border-cyan-700 text-cyan-300' : 'bg-cyan-100 border-cyan-350 text-cyan-700')
      : (theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-700');

    const innerBg = theme === 'dark' ? 'bg-gray-950/50 border-gray-850' : 'bg-gray-50 border-gray-150';

    return (
        <div className="mt-4">
            <div className={`flex items-center justify-between mb-3 border-r-2 ${headerBorder} pr-2`}>
                <h2 className={`text-[10px] font-bold ${descText} uppercase tracking-widest`}>
                    {getTranslation(lang, 'degreeDistributionTitle')}
                </h2>
                <button 
                    onClick={() => setUseLogScale(!useLogScale)}
                    className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${btnClass}`}
                >
                    {useLogScale ? getTranslation(lang, 'logarithmic') : getTranslation(lang, 'linear')}
                </button>
            </div>

            <div className={`relative h-32 w-full ${innerBg} rounded-lg border p-3 shadow-inner overflow-hidden`}>
                <div className="flex items-end gap-1 h-full w-full overflow-x-auto pb-4 custom-scrollbar">
                    {data.map((d, i) => {
                        const rawRatio = d.count / maxCount;
                        const logRatio = Math.log10(d.count + 1) / Math.log10(maxCount + 1);
                        const heightPct = (useLogScale ? logRatio : rawRatio) * 100;
                        const percentage = ((d.count / totalNodes) * 100).toFixed(1);

                        return (
                            <div key={i} className="flex-1 min-w-[8px] h-full flex flex-col justify-end group/bar">
                                <Tooltip 
                                    theme={theme}
                                    className="h-full flex flex-col justify-end"
                                    content={
                                        <div className="text-center">
                                            <div className="font-bold text-cyan-500">{d.degree} {linksText}</div>
                                            <div className="text-xs text-gray-400">{d.count} {nodesText} ({percentage}%)</div>
                                        </div>
                                    }
                                >
                                    <div 
                                        className="bg-gradient-to-t from-cyan-600/60 to-cyan-400 group-hover/bar:from-cyan-300 group-hover/bar:to-cyan-600 transition-all rounded-t-[1px] w-full" 
                                        style={{ height: `${Math.max(heightPct, 2)}%` }} 
                                    />
                                </Tooltip>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={`flex justify-between text-[8px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-1 font-mono`}>
                <span>{getTranslation(lang, 'modeDegree')}{mode}</span>
                <span>{getTranslation(lang, 'avgDegreeBar')}{avg}</span>
            </div>
        </div>
    );
};

const RankingList: React.FC<{ 
  title: string; 
  items?: { node: NodeObject; value: number | string }[]; 
  onNodeClick: (n: NodeObject) => void;
  theme?: 'light' | 'dark';
}> = ({ title, items, onNodeClick, theme = 'dark' }) => {
    if (!items || items.length === 0) return null;
    
    const blockBorder = theme === 'dark' ? 'border-gray-850' : 'border-gray-200';
    const countText = theme === 'dark' ? 'text-cyan-500' : 'text-cyan-700';
    const textHover = theme === 'dark' ? 'group-hover:text-cyan-400' : 'group-hover:text-cyan-600';
    const rowHover = theme === 'dark' ? 'hover:bg-gray-800/40' : 'hover:bg-gray-100/50';

    return (
        <div className="mt-3">
            <h5 className={`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-r-2 ${blockBorder} pr-2`}>{title}</h5>
            <div className="space-y-1">
                {items.map((item, idx) => (
                    <div key={idx} className={`flex justify-between items-center text-[11px] group cursor-pointer ${rowHover} p-1 rounded transition-colors`} onClick={() => onNodeClick(item.node)}>
                        <span className={`text-gray-500 truncate max-w-[150px] ${textHover}`}>
                            {idx + 1}. {item.node.name || item.node.id}
                        </span>
                        <span className={`font-mono ${countText} font-bold`}>
                            {formatStatValue(item.value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NodeButtonList: React.FC<{ 
  nodes: NodeObject[]; 
  onNodeSelect: (n: NodeObject) => void; 
  colorClass?: string;
}> = ({ nodes, onNodeSelect, colorClass = "bg-cyan-900/20 text-cyan-500 border-cyan-900/30 hover:bg-cyan-800/30" }) => (
    <div className="flex flex-wrap gap-1">
        {nodes.map(node => (
            <button key={node.id} onClick={() => onNodeSelect(node)} className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${colorClass}`}>
                {node.name || node.id}
            </button>
        ))}
    </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({
  onFileSelect, onAnalyze, onDetectCommunities, onSampleSelect, error, analysisResult, isAnalyzing, isDetectingCommunities, hasGraphData, graphData,
  selectedNode, selectedNodeStats, onNodeSelect, onClearSelection, isAdvancedMode, onToggleAdvancedMode,
  isGedcom, onGenerateAiInsights, aiSummary, isGeneratingAi, lang, theme = 'dark'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const t = (key: any) => getTranslation(lang, key);

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim() || !graphData) return [];
    const query = searchQuery.toLowerCase();
    return graphData.nodes.filter(node => (node.name && node.name.toLowerCase().includes(query)) || node.id.toLowerCase().includes(query)).slice(0, 10);
  }, [searchQuery, graphData]);

  const activeModeBg = theme === 'dark' ? 'bg-gray-950/80 border-gray-800' : 'bg-gray-50/90 border-gray-200';
  const labelColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const sublabelColor = theme === 'dark' ? 'text-gray-600' : 'text-gray-400';
  const cardBgClass = theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const inputBgClass = theme === 'dark' ? 'bg-gray-950 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-800';

  return (
    <Card theme={theme} className={`flex flex-col h-full max-h-full overflow-hidden ${cardBgClass}`}>
      <div className="flex-grow flex flex-col min-h-0 overflow-y-auto p-3 md:p-5 space-y-6 md:space-y-8 custom-scrollbar overscroll-contain touch-pan-y">
          
          <div className="space-y-4 flex-shrink-0">
              <div className="flex flex-col gap-2">
                  <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} className="hidden" accept=".ged,.txt" />
                  <Button theme={theme} onClick={() => fileInputRef.current?.click()} icon={<UploadIcon className="w-4 h-4" />}>
                      {t('uploadFile')}
                  </Button>
                  
                  {isGedcom && (
                      <div className={`flex items-center justify-between ${activeModeBg} p-3 rounded-lg border shadow-inner group transition-all`}>
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-bold ${labelColor} uppercase tracking-tight`}>{t('advancedMode')}</span>
                            <span className={`text-[9px] ${sublabelColor}`}>{t('addPlacesAndDates')}</span>
                          </div>
                          <button 
                            onClick={onToggleAdvancedMode} 
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all focus:outline-none focus:ring-1 focus:ring-cyan-500 ${isAdvancedMode ? 'bg-cyan-600 shadow-[0_0_10px_rgba(8,145,178,0.4)]' : 'bg-gray-300'}`}
                          >
                              <span className={`${isAdvancedMode ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out`} />
                          </button>
                      </div>
                  )}

                  {hasGraphData && (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                          <Button theme={theme} onClick={onAnalyze} disabled={isAnalyzing} variant="secondary" icon={isAnalyzing ? <Spinner /> : <BarChart2Icon className="w-4 h-4" />}>
                              {isAnalyzing ? t('calculating') : t('calculateMetrics')}
                          </Button>
                          <Button theme={theme} onClick={onDetectCommunities} disabled={isDetectingCommunities} variant="secondary" icon={isDetectingCommunities ? <Spinner /> : <UsersIcon className="w-4 h-4" />}>
                              {isDetectingCommunities ? t('detecting') : t('communities')}
                          </Button>
                      </div>
                  )}
              </div>

              {hasGraphData && (
                  <div className="relative">
                      <div className={`absolute inset-y-0 ${lang === 'he' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
                          <SearchIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <input
                          type="text"
                          className={`block w-full ${lang === 'he' ? 'pl-9 pr-3' : 'pr-9 pl-3'} py-2 border rounded-md text-sm ${inputBgClass} focus:ring-1 focus:ring-cyan-500 focus:outline-none`}
                          placeholder={t('searchNode')}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && filteredNodes.length > 0 && (
                        <div className={`absolute mt-1 w-full border rounded-md shadow-2xl z-50 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                            {filteredNodes.map(node => (
                                <button key={node.id} className={`w-full text-start px-4 py-2 text-xs truncate ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-cyan-400' : 'text-gray-700 hover:bg-gray-100 hover:text-cyan-700'}`}
                                    onClick={() => { onNodeSelect(node); setSearchQuery(''); }}>
                                    {node.name || node.id}
                                </button>
                            ))}
                        </div>
                      )}
                  </div>
              )}

              {!hasGraphData && <SampleDataSelector onSelect={onSampleSelect} lang={lang} theme={theme} />}
          </div>

          {error && <div className="p-3 bg-red-900/20 border border-red-800/50 text-red-500 text-xs rounded-md">{error}</div>}

          {selectedNode && (
            <div className="animate-in fade-in slide-in-from-top-2 flex-shrink-0">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {t('selectedNodeType').replace('{type}', selectedNode.type || 'person')}
                    </h2>
                    <button onClick={onClearSelection} className="text-gray-500 hover:text-gray-300 dark:hover:text-white transition-colors">
                        <XCircleIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className={`p-3 rounded-lg border ${
                    theme === 'dark' 
                        ? 'bg-cyan-950/20 border-cyan-900/30' 
                        : 'bg-cyan-50/50 border-cyan-200/50'
                }`}>
                    <h3 className={`font-bold truncate text-sm mb-3 border-b pb-1 ${
                        theme === 'dark' ? 'text-cyan-400 border-cyan-900/20' : 'text-cyan-800 border-cyan-100'
                    }`}>
                        {selectedNode.name || selectedNode.id}
                    </h3>
                    {selectedNodeStats && (
                        <div className="space-y-0.5">
                            <StatItem theme={theme} label={t('degree')} value={selectedNodeStats.degree} highlight />
                            <StatItem theme={theme} label={t('reachability')} value={selectedNodeStats.reachableNodes} />
                            <StatItem theme={theme} label={t('averageDistance')} value={selectedNodeStats.averageDistance} />
                            <StatItem theme={theme} label={t('eccentricity')} value={selectedNodeStats.eccentricity} highlight />
                            <StatItem theme={theme} label={t('clusteringCoefficient')} value={selectedNodeStats.clusteringCoefficient} />
                        </div>
                    )}
                </div>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-8 animate-in fade-in duration-700">
                
                <div>
                    <h2 className={`text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-r-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} pr-2`}>
                        {t('networkSummaryTitle')}
                    </h2>
                    <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-950/40 border-gray-800/50' : 'bg-gray-50/70 border-gray-200/80'}`}>
                        <StatItem theme={theme} label={t('totalNodes')} value={analysisResult.nodeCount} />
                        <StatItem theme={theme} label={t('totalEdges')} value={analysisResult.edgeCount} />
                        <StatItem theme={theme} label={t('averageDegree')} value={analysisResult.averageDegree} tooltip={t('averageDegreeTooltip')} />
                        <StatItem theme={theme} label={t('networkDensity')} value={analysisResult.graphDensity} tooltip={t('networkDensityTooltip')} />
                        <StatItem theme={theme} label={t('transitivity')} value={analysisResult.transitivity} tooltip={t('transitivityTooltip')} />
                        <StatItem theme={theme} label={t('connectedComponents')} value={analysisResult.componentCount} tooltip={t('connectedComponentsTooltip')} />
                        {analysisResult.communities && (
                            <StatItem theme={theme} label={t('identifiedCommunities')} value={analysisResult.communities.length} highlight />
                        )}
                    </div>
                </div>

                <div>
                    <h2 className={`text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-r-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} pr-2`}>
                        {t('topologyTitle')}
                    </h2>
                    <div className={`rounded-lg p-3 border space-y-3 ${theme === 'dark' ? 'bg-gray-950/40 border-gray-800/50' : 'bg-gray-50/70 border-gray-200/80'}`}>
                        <div className="space-y-0.5">
                            <StatItem theme={theme} label={t('diameter')} value={analysisResult.diameter} tooltip={t('diameterTooltip')} />
                            <StatItem theme={theme} label={t('radius')} value={analysisResult.radius} tooltip={t('radiusTooltip')} />
                            <StatItem theme={theme} label={t('averageDistance')} value={analysisResult.averageShortestPath} />
                            <StatItem theme={theme} label={t('largestComponentSize')} value={analysisResult.largestComponentSize} />
                        </div>

                        {analysisResult.centerNodes && analysisResult.centerNodes.length > 0 && (
                            <div className={`pt-2 border-t ${theme === 'dark' ? 'border-gray-850' : 'border-gray-200'}`}>
                                <span className={`text-[10px] ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} flex items-center gap-1 mb-1 font-bold uppercase`}>
                                    {t('centerNodes')}
                                    <Tooltip theme={theme} content={t('centerNodesTooltip')}>
                                        <InfoIcon className="w-3 h-3 text-gray-500" />
                                    </Tooltip>
                                </span>
                                <NodeButtonList 
                                    nodes={analysisResult.centerNodes} 
                                    onNodeSelect={onNodeSelect} 
                                    colorClass={theme === 'dark' ? "bg-cyan-950/20 text-cyan-400 border-cyan-900/30 hover:bg-cyan-800/30" : "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100"}
                                />
                            </div>
                        )}

                        {analysisResult.peripheryNodes && analysisResult.peripheryNodes.length > 0 && (
                            <div className={`pt-2 border-t ${theme === 'dark' ? 'border-gray-850' : 'border-gray-200'}`}>
                                <span className="text-[10px] text-gray-500 flex items-center gap-1 mb-1 font-bold uppercase">
                                    {t('peripheryNodes')}
                                    <Tooltip theme={theme} content={t('peripheryNodesTooltip')}>
                                        <InfoIcon className="w-3 h-3 text-gray-500" />
                                    </Tooltip>
                                </span>
                                <NodeButtonList 
                                    nodes={analysisResult.peripheryNodes} 
                                    onNodeSelect={onNodeSelect} 
                                    colorClass={theme === 'dark' ? "bg-gray-800 text-gray-400 border-gray-750 hover:bg-gray-700" : "bg-gray-100 text-gray-600 border-gray-250 hover:bg-gray-200"} 
                                />
                            </div>
                        )}
                        
                        {analysisResult.articulationPoints && analysisResult.articulationPoints.length > 0 && (
                            <div className={`pt-2 border-t ${theme === 'dark' ? 'border-gray-850' : 'border-gray-200'}`}>
                                <span className={`text-[10px] ${theme === 'dark' ? 'text-amber-550' : 'text-amber-700'} flex items-center gap-1 mb-1 font-bold uppercase`}>
                                    {t('criticalNodes')}
                                    <Tooltip theme={theme} content={t('criticalNodesTooltip')}>
                                        <InfoIcon className="w-3 h-3 text-gray-500" />
                                    </Tooltip>
                                </span>
                                <NodeButtonList 
                                    nodes={analysisResult.articulationPoints} 
                                    onNodeSelect={onNodeSelect} 
                                    colorClass={theme === 'dark' ? "bg-amber-950/20 text-amber-400 border-amber-900/30 hover:bg-amber-800/35" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"} 
                                />
                            </div>
                        )}
                    </div>
                </div>

                <DegreeHistogram data={analysisResult.degreeDistribution || []} totalNodes={analysisResult.nodeCount} lang={lang} theme={theme} />

                {isGedcom && (
                    <div className="animate-in slide-in-from-right-2">
                        <h2 className={`text-[10px] font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'} uppercase tracking-widest mb-3 border-r-2 ${theme === 'dark' ? 'border-cyan-800' : 'border-cyan-300'} pr-2`}>
                            {t('genealogyTitle')}
                        </h2>
                        <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-cyan-950/5 border-cyan-900/30' : 'bg-cyan-50/20 border-cyan-200/50'}`}>
                            <StatItem theme={theme} label={t('pedigreeCollapse')} value={analysisResult.averagePedigreeCollapse} tooltip={t('pedigreeCollapseTooltip')} highlight />
                            <StatItem theme={theme} 
                                label={t('collapseOccurrences')} 
                                value={analysisResult.totalPedigreeCollapseOccurrences} 
                                tooltip={t('collapseOccurrencesTooltip')}
                            />
                            <StatItem theme={theme} label={t('branchingFactor')} value={analysisResult.averageBranchingFactor} tooltip={t('branchingFactorTooltip')} highlight />
                            <StatItem theme={theme} label={t('generationDepthMax')} value={analysisResult.maxGenerationalDepth} tooltip={t('generationDepthMaxTooltip')} />
                            <StatItem theme={theme} label={t('averageGenerationWidth')} value={analysisResult.averageGenerationWidth} />
                            <StatItem theme={theme} label={t('leafDepth')} value={analysisResult.averageLeafDepth} />
                            <StatItem theme={theme} 
                                label={t('surnameDiversity')} 
                                value={analysisResult.surnameDiversity} 
                                tooltip={t('surnameDiversityTooltip')} 
                                highlight 
                            />
                        </div>
                    </div>
                )}

                <div>
                    <h2 className={`text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-r-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} pr-2`}>
                        {t('centralityTitle')}
                    </h2>
                    <div className="space-y-4">
                        <RankingList theme={theme} title={t('betweennessRankTitle')} items={analysisResult.betweennessCentrality} onNodeClick={onNodeSelect} />
                        <RankingList theme={theme} title={t('degreeRankTitle')} items={analysisResult.centralityByConnections} onNodeClick={onNodeSelect} />
                        {isGedcom && (
                            <>
                                <RankingList theme={theme} title={t('descendantsRankTitle')} items={analysisResult.centralityByDescendants} onNodeClick={onNodeSelect} />
                                <RankingList theme={theme} title={t('ancestorsRankTitle')} items={analysisResult.centralityByAncestors} onNodeClick={onNodeSelect} />
                            </>
                        )}
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-850 pb-4">
                    <Button 
                      theme={theme}
                      onClick={onGenerateAiInsights} 
                      disabled={isGeneratingAi} 
                      className="bg-gradient-to-r from-purple-700 to-cyan-700 hover:from-purple-600 hover:to-cyan-600 border-none text-white shadow-lg" 
                      icon={isGeneratingAi ? <Spinner /> : <SparklesIcon className="w-4 h-4" />}
                    >
                        {isGeneratingAi ? t('analyzingPatterns') : t('geminiButtonText')}
                    </Button>
                    <div className="mt-2 text-center">
                        <a 
                            href="https://ai.google.dev/gemini-api/docs/billing" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[9px] text-gray-500 hover:text-cyan-500 transition-colors"
                        >
                            {t('billingInfoText')}
                        </a>
                    </div>
                    {aiSummary && (
                        <div className={`mt-4 p-4 border rounded-xl text-xs leading-relaxed shadow-2xl relative overflow-hidden ${
                            theme === 'dark' ? 'bg-gray-950 border-purple-900/40 text-gray-300' : 'bg-purple-50/40 border-purple-200 text-gray-800'
                        }`}>
                            <div className="flex items-center gap-2 mb-3 text-purple-600 dark:text-purple-450 font-bold uppercase tracking-widest text-[10px]">
                                <SparklesIcon className="w-3 h-3 animate-pulse" />
                                {t('systemicAnalysisSubject')}
                            </div>
                            <div className="whitespace-pre-wrap opacity-95">{aiSummary}</div>
                        </div>
                    )}
                </div>
            </div>
          )}
      </div>
    </Card>
  );
};

export default ControlPanel;
