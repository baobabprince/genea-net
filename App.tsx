
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GraphData, AnalysisResult, NodeObject, NodeAnalysisResult } from './types';
import { parseEdgeList, parseGedcom } from './services/graphService';
import ControlPanel from './components/ControlPanel';
import GraphVisualizer from './components/GraphVisualizer';
import GraphLegend from './components/GraphLegend';
import { UploadIcon, GraphIcon } from './components/ui/Icons';
import { GoogleGenAI } from "@google/genai";
import { Language, getTranslation } from './utils/localization';

const GRAPH_WORKER_CODE = `
const bfs = (startNodeId, adjacencyList) => {
  const distances = new Map([[startNodeId, 0]]);
  const queue = [startNodeId];
  let maxDistance = 0;
  let totalDistance = 0;
  
  let head = 0;
  while(head < queue.length) {
    const currentNodeId = queue[head++];
    const currentDistance = distances.get(currentNodeId);

    if (currentDistance > maxDistance) maxDistance = currentDistance;
    totalDistance += currentDistance;

    const neighbors = adjacencyList.get(currentNodeId) || [];
    for (let i = 0; i < neighbors.length; i++) {
      const neighborId = neighbors[i];
      if (!distances.has(neighborId)) {
        distances.set(neighborId, currentDistance + 1);
        queue.push(neighborId);
      }
    }
  }
  return { distances, maxDistance, totalDistance, reachableCount: distances.size };
};

const findConnectedComponents = (graphData, adjacencyList) => {
    const components = [];
    const visited = new Set();
    for(const node of graphData.nodes) {
        if(!visited.has(node.id)) {
            const component = [];
            const queue = [node.id];
            visited.add(node.id);
            let head = 0;
            while(head < queue.length) {
                const u = queue[head++];
                component.push(u);
                for(const v of adjacencyList.get(u) || []) {
                    if(!visited.has(v)) {
                        visited.add(v);
                        queue.push(v);
                    }
                }
            }
            components.push(component);
        }
    }
    return components;
};

const detectCommunities = (graphData, adjacencyList) => {
    const nodes = graphData.nodes.map(n => n.id);
    if (nodes.length === 0) return [];

    let labels = new Map();
    nodes.forEach(id => labels.set(id, id));

    let changed = true;
    let iterations = 0;
    const maxIterations = 15;

    while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;
        const shuffled = nodes.slice().sort(() => Math.random() - 0.5);

        for (const nodeId of shuffled) {
            const neighbors = adjacencyList.get(nodeId) || [];
            if (neighbors.length === 0) continue;

            const counts = new Map();
            for (const neighborId of neighbors) {
                const label = labels.get(neighborId);
                counts.set(label, (counts.get(label) || 0) + 1);
            }

            let maxCount = 0;
            let bestLabels = [];
            for (const [label, count] of counts.entries()) {
                if (count > maxCount) {
                    maxCount = count;
                    bestLabels = [label];
                } else if (count === maxCount) {
                    bestLabels.push(label);
                }
            }

            const newLabel = bestLabels[Math.floor(Math.random() * bestLabels.length)];
            if (labels.get(nodeId) !== newLabel) {
                labels.set(nodeId, newLabel);
                changed = true;
            }
        }
    }

    const communityGroups = new Map();
    labels.forEach((label, nodeId) => {
        if (!communityGroups.has(label)) communityGroups.set(label, []);
        communityGroups.get(label).push(nodeId);
    });

    const nodeMap = new Map(graphData.nodes.map(n => [n.id, n]));
    return Array.from(communityGroups.values())
        .map(ids => ids.map(id => nodeMap.get(id)))
        .sort((a, b) => b.length - a.length);
};

const calculateTransitivity = (adjacencyList) => {
    let triplets = 0;
    let closedTriplets = 0;
    
    for (const [nodeId, neighbors] of adjacencyList.entries()) {
        const k = neighbors.length;
        if (k < 2) continue;
        
        triplets += (k * (k - 1)) / 2;
        
        for (let i = 0; i < k; i++) {
            for (let j = i + 1; j < k; j++) {
                const n1 = neighbors[i];
                const n2 = neighbors[j];
                const n1Neighbors = adjacencyList.get(n1) || [];
                if (n1Neighbors.includes(n2)) {
                    closedTriplets++;
                }
            }
        }
    }
    return triplets > 0 ? (closedTriplets / triplets) : 0;
};

const calculateBetweennessCentrality = (nodeIds, adjacencyList, isSampled = false) => {
    const centrality = new Map();
    nodeIds.forEach(id => centrality.set(id, 0));

    const sources = isSampled ? nodeIds.sort(() => 0.5 - Math.random()).slice(0, 200) : nodeIds;

    for (const s of sources) {
        const stack = [];
        const predecessors = new Map();
        const sigma = new Map();
        const dist = new Map();
        
        nodeIds.forEach(id => {
            predecessors.set(id, []);
            sigma.set(id, 0);
            dist.set(id, -1);
        });

        sigma.set(s, 1);
        dist.set(s, 0);
        const queue = [s];

        let head = 0;
        while (head < queue.length) {
            const v = queue[head++];
            stack.push(v);
            for (const w of adjacencyList.get(v) || []) {
                if (dist.get(w) < 0) {
                    dist.set(w, dist.get(v) + 1);
                    queue.push(w);
                }
                if (dist.get(w) === dist.get(v) + 1) {
                    sigma.set(w, sigma.get(w) + sigma.get(v));
                    predecessors.get(w).push(v);
                }
            }
        }

        const delta = new Map();
        nodeIds.forEach(id => delta.set(id, 0));

        while (stack.length > 0) {
            const w = stack.pop();
            for (const v of predecessors.get(w)) {
                delta.set(v, delta.get(v) + (sigma.get(v) / sigma.get(w)) * (1 + delta.get(w)));
            }
            if (w !== s) {
                centrality.set(w, centrality.get(w) + delta.get(w));
            }
        }
    }

    return Array.from(centrality.entries())
        .map(([id, val]) => ({ id, value: isSampled ? val : val / 2 }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
};

const getAncestorsIterative = (startId, parentMap) => {
    const ancestors = new Set();
    const stack = [startId];
    const visited = new Set();
    while (stack.length > 0) {
        const curr = stack.pop();
        if (visited.has(curr)) continue;
        visited.add(curr);
        if (curr !== startId) ancestors.add(curr);
        const parents = parentMap.get(curr) || [];
        stack.push(...parents);
    }
    return ancestors;
};

const calculatePedigreeCollapse = (graphData) => {
    const nodes = graphData.nodes;
    if (nodes.length > 4000) return { avg: 'N/A (Too Large)', count: 0 };
    
    const parentMap = new Map();
    const childToParents = new Map();
    
    graphData.links.forEach(l => {
        if (l.type === 'parent-child') {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t = typeof l.target === 'object' ? l.target.id : l.target;
            if (!parentMap.has(t)) parentMap.set(t, []);
            parentMap.get(t).push(s);
            
            if (!childToParents.has(t)) childToParents.set(t, []);
            childToParents.get(t).push(s);
        }
    });

    const parentalPairs = new Set();
    childToParents.forEach((parents) => {
        if (parents.length >= 2) {
            const sorted = [...parents].sort();
            for (let i = 0; i < sorted.length; i++) {
                for (let j = i + 1; j < sorted.length; j++) {
                    parentalPairs.add(sorted[i] + "|||" + sorted[j]);
                }
            }
        }
    });

    let collapseEvents = 0;
    const memoAncestors = new Map();

    parentalPairs.forEach(pairStr => {
        const [p1, p2] = pairStr.split("|||");
        
        if (!memoAncestors.has(p1)) memoAncestors.set(p1, getAncestorsIterative(p1, parentMap));
        if (!memoAncestors.has(p2)) memoAncestors.set(p2, getAncestorsIterative(p2, parentMap));
        
        const ancestors1 = memoAncestors.get(p1);
        const ancestors2 = memoAncestors.get(p2);
        
        for (let anc of ancestors1) {
            if (ancestors2.has(anc)) {
                // We count every path that joins back to a common ancestor
                // instead of breaking on the first match.
                collapseEvents++;
            }
        }
    });

    return { 
        avg: parentalPairs.size > 0 ? (collapseEvents / parentalPairs.size).toFixed(4) : "0", 
        count: collapseEvents 
    };
};

const findArticulationPoints = (componentNodeIds, adjacencyList) => {
    const points = new Set();
    const visited = new Set();
    const discoveryTimes = new Map();
    const lowLinkValues = new Map();
    const parent = new Map();
    let time = 0;

    const dfs = (u) => {
        visited.add(u);
        discoveryTimes.set(u, time);
        lowLinkValues.set(u, time);
        time++;
        let children = 0;
        
        const neighbors = adjacencyList.get(u) || [];
        for (const v of neighbors) {
            if (v === parent.get(u)) continue;
            if (visited.has(v)) {
                lowLinkValues.set(u, Math.min(lowLinkValues.get(u), discoveryTimes.get(v)));
            } else {
                children++;
                parent.set(v, u);
                dfs(v);
                lowLinkValues.set(u, Math.min(lowLinkValues.get(u), lowLinkValues.get(v)));
                if (parent.get(u) === null && children > 1) points.add(u);
                if (parent.get(u) !== null && lowLinkValues.get(v) >= discoveryTimes.get(u)) points.add(u);
            }
        }
    };

    for (const nodeId of componentNodeIds) {
        if (!visited.has(nodeId)) {
            parent.set(nodeId, null);
            dfs(nodeId);
        }
    }
    return Array.from(points);
};

const analyzeGraph = (graphData, adjacencyList) => {
    const nodeCount = graphData.nodes.length;
    const edgeCount = graphData.links.length;
    const isLarge = nodeCount >= 5000;
    const isGedcom = graphData.links.some(l => l.type === 'parent-child' || l.type === 'marriage');
    const nodeMap = new Map(graphData.nodes.map(n => [n.id, n]));

    const components = findConnectedComponents(graphData, adjacencyList);
    const largestComponent = components.reduce((l, c) => c.length > l.length ? c : l, []);

    let diameter = 0;
    let radius = 0;
    let centerNodes = [];
    let peripheryNodes = [];
    let avgPath = 0;

    if (largestComponent.length > 1) {
        const sampleSize = isLarge ? 100 : Math.min(largestComponent.length, 500);
        const pivots = largestComponent.slice().sort(() => 0.5 - Math.random()).slice(0, sampleSize);
        
        let totalPathSum = 0;
        let totalPairs = 0;
        let maxFoundDist = 0;
        const eccentricities = new Map();

        for (const startId of pivots) {
            const { maxDistance, totalDistance, reachableCount } = bfs(startId, adjacencyList);
            eccentricities.set(startId, maxDistance);
            maxFoundDist = Math.max(maxFoundDist, maxDistance);
            totalPathSum += totalDistance;
            totalPairs += (reachableCount - 1);
        }

        diameter = maxFoundDist;
        avgPath = totalPairs > 0 ? (totalPathSum / totalPairs) : 0;
        
        const validEccValues = Array.from(eccentricities.values());
        radius = Math.min(...validEccValues);
        
        for (const [id, ecc] of eccentricities.entries()) {
            if (ecc === radius) centerNodes.push(nodeMap.get(id));
            if (ecc === diameter) peripheryNodes.push(nodeMap.get(id));
        }
    }

    const degreeCounts = new Map();
    for (const neighbors of adjacencyList.values()) {
        const degree = neighbors.length;
        degreeCounts.set(degree, (degreeCounts.get(degree) || 0) + 1);
    }
    const degreeDistribution = Array.from(degreeCounts.entries())
        .map(([degree, count]) => ({ degree, count }))
        .sort((a, b) => a.degree - b.degree);

    const articulationPoints = findArticulationPoints(largestComponent, adjacencyList)
        .slice(0, 10)
        .map(id => nodeMap.get(id));

    const result = {
        nodeCount,
        edgeCount,
        averageDegree: (2 * edgeCount) / nodeCount || 0,
        transitivity: calculateTransitivity(adjacencyList),
        componentCount: components.length,
        isConnected: components.length === 1,
        graphDensity: ( (2 * edgeCount) / (nodeCount * (nodeCount - 1)) || 0 ).toFixed(10),
        largestComponentSize: largestComponent.length,
        isLargeGraph: isLarge,
        diameter: isLarge ? diameter + " (משוער)" : diameter,
        radius: isLarge ? radius + " (משוער)" : radius,
        centerNodes: centerNodes.slice(0, 5),
        peripheryNodes: peripheryNodes.slice(0, 5),
        averageShortestPath: isLarge ? avgPath.toFixed(2) + " (משוער)" : avgPath.toFixed(2),
        articulationPoints,
        centralityByConnections: graphData.nodes.map(n => ({
            node: n, value: (adjacencyList.get(n.id) || []).length
        })).sort((a,b) => b.value - a.value).slice(0, 5),
        degreeDistribution
    };

    if (largestComponent.length > 1) {
        const betweenness = calculateBetweennessCentrality(largestComponent, adjacencyList, largestComponent.length > 1500);
        result.betweennessCentrality = betweenness.map(item => ({
            node: nodeMap.get(item.id),
            value: item.value.toFixed(2)
        }));
    }

    if (isGedcom) {
        const childMap = new Map();
        const parentMap = new Map();
        const surnames = new Set();

        graphData.nodes.forEach(n => {
            if (n.type === 'person' && n.name) {
                const parts = n.name.trim().split(/\s+/);
                if (parts.length > 1) surnames.add(parts[parts.length - 1]);
            }
        });

        graphData.links.forEach(l => {
            if (l.type === 'parent-child') {
                const s = typeof l.source === 'object' ? l.source.id : l.source;
                const t = typeof l.target === 'object' ? l.target.id : l.target;
                if (!childMap.has(s)) childMap.set(s, []);
                childMap.get(s).push(t);
                if (!parentMap.has(t)) parentMap.set(t, []);
                parentMap.get(t).push(s);
            }
        });

        const countDescendants = (startId) => {
            const descendants = new Set();
            const stack = [startId];
            const visited = new Set();
            while (stack.length > 0) {
                const curr = stack.pop();
                if (visited.has(curr)) continue;
                visited.add(curr);
                if (curr !== startId) descendants.add(curr);
                stack.push(...(childMap.get(curr) || []));
            }
            return descendants.size;
        };

        const countAncestors = (startId) => {
            const ancestors = new Set();
            const stack = [startId];
            const visited = new Set();
            while (stack.length > 0) {
                const curr = stack.pop();
                if (visited.has(curr)) continue;
                visited.add(curr);
                if (curr !== startId) ancestors.add(curr);
                stack.push(...(parentMap.get(curr) || []));
            }
            return ancestors.size;
        };

        result.centralityByDescendants = graphData.nodes
            .map(n => ({ node: n, value: countDescendants(n.id) }))
            .sort((a,b) => b.value - a.value).slice(0, 5);

        result.centralityByAncestors = graphData.nodes
            .map(n => ({ node: n, value: countAncestors(n.id) }))
            .sort((a,b) => b.value - a.value).slice(0, 5);

        const pci = calculatePedigreeCollapse(graphData);
        result.averagePedigreeCollapse = pci.avg;
        result.totalPedigreeCollapseOccurrences = pci.count;
        result.surnameDiversity = surnames.size > 0 ? (surnames.size / (graphData.nodes.filter(n=>n.type==='person').length || 1)).toFixed(3) : "N/A";

        if (graphData.nodes.length > 0) {
            const genLevels = new Map();
            const getGenLevel = (id) => {
                if (genLevels.has(id)) return genLevels.get(id);
                const parents = parentMap.get(id) || [];
                if (parents.length === 0) {
                    genLevels.set(id, 0);
                    return 0;
                }
                // Avoid infinite recursion in case of data errors (cycles)
                genLevels.set(id, 0); 
                const maxParentLevel = Math.max(...parents.map(p => getGenLevel(p)));
                const level = 1 + maxParentLevel;
                genLevels.set(id, level);
                return level;
            };

            let maxGenDepth = 0;
            const leafDepths = [];
            const genCounts = new Map();

            graphData.nodes.forEach(n => {
                const level = getGenLevel(n.id);
                if (level > maxGenDepth) maxGenDepth = level;
                genCounts.set(level, (genCounts.get(level) || 0) + 1);
                
                const children = childMap.get(n.id) || [];
                if (children.length === 0) leafDepths.push(level);
            });

            const totalNodes = Array.from(genCounts.values()).reduce((a,b)=>a+b, 0);
            result.averageGenerationWidth = genCounts.size > 0 ? (totalNodes / genCounts.size).toFixed(2) : "0";
            result.averageLeafDepth = leafDepths.length > 0 ? (leafDepths.reduce((a,b)=>a+b, 0) / leafDepths.length).toFixed(2) : "0";
            result.maxGenerationalDepth = maxGenDepth + 1; // +1 to convert steps to generation count

            const families = Array.from(childMap.values());
            result.averageBranchingFactor = families.length > 0 ? (families.reduce((acc, curr) => acc + curr.length, 0) / families.length).toFixed(2) : "0";
        }
    }
    return result;
};

self.onmessage = (event) => {
  try {
    const { type, graphData, nodeId } = event.data;
    const adjacencyList = new Map();
    
    if (graphData.nodes) {
        graphData.nodes.forEach(n => adjacencyList.set(n.id, []));
    }

    if (graphData.links) {
        graphData.links.forEach(l => {
            const s = typeof l.source === 'object' && l.source !== null ? l.source.id : l.source;
            const t = typeof l.target === 'object' && l.target !== null ? l.target.id : l.target;
            if (!adjacencyList.has(s)) adjacencyList.set(s, []);
            if (!adjacencyList.has(t)) adjacencyList.set(t, []);
            adjacencyList.get(s).push(t);
            adjacencyList.get(t).push(s);
        });
    }

    if (type === 'analyze') {
        const result = analyzeGraph(graphData, adjacencyList);
        self.postMessage({ type: 'analysis_success', result });
    } else if (type === 'detectCommunities') {
        const communities = detectCommunities(graphData, adjacencyList);
        self.postMessage({ type: 'communities_success', communities });
    } else if (type === 'analyzeNode' && nodeId) {
        const neighbors = adjacencyList.get(nodeId) || [];
        const { maxDistance, distances, totalDistance } = bfs(nodeId, adjacencyList);
        const avgDist = distances.size > 1 ? (totalDistance / (distances.size - 1)) : 0;
        self.postMessage({ 
            type: 'node_analysis_success', 
            result: { 
                id: nodeId, degree: neighbors.length,
                eccentricity: maxDistance, reachableNodes: distances.size,
                averageDistance: avgDist, clusteringCoefficient: 0 // Local CC not calculated in basic BFS
            } 
        });
    }
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message || 'An unknown worker error occurred.' });
  }
};
`;

