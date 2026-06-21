
import React, { useRef, useState, useMemo } from 'react';
import { AnalysisResult, NodeObject, GraphData, NodeAnalysisResult } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import Spinner from './ui/Spinner';
import SampleDataSelector from './SampleDataSelector';
import Tooltip from './ui/Tooltip';
import { InfoIcon, UploadIcon, BarChart2Icon, XCircleIcon, SearchIcon, SparklesIcon, UsersIcon, AlertTriangleIcon } from './ui/Icons';

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

const StatItem: React.FC<{ label: string; value: React.ReactNode; tooltip?: string; highlight?: boolean }> = ({ label, value, tooltip, highlight }) => (
    <div className={`flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0 ${highlight ? 'bg-cyan-500/5 px-2 -mx-2 rounded' : ''}`}>
        <span className="text-xs text-gray-400 flex items-center gap-1">
            {label}
            {tooltip && (
                <Tooltip content={tooltip}>
                    <InfoIcon className="w-3.5 h-3.5 text-gray-600 cursor-help" />
                </Tooltip>
            )}
        </span>
        <span className={`text-sm font-bold ${highlight ? 'text-cyan-400' : 'text-white'}`}>
            {typeof value === 'object' && React.isValidElement(value) ? value : formatStatValue(value)}
        </span>
    </div>
);

