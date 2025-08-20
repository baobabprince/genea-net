import React, { useRef } from 'react';
import { AnalysisResult, NodeObject, CentralityResult, DegreeDistributionResult, GraphData } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import Spinner from './ui/Spinner';
import SampleDataSelector from './SampleDataSelector';
import Tooltip from './ui/Tooltip';
import { InfoIcon, AlertTriangleIcon, UploadIcon, BarChart2Icon, XCircleIcon } from './ui/Icons';

interface ControlPanelProps {
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  onSampleSelect: (content: string, type: 'ged' | 'txt') => void;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  hasGraphData: boolean;
  graphData: GraphData | null;
  selectedNode: NodeObject | null;
  onNodeSelect: (node: NodeObject) => void;
  onClearSelection: () => void;
}

const StatItem: React.FC<{ label: string; value: React.ReactNode; tooltip?: string }> = ({ label, value, tooltip }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-700 last:border-b-0">
        <span className="text-sm text-gray-400 flex items-center gap-1.5">
            {label}
            {tooltip && (
                <Tooltip content={tooltip}>
                    <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                </Tooltip>
            )}
        </span>
        <span className="text-base font-semibold text-white">{String(value)}</span>
    </div>
);

const ListStatItem: React.FC<{ label: string; items: NodeObject[]; emptyText?: string; tooltip?: string }> = ({ label, items, emptyText = "None found", tooltip }) => (
    <div className="py-2.5 border-b border-gray-700 last:border-b-0">
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 flex items-center gap-1.5">
                {label}
                {tooltip && (
                    <Tooltip content={tooltip}>
                        <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                    </Tooltip>
                )}
            </span>
        </div>
        {items.length > 0 ? (
            <ul className="mt-1.5 pl-1 space-y-1">
                {items.map(item => (
                    <li key={item.id} className="text-sm text-gray-300 bg-gray-700 bg-opacity-50 px-2 py-1 rounded truncate" title={item.name || item.id}>
                       {item.name || item.id}
                    </li>
                ))}
            </ul>
        ) : (
            <p className="mt-1 text-sm text-right text-gray-500">{emptyText}</p>
        )}
    </div>
);

const RankedStatItem: React.FC<{ label: string; items: CentralityResult[]; emptyText?: string; tooltip?: string }> = ({ label, items, emptyText = "Not applicable", tooltip }) => (
     <div className="py-2.5 border-b border-gray-700 last:border-b-0">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-400 flex items-center gap-1.5">
                {label}
                {tooltip && (
                     <Tooltip content={tooltip}>
                        <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                    </Tooltip>
                )}
            </span>
        </div>
        {items && items.length > 0 && items.some(i => i.value > 0) ? (
             <ol className="mt-1.5 pl-1 space-y-1">
                {items.map((item, index) => item.value > 0 && (
                    <li key={item.node.id} className="text-sm text-gray-300 bg-gray-700 bg-opacity-50 px-2 py-1 rounded flex justify-between items-center" title={item.node.name || item.node.id}>
                       <span className="truncate pr-2">{index + 1}. {item.node.name || item.node.id}</span>
                       <span className="font-semibold text-cyan-400 flex-shrink-0">{item.value.toFixed(2)}</span>
                    </li>
                ))}
            </ol>
        ) : (
             <p className="mt-1 text-sm text-right text-gray-500">{emptyText}</p>
        )}
    </div>
);