const App: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isDetectingCommunities, setIsDetectingCommunities] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGedcom, setIsGedcom] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{key: string; param?: string} | null>(null);
  const [language, setLanguage] = useState<Language>('he');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);
  const [selectedNodeStats, setSelectedNodeStats] = useState<NodeAnalysisResult | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeObject | null>(null);
  const fgRef = useRef<any>(null);
  const workerRef = useRef<Worker | null>(null);
  const [rawFileContent, setRawFileContent] = useState<string | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  useEffect(() => {
    const blob = new Blob([GRAPH_WORKER_CODE], { type: 'application/javascript' });
    const objectUrl = URL.createObjectURL(blob);
    const worker = new Worker(objectUrl);
    workerRef.current = worker;
    worker.addEventListener('message', (event) => {
      const { type, result, communities, error: workerError } = event.data;
      if (type === 'analysis_success') {
        setIsAnalyzing(false);
        setAnalysisResult(result);
        setStatusMessage({ key: 'analysisComplete' });
      } else if (type === 'communities_success') {
        setIsDetectingCommunities(false);
        setAnalysisResult(prev => prev ? ({ ...prev, communities }) : null);
        setStatusMessage({ key: 'communitiesDetected', param: String(communities.length) });
      } else if (type === 'node_analysis_success') {
        setSelectedNodeStats(result);
      } else if (type === 'error') {
        setIsAnalyzing(false);
        setIsDetectingCommunities(false);
        setError(workerError);
      }
    });
    return () => { worker.terminate(); URL.revokeObjectURL(objectUrl); };
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setError(null); setAnalysisResult(null); setSelectedNode(null); setGraphData(null); setAiSummary(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setRawFileContent(content);
        const isGedcomFile = file.name.toLowerCase().endsWith('.ged');
        setIsGedcom(isGedcomFile);
        const data = isGedcomFile ? parseGedcom(content, false) : parseEdgeList(content);
        setGraphData(data);
        setStatusMessage({ key: 'loadedFile', param: file.name });
      } catch (err) { setError(language === 'he' ? 'שגיאה בניתוח הקובץ.' : 'Error parsing file.'); }
    };
    reader.readAsText(file);
  }, [language]);

  const handleSampleSelect = useCallback((content: string, type: 'ged' | 'txt', name: string) => {
    setError(null); setAnalysisResult(null); setSelectedNode(null); setAiSummary(null);
    setRawFileContent(content);
    const isGedcomFile = type === 'ged';
    setIsGedcom(isGedcomFile);
    const data = isGedcomFile ? parseGedcom(content, false) : parseEdgeList(content);
    setGraphData(data);
    setStatusMessage({ key: 'loadedSample', param: name });
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!graphData || !workerRef.current) return;
    setAnalysisResult(null); setIsAnalyzing(true);
    workerRef.current.postMessage({ type: 'analyze', graphData });
  }, [graphData]);

  const handleDetectCommunities = useCallback(() => {
    if (!graphData || !workerRef.current) return;
    setIsDetectingCommunities(true);
    workerRef.current.postMessage({ type: 'detectCommunities', graphData });
  }, [graphData]);

  const handleNodeClick = useCallback((node: NodeObject) => {
    setSelectedNode(node); setSelectedNodeStats(null);
    if (graphData && workerRef.current) {
        workerRef.current.postMessage({ type: 'analyzeNode', graphData, nodeId: node.id });
    }
  }, [graphData]);

  const handleToggleAdvancedMode = useCallback(() => {
    if (!rawFileContent || !isGedcom) return;
    const newMode = !isAdvancedMode;
    setIsAdvancedMode(newMode);
    setAnalysisResult(null); setAiSummary(null);
    try { const data = parseGedcom(rawFileContent, newMode); setGraphData(data); } catch (err) { setError('Parse error.'); }
  }, [rawFileContent, isGedcom, isAdvancedMode]);

  const handleGenerateAiInsights = useCallback(async () => {
    if (!analysisResult) return;
    if (!(await (window as any).aistudio.hasSelectedApiKey())) {
      await (window as any).aistudio.openSelectKey();
    }
    setIsGeneratingAi(true); setAiSummary(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = language === 'he' 
        ? `נתח את הנתונים הבאים על עץ משפחה/רשת חברתית: ${JSON.stringify(analysisResult)}`
        : `Analyze the following metrics of this social/genealogical network: ${JSON.stringify(analysisResult)}`;

      const systemInstruction = language === 'he'
        ? "אתה מומחה גנאלוגיה ורשתות. נתח את הנתונים וספק הסבר מה ניתן ללמוד מהם על המבנה המשפחתי, צמתים מרכזיים ודפוסים חריגים. ענה בעברית."
        : "You are an expert in genealogy and complex network structures. Analyze the provided metrics and explain family structures, key center figures, branching patterns, pedigree collapse and any network anomalies. Respond in English.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { 
          systemInstruction: systemInstruction,
          thinkingConfig: { thinkingBudget: 32768 } 
        }
      });
      setAiSummary(response.text || getTranslation(language, 'noInsights'));
    } catch (err: any) { 
        if (err?.message?.includes("Requested entity was not found.")) {
            await (window as any).aistudio.openSelectKey();
            setError(getTranslation(language, 'apiError'));
        } else {
            setError(getTranslation(language, 'generationFailed')); 
        }
    } finally { setIsGeneratingAi(false); }
  }, [analysisResult, language]);

  const getRenderedStatusMessage = () => {
    if (!statusMessage) return '';
    const translated = getTranslation(language, statusMessage.key as any);
    if (statusMessage.param) {
      return translated.replaceAll('{count}', statusMessage.param).replaceAll('{name}', statusMessage.param);
    }
    return translated;
  };

  const pageBg = theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-100 text-gray-800';
  const headerBg = theme === 'dark' ? 'bg-gray-900 bg-opacity-70 border-gray-800 text-white' : 'bg-white bg-opacity-85 border-gray-200 text-gray-800 shadow-sm';
  const canvasBgClass = theme === 'dark' ? 'bg-gray-900 border-gray-800 shadow-2xl h-full min-h-[300px]' : 'bg-white border-gray-200 shadow-lg h-full min-h-[300px] text-gray-900';

  const finalStatusMsg = getRenderedStatusMessage();

  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'} className={`h-screen flex flex-col font-sans transition-colors duration-200 ${pageBg} overflow-hidden`}>
      <header className={`backdrop-blur-md p-4 z-10 border-b flex-shrink-0 transition-colors duration-200 ${headerBg}`}>
        <div className="container mx-auto flex items-center gap-4">
          <GraphIcon className="w-8 h-8 text-cyan-500" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              {getTranslation(language, 'title')}
          </h1>
          {finalStatusMsg && <span className={`${language === 'he' ? 'mr-auto pl-3' : 'ml-auto pr-3'} text-xs text-cyan-500 font-semibold animate-pulse`}>{finalStatusMsg}</span>}
          
          <div className={`flex items-center gap-2 ${finalStatusMsg ? '' : (language === 'he' ? 'mr-auto' : 'ml-auto')}`}>
              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border font-bold tracking-wider uppercase transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-800/80 border-gray-700 text-cyan-400 hover:bg-gray-700 hover:text-cyan-300'
                    : 'bg-gray-50 border-gray-200 text-cyan-750 hover:bg-gray-100 hover:text-cyan-800 shadow-sm'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                {language === 'he' ? 'English' : 'עברית'}
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-1.5 rounded-md border transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-800/80 border-gray-700 text-yellow-500 hover:bg-gray-700 hover:text-yellow-400'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm'
                }`}
                title={language === 'he' ? 'שינוי מצב תצוגה' : 'Toggle view mode'}
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                )}
              </button>
          </div>
        </div>
      </header>
      <main className="flex-grow flex flex-col md:flex-row container mx-auto p-4 gap-4 min-h-0 overflow-hidden md:overflow-visible">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 h-[45vh] md:h-full flex flex-col min-h-0 overflow-hidden">
          <ControlPanel
            onFileSelect={handleFileSelect}
            onAnalyze={handleAnalyze}
            onDetectCommunities={handleDetectCommunities}
            onSampleSelect={handleSampleSelect}
            analysisResult={analysisResult}
            isAnalyzing={isAnalyzing}
            isDetectingCommunities={isDetectingCommunities}
            error={error}
            hasGraphData={!!graphData}
            graphData={graphData}
            selectedNode={selectedNode}
            selectedNodeStats={selectedNodeStats}
            onNodeSelect={handleNodeClick}
            onClearSelection={() => setSelectedNode(null)}
            isAdvancedMode={isAdvancedMode}
            onToggleAdvancedMode={handleToggleAdvancedMode}
            isGedcom={isGedcom}
            onGenerateAiInsights={handleGenerateAiInsights}
            aiSummary={aiSummary}
            isGeneratingAi={isGeneratingAi}
            lang={language}
            theme={theme}
          />
        </div>
        <div className={`flex-grow flex-1 rounded-lg overflow-hidden relative border transition-colors duration-250 ${canvasBgClass}`}>
          {graphData ? (
            <>
              <GraphVisualizer
                fgRef={fgRef}
                graphData={graphData}
                onNodeClick={handleNodeClick}
                onBackgroundClick={() => setSelectedNode(null)}
                hoveredNode={hoveredNode}
                onNodeHover={setHoveredNode}
                selectedNode={selectedNode}
                analysisResult={analysisResult}
                theme={theme}
              />
              <GraphLegend 
                isGedcom={isGedcom} 
                isAdvancedMode={isAdvancedMode} 
                hasCommunities={!!analysisResult?.communities} 
                lang={language}
                theme={theme}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <UploadIcon className={`w-20 h-20 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'} mb-6`} />
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {getTranslation(language, 'readyToDisplayHeader')}
              </h2>
              <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} max-w-md`}>
                  {getTranslation(language, 'readyToDisplaySubtitle')}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