const DegreeHistogram: React.FC<{ data: { degree: number; count: number }[], totalNodes: number }> = ({ data, totalNodes }) => {
    const [useLogScale, setUseLogScale] = useState(false);
    
    if (!data || data.length === 0) return null;
    
    const maxCount = Math.max(...data.map(d => d.count)) || 1;
    const mode = data.reduce((prev, current) => (prev.count > current.count) ? prev : current).degree;
    const avg = (data.reduce((acc, curr) => acc + (curr.degree * curr.count), 0) / totalNodes).toFixed(1);

    return (
        <div className="mt-4">
            <div className="flex items-center justify-between mb-3 border-r-2 border-cyan-500 pr-2">
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">התפלגות קשרים</h2>
                <button 
                    onClick={() => setUseLogScale(!useLogScale)}
                    className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${useLogScale ? 'bg-cyan-900/40 border-cyan-700 text-cyan-300' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                >
                    {useLogScale ? 'לוגריתמי' : 'ליניארי'}
                </button>
            </div>

            <div className="relative h-32 w-full bg-gray-950/50 rounded-lg border border-gray-800 p-3 shadow-inner overflow-hidden">
                <div className="flex items-end gap-1 h-full w-full overflow-x-auto pb-4 custom-scrollbar">
                    {data.map((d, i) => {
                        const rawRatio = d.count / maxCount;
                        const logRatio = Math.log10(d.count + 1) / Math.log10(maxCount + 1);
                        const heightPct = (useLogScale ? logRatio : rawRatio) * 100;
                        const percentage = ((d.count / totalNodes) * 100).toFixed(1);

                        return (
                            <div key={i} className="flex-1 min-w-[8px] h-full flex flex-col justify-end group/bar">
                                <Tooltip 
                                    className="h-full flex flex-col justify-end"
                                    content={
                                        <div className="text-center">
                                            <div className="font-bold text-cyan-400">{d.degree} קשרים</div>
                                            <div className="text-xs text-gray-300">{d.count} צמתים ({percentage}%)</div>
                                        </div>
                                    }
                                >
                                    <div 
                                        className="bg-gradient-to-t from-cyan-600/60 to-cyan-400 group-hover/bar:from-cyan-300 group-hover/bar:to-white transition-all rounded-t-[1px] w-full" 
                                        style={{ height: `${Math.max(heightPct, 2)}%` }} 
                                    />
                                </Tooltip>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-between text-[8px] text-gray-600 mt-1 font-mono">
                <span>דרגה שכיחה: {mode}</span>
                <span>דרגה ממוצעת: {avg}</span>
            </div>
        </div>
    );
};

const RankingList: React.FC<{ title: string; items?: { node: NodeObject; value: number | string }[]; onNodeClick: (n: NodeObject) => void }> = ({ title, items, onNodeClick }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mt-3">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-r-2 border-gray-700 pr-2">{title}</h5>
            <div className="space-y-1">
                {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] group cursor-pointer hover:bg-gray-800/40 p-1 rounded transition-colors" onClick={() => onNodeClick(item.node)}>
                        <span className="text-gray-500 truncate max-w-[150px] group-hover:text-cyan-400">
                            {idx + 1}. {item.node.name || item.node.id}
                        </span>
                        <span className="font-mono text-cyan-700 font-bold">
                            {formatStatValue(item.value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NodeButtonList: React.FC<{ nodes: NodeObject[], onNodeSelect: (n: NodeObject) => void, colorClass?: string }> = ({ nodes, onNodeSelect, colorClass = "bg-cyan-900/20 text-cyan-500 border-cyan-900/30 hover:bg-cyan-800/30" }) => (
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
  isGedcom, onGenerateAiInsights, aiSummary, isGeneratingAi
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim() || !graphData) return [];
    const query = searchQuery.toLowerCase();
    return graphData.nodes.filter(node => (node.name && node.name.toLowerCase().includes(query)) || node.id.toLowerCase().includes(query)).slice(0, 10);
  }, [searchQuery, graphData]);

  return (
    <Card className="flex flex-col h-full max-h-full overflow-hidden shadow-2xl bg-gray-900 border-gray-800">
      <div className="flex-grow flex flex-col min-h-0 overflow-y-auto p-3 md:p-5 space-y-6 md:space-y-8 custom-scrollbar overscroll-contain touch-pan-y">
          
          <div className="space-y-4 flex-shrink-0">
              <div className="flex flex-col gap-2">
                  <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} className="hidden" accept=".ged,.txt" />
                  <Button onClick={() => fileInputRef.current?.click()} icon={<UploadIcon className="w-4 h-4" />}>העלאת קובץ</Button>
                  
                  {isGedcom && (
                      <div className="flex items-center justify-between bg-gray-950/80 p-3 rounded-lg border border-gray-800 shadow-inner group transition-all hover:border-gray-700">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">מצב ניתוח מתקדם</span>
                            <span className="text-[9px] text-gray-600">הוספת מקומות ותאריכים</span>
                          </div>
                          <button 
                            onClick={onToggleAdvancedMode} 
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all focus:outline-none focus:ring-1 focus:ring-cyan-500 ${isAdvancedMode ? 'bg-cyan-600 shadow-[0_0_10px_rgba(8,145,178,0.4)]' : 'bg-gray-800'}`}
                          >
                              <span className={`${isAdvancedMode ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out`} />
                          </button>
                      </div>
                  )}

                  {hasGraphData && (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                          <Button onClick={onAnalyze} disabled={isAnalyzing} variant="secondary" icon={isAnalyzing ? <Spinner /> : <BarChart2Icon className="w-4 h-4" />}>
                              {isAnalyzing ? 'מנתח...' : 'חשב מדדים'}
                          </Button>
                          <Button onClick={onDetectCommunities} disabled={isDetectingCommunities} variant="secondary" icon={isDetectingCommunities ? <Spinner /> : <UsersIcon className="w-4 h-4" />}>
                              {isDetectingCommunities ? 'מזהה...' : 'קהילות'}
                          </Button>
                      </div>
                  )}
              </div>

              {hasGraphData && (
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <SearchIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <input
                          type="text"
                          className="block w-full pl-9 pr-3 py-2 border border-gray-800 rounded-md bg-gray-950 text-gray-300 placeholder-gray-700 focus:ring-1 focus:ring-cyan-900 text-sm"
                          placeholder="חפש צומת..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && filteredNodes.length > 0 && (
                        <div className="absolute mt-1 w-full bg-gray-900 border border-gray-800 rounded-md shadow-2xl z-50">
                            {filteredNodes.map(node => (
                                <button key={node.id} className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:bg-gray-800 hover:text-cyan-400 truncate"
                                    onClick={() => { onNodeSelect(node); setSearchQuery(''); }}>
                                    {node.name || node.id}
                                </button>
                            ))}
                        </div>
                      )}
                  </div>
              )}

              {!hasGraphData && <SampleDataSelector onSelect={onSampleSelect} />}
          </div>

          {error && <div className="p-3 bg-red-900/20 border border-red-800/50 text-red-400 text-xs rounded-md">{error}</div>}

          {selectedNode && (
            <div className="animate-in fade-in slide-in-from-top-2 flex-shrink-0">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">צומת נבחר: {selectedNode.type}</h2>
                    <button onClick={onClearSelection} className="text-gray-600 hover:text-white"><XCircleIcon className="w-4 h-4" /></button>
                </div>
                <div className="bg-cyan-950/20 p-3 rounded-lg border border-cyan-900/30">
                    <h3 className="font-bold text-cyan-400 truncate text-sm mb-3 border-b border-cyan-900/20 pb-1">{selectedNode.name || selectedNode.id}</h3>
                    {selectedNodeStats && (
                        <div className="space-y-0.5">
                            <StatItem label="דרגת קשר (Degree)" value={selectedNodeStats.degree} highlight />
                            <StatItem label="נגישות ברשת" value={selectedNodeStats.reachableNodes} />
                            <StatItem label="מרחק ממוצע" value={selectedNodeStats.averageDistance} />
                            <StatItem label="אקסצנטריות" value={selectedNodeStats.eccentricity} highlight />
                            <StatItem label="מקדם צבירה" value={selectedNodeStats.clusteringCoefficient} />
                        </div>
                    )}
                </div>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-8 animate-in fade-in duration-700">
                
                <div>
                    <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-r-2 border-gray-700 pr-2">1. סיכום רשת</h2>
                    <div className="bg-gray-950/40 rounded-lg p-3 border border-gray-800/50">
                        <StatItem label="סה״כ צמתים" value={analysisResult.nodeCount} />
                        <StatItem label="סה״כ קשרים" value={analysisResult.edgeCount} />
                        <StatItem label="דרגה ממוצעת" value={analysisResult.averageDegree} tooltip="מספר הקשרים הממוצע לכל צומת ברשת." />
                        <StatItem label="צפיפות הרשת" value={analysisResult.graphDensity} tooltip="היחס בין קשרים קיימים לאפשריים." />
                        <StatItem label="טרנזיטיביות" value={analysisResult.transitivity} tooltip="הסיכוי ששני שכנים של צומת מסוים מחוברים גם ביניהם (מקדם צבירה גלובלי)." />
                        <StatItem label="רכיבי קישוריות" value={analysisResult.componentCount} tooltip="מספר תת-קבוצות מנותקות ברשת." />
                        {analysisResult.communities && (
                            <StatItem label="קהילות שזוהו" value={analysisResult.communities.length} highlight />
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-r-2 border-gray-700 pr-2">2. טופולוגיה וממנה</h2>
                    <div className="bg-gray-950/40 rounded-lg p-3 border border-gray-800/50 space-y-3">
                        <div className="space-y-0.5">
                            <StatItem label="קוטר (Diameter)" value={analysisResult.diameter} tooltip="המרחק המקסימלי בין שני צמתים ברשת." />
                            <StatItem label="רדיוס (Radius)" value={analysisResult.radius} tooltip="המרחק המינימלי שבו צומת כלשהו נמצא מכל שאר הצמתים." />
                            <StatItem label="מרחק ממוצע" value={analysisResult.averageShortestPath} />
                            <StatItem label="גודל רכיב ראשי" value={analysisResult.largestComponentSize} />
                        </div>

                        {analysisResult.centerNodes && analysisResult.centerNodes.length > 0 && (
                            <div className="pt-2 border-t border-gray-800">
                                <span className="text-[10px] text-cyan-500 flex items-center gap-1 mb-1 font-bold uppercase">
                                    צמתי מרכז (Center):
                                    <Tooltip content="הצמתים הנגישים ביותר ברשת (בעלי האקסצנטריות המינימלית). בעצים לרוב יהיו 1-2 בלבד.">
                                        <InfoIcon className="w-3 h-3 text-gray-600" />
                                    </Tooltip>
                                </span>
                                <NodeButtonList nodes={analysisResult.centerNodes} onNodeSelect={onNodeSelect} />
                            </div>
                        )}

                        {analysisResult.peripheryNodes && analysisResult.peripheryNodes.length > 0 && (
                            <div className="pt-2 border-t border-gray-800">
                                <span className="text-[10px] text-gray-500 flex items-center gap-1 mb-1 font-bold uppercase">
                                    צמתי פריפריה (Periphery):
                                    <Tooltip content="הצמתים המרוחקים ביותר ברשת (מרחקם שווה לקוטר הגרף).">
                                        <InfoIcon className="w-3 h-3 text-gray-600" />
                                    </Tooltip>
                                </span>
                                <NodeButtonList nodes={analysisResult.peripheryNodes} onNodeSelect={onNodeSelect} colorClass="bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700" />
                            </div>
                        )}
                        
                        {analysisResult.articulationPoints && analysisResult.articulationPoints.length > 0 && (
                            <div className="pt-2 border-t border-gray-800">
                                <span className="text-[10px] text-amber-600 flex items-center gap-1 mb-1 font-bold uppercase">
                                    צמתים קריטיים (Articulation):
                                    <Tooltip content="צמתים שהסרתם תגרום לפירוק הרשת למספר רכיבים מנותקים.">
                                        <InfoIcon className="w-3 h-3 text-gray-600" />
                                    </Tooltip>
                                </span>
                                <NodeButtonList nodes={analysisResult.articulationPoints} onNodeSelect={onNodeSelect} colorClass="bg-amber-900/20 text-amber-500 border-amber-900/30 hover:bg-amber-800/30" />
                            </div>
                        )}
                    </div>
                </div>

                <DegreeHistogram data={analysisResult.degreeDistribution || []} totalNodes={analysisResult.nodeCount} />

                {isGedcom && (
                    <div className="animate-in slide-in-from-right-2">
                        <h2 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-3 border-r-2 border-cyan-800 pr-2">4. מבנה גנאלוגי</h2>
                        <div className="bg-cyan-950/10 rounded-lg p-3 border border-cyan-900/30">
                            <StatItem label="קריסת שושלת (PCI)" value={analysisResult.averagePedigreeCollapse} tooltip="מדד לזיווג קרובי משפחה. ערך גבוה מעיד על הופעת אבות קדמונים משותפים במספר ענפים." highlight />
                            <StatItem 
                                label="אירועי קריסה מזוהים" 
                                value={analysisResult.totalPedigreeCollapseOccurrences} 
                                tooltip="המספר הכולל של צמתים המהווים אבות קדמונים משותפים בקרב זוגות הורים."
                            />
                            <StatItem label="מקדם הסתעפות" value={analysisResult.averageBranchingFactor} tooltip="ממוצע הצאצאים לכל הורה שתועד. מדד לקצב הגידול של המשפחה." highlight />
                            <StatItem label="עומק דורות (Max)" value={analysisResult.maxGenerationalDepth} tooltip="מספר הדורות המקסימלי מאב קדמון לצאצא האחרון שלו." />
                            <StatItem label="רוחב דור ממוצע" value={analysisResult.averageGenerationWidth} />
                            <StatItem label="עומק ענפים (Leaf Depth)" value={analysisResult.averageLeafDepth} />
                            <StatItem 
                                label="מגוון שמות משפחה" 
                                value={analysisResult.surnameDiversity} 
                                tooltip="היחס בין מספר שמות המשפחה השונים למספר האנשים. יחס נמוך מעיד על שושלת סגורה." 
                                highlight 
                            />
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-r-2 border-gray-700 pr-2">5. דירוגי השפעה ומרכזיות</h2>
                    <div className="space-y-4">
                        <RankingList title="מרכזיות ביניים (מתווכים)" items={analysisResult.betweennessCentrality} onNodeClick={onNodeSelect} />
                        <RankingList title="מרכזיות דרגה (פופולריות)" items={analysisResult.centralityByConnections} onNodeClick={onNodeSelect} />
                        {isGedcom && (
                            <>
                                <RankingList title="מספר צאצאים כולל" items={analysisResult.centralityByDescendants} onNodeClick={onNodeSelect} />
                                <RankingList title="מספר אבות קדמונים" items={analysisResult.centralityByAncestors} onNodeClick={onNodeSelect} />
                            </>
                        )}
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-800 pb-4">
                    <Button onClick={onGenerateAiInsights} disabled={isGeneratingAi} className="bg-gradient-to-r from-purple-700 to-cyan-700 hover:from-purple-600 hover:to-cyan-600 border-none" icon={isGeneratingAi ? <Spinner /> : <SparklesIcon className="w-4 h-4" />}>
                        {isGeneratingAi ? 'מנתח תבניות...' : 'תובנות Gemini AI'}
                    </Button>
                    {/* Fix: Added mandatory link to billing documentation as per guidelines */}
                    <div className="mt-2 text-center">
                        <a 
                            href="https://ai.google.dev/gemini-api/docs/billing" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[9px] text-gray-500 hover:text-cyan-400 transition-colors"
                        >
                            מידע על חיוב ושימוש במפתחות בתשלום
                        </a>
                    </div>
                    {aiSummary && (
                        <div className="mt-4 p-4 bg-gray-950 border border-purple-900/30 rounded-xl text-xs text-gray-300 leading-relaxed shadow-2xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-3 text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                                <SparklesIcon className="w-3 h-3 animate-pulse" />
                                ניתוח מערכתי
                            </div>
                            <div className="whitespace-pre-wrap opacity-90">{aiSummary}</div>
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