const DistributionStatItem: React.FC<{ label: string; items: DegreeDistributionResult[]; tooltip?: string }> = ({ label, items, tooltip }) => {
    if (!items || items.length === 0) {
        return (
             <div className="py-2.5 border-b border-gray-700 last:border-b-0">
                 <div className="flex justify-between items-center">
                     <span className="text-sm text-gray-400 flex items-center gap-1.5">
                        {label}
                        {tooltip && (
                            <Tooltip content={tooltip}>
                                <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                            </Tooltip>
                        )}
                     </span>
                     <p className="text-sm text-gray-500">Not applicable</p>
                 </div>
             </div>
        );
    }

    const maxCount = Math.max(...items.map(i => i.count), 0);

    return (
        <div className="py-2.5 border-b border-gray-700 last:border-b-0">
           <div className="flex justify-between items-center mb-2">
               <span className="text-sm text-gray-400 flex items-center gap-1.5">
                   {label}
                   {tooltip && (
                        <Tooltip content={tooltip}>
                           <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                       </Tooltip>
                   )}
               </span>
           </div>
           <div className="space-y-1.5 text-xs text-gray-400">
               <div className="flex items-center gap-2 text-gray-500">
                   <div className="w-12 font-mono text-right flex-shrink-0">Degree</div>
                   <div className="flex-grow text-center">Node Count</div>
               </div>
               {items.map(item => (
                   <div key={item.degree} className="flex items-center gap-2" title={`${item.count} nodes have ${item.degree} connections (degree)`}>
                       <div className="w-12 font-mono text-right flex-shrink-0">{item.degree}</div>
                       <div className="flex-grow bg-gray-700 bg-opacity-50 rounded-sm h-4">
                           <div
                               className="bg-cyan-600 h-4 rounded-sm transition-all duration-500 text-right pr-1 text-white/80 font-semibold"
                               style={{ width: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%' }}
                           >
                            {item.count}
                           </div>
                       </div>
                   </div>
               ))}
           </div>
       </div>
    );
};


const ControlPanel: React.FC<ControlPanelProps> = ({
  onFileSelect,
  onAnalyze,
  onSampleSelect,
  analysisResult,
  isLoading,
  error,
  hasGraphData,
  graphData,
  selectedNode,
  onNodeSelect,
  onClearSelection
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
    e.target.value = '';
  };

  const getSelectedNodeDetails = () => {
    if (!selectedNode || !graphData) return null;

    const neighbors = new Set<string>();
    graphData.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? (link.source as NodeObject).id : link.source;
        const targetId = typeof link.target === 'object' ? (link.target as NodeObject).id : link.target;
        if(sourceId === selectedNode.id) neighbors.add(targetId);
        if(targetId === selectedNode.id) neighbors.add(sourceId);
    });

    const nodeMap = new Map(graphData.nodes.map(n => [n.id, n]));
    const neighborNodes = Array.from(neighbors).map(id => nodeMap.get(id)).filter(Boolean) as NodeObject[];

    return {
        degree: neighbors.size,
        neighbors: neighborNodes
    };
  };

  const nodeDetails = getSelectedNodeDetails();

  return (
    <Card className="flex flex-col h-full p-5 overflow-y-auto">
      <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">Controls</h2>
            <div className="flex flex-col gap-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".gdcom,.ged,.txt"
                />
                <Button onClick={handleFileClick} icon={<UploadIcon />}>
                    Upload Graph File
                </Button>
                <Button onClick={onAnalyze} disabled={!hasGraphData || isLoading} icon={isLoading ? <Spinner /> : <BarChart2Icon />}>
                    {isLoading ? 'Analyzing...' : 'Run Analysis'}
                </Button>
            </div>
        </div>
        <div>
            <h2 className="text-xl font-bold text-white mb-3">Sample Datasets</h2>
            <SampleDataSelector onSelect={onSampleSelect} />
        </div>
      </div>
      
      {selectedNode && nodeDetails && (
        <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-white">Selected Node</h2>
                <button onClick={onClearSelection} className="text-gray-500 hover:text-white transition-colors">
                    <XCircleIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="bg-gray-700 bg-opacity-50 p-3 rounded-md">
                <h3 className="font-bold text-cyan-400 truncate" title={selectedNode.name || selectedNode.id}>
                    {selectedNode.name || selectedNode.id}
                </h3>
                <p className="text-sm text-gray-400">Degree: {nodeDetails.degree}</p>
                
                {nodeDetails.neighbors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                        <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Neighbors ({nodeDetails.neighbors.length})</h4>
                        <ul className="max-h-32 overflow-y-auto space-y-1 pr-1">
                            {nodeDetails.neighbors.map(n => (
                                <li key={n.id}>
                                    <button onClick={() => onNodeSelect(n)} className="w-full text-left text-sm text-gray-300 hover:text-cyan-400 truncate bg-gray-600 bg-opacity-50 px-2 py-1 rounded">
                                        {n.name || n.id}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
      )}

      <div className="flex-shrink-0 mt-6 pt-6 border-t border-gray-700 space-y-4">
        <div>
            <h2 className="text-xl font-bold text-white mb-2">Analysis Results</h2>
            {error && (
                <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 p-3 rounded-md flex items-start gap-3 my-4">
                    <AlertTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Error</h3>
                      <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}
            {analysisResult ? (
              <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider pt-2 pb-1">Basic Stats</h3>
                  <StatItem label="Nodes" value={analysisResult.nodeCount} tooltip="The total number of unique items (nodes) in the network. For example, in a character network, each character is a node." />
                  <StatItem label="Edges" value={analysisResult.edgeCount} tooltip="The total number of connections (edges) between nodes. In a family tree, an edge might represent a marriage or a parent-child link." />
                  <StatItem 
                      label="Graph Density" 
                      value={analysisResult.graphDensity} 
                      tooltip="Measures how many of the possible connections in a network actually exist (from 0 to 1). A high density suggests a tightly-knit group, while a low density indicates a sparse network."
                  />
                  
                  <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider pt-3 pb-1">Connectivity &amp; Structure</h3>
                  <StatItem 
                    label="Is Connected" 
                    value={analysisResult.isConnected ? 'Yes' : 'No'}
                    tooltip="Indicates if it's possible to get from any node to any other node in the graph. If 'No', the graph is fragmented into multiple disconnected components."
                  />
                  <StatItem label="Connected Components" value={analysisResult.componentCount} tooltip="A count of the separate, self-contained 'islands' or sub-graphs within the network. A fully connected graph has only one component." />
                  <StatItem 
                      label="Largest Component" 
                      value={`${analysisResult.largestComponentSize} nodes`}
                      tooltip="The number of nodes in the biggest connected 'island' of the graph. Advanced metrics like Diameter are calculated for this component, as they are not meaningful for disconnected graphs."
                  />
                  <StatItem 
                      label="Diameter"
                      value={analysisResult.diameter}
                      tooltip="The longest 'shortest path' between any two nodes in the largest component. It represents the 'width' of the network—the greatest number of steps required to connect the two most remote nodes."
                  />
                  <StatItem 
                      label="Avg. Shortest Path" 
                      value={analysisResult.averageShortestPath}
                      tooltip="The average number of steps it takes to get from any one node to any other within the largest component. A low number suggests a highly efficient network where information can travel quickly."
                  />
                  
                  <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider pt-3 pb-1">Centrality &amp; Influence</h3>
                  {analysisResult.centralityByConnections && <RankedStatItem
                      label="Top 5 by Connections"
                      items={analysisResult.centralityByConnections}
                      tooltip="Lists the top 5 nodes based on their number of direct links (degree). These are often the most immediately influential or 'popular' nodes in the network."
                  />}
                  {analysisResult.betweennessCentrality && <RankedStatItem
                      label="Top 5 by Betweenness"
                      items={analysisResult.betweennessCentrality}
                      tooltip="Identifies the top 5 'bridge' nodes that frequently lie on the shortest communication paths between other nodes. Removing these nodes could seriously disrupt the network's flow."
                      emptyText="N/A"
                  />}
                  {analysisResult.centralityByDescendants && <RankedStatItem
                      label="Top 5 by Descendants"
                      items={analysisResult.centralityByDescendants}
                      tooltip="For genealogical trees, this ranks individuals by the total number of their unique descendants (children, grandchildren, etc.). It highlights prolific family lines."
                  />}
                  {analysisResult.centralityByAncestors && <RankedStatItem
                      label="Top 5 by Ancestors"
                      items={analysisResult.centralityByAncestors}
                      tooltip="For genealogical trees, this ranks individuals by the total number of their unique ancestors (parents, grandparents, etc.). A high count can indicate a deep and well-documented lineage."
                  />}
                  {analysisResult.degreeDistribution && <DistributionStatItem
                      label="Degree Distribution"
                      items={analysisResult.degreeDistribution}
                      tooltip="Shows how many nodes have a certain number of connections. This helps understand the graph's structure, for example, if it's dominated by a few highly connected hubs or if connections are spread out evenly."
                  />}
                  <ListStatItem 
                      label="Top 5 Articulation Points"
                      items={analysisResult.articulationPoints}
                      tooltip="Lists up to 5 of the most critical single points of failure in the network. Removing one of these 'cut vertices' would break its component into separate, disconnected pieces, highlighting structural weaknesses."
                  />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Run analysis to see results.</p>
              </div>
            )}
        </div>
      </div>
    </Card>
  );
};

export default ControlPanel;