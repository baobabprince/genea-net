// --- START of types.ts content ---
interface NodeObject {
  id: string;
  [key: string]: any;
}

interface LinkObject {
  source: string;
  target: string;
  type?: 'marriage' | 'parent-child';
  [key: string]: any;
}

interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

interface CentralityResult {
  node: NodeObject;
  value: number;
}

interface DegreeDistributionResult {
    degree: number;
    count: number;
}

interface AnalysisResult {
  nodeCount: number;
  edgeCount: number;
  componentCount: number;
  isConnected: boolean;
  diameter: number | string;
  largestComponentSize: number;
  graphDensity: number | string;
  averageShortestPath: number | string;
  articulationPoints: NodeObject[];
  centralityByConnections?: CentralityResult[];
  centralityByDescendants?: CentralityResult[];
  centralityByAncestors?: CentralityResult[];
  betweennessCentrality?: CentralityResult[];
  degreeDistribution?: DegreeDistributionResult[];
}
// --- END of types.ts content ---

// --- START of graphService.ts analysis functions ---
const bfs = (startNodeId: string, adjacencyList: Map<string, string[]>): { distances: Map<string, number>, maxDistance: number } => {
  const distances = new Map<string, number>([[startNodeId, 0]]);
  const queue = [startNodeId];
  let maxDistance = 0;
  
  let head = 0;
  while(head < queue.length) {
    const currentNodeId = queue[head++];
    const currentDistance = distances.get(currentNodeId)!;

    if (currentDistance > maxDistance) {
        maxDistance = currentDistance;
    }

    const neighbors = adjacencyList.get(currentNodeId) || [];
    for (const neighborId of neighbors) {
      if (!distances.has(neighborId)) {
        distances.set(neighborId, currentDistance + 1);
        queue.push(neighborId);
      }
    }
  }

  return { distances, maxDistance };
};

const findConnectedComponents = (graphData: GraphData, adjacencyList: Map<string, string[]>): string[][] => {
    const components: string[][] = [];
    const visited = new Set<string>();

    for(const node of graphData.nodes) {
        if(!visited.has(node.id)) {
            const component: string[] = [];
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
}

const calculateGraphDensity = (nodeCount: number, edgeCount: number): number => {
    if (nodeCount < 2) return 0;
    // For an undirected graph
    return (2 * edgeCount) / (nodeCount * (nodeCount - 1));
};

const calculateAverageShortestPath = (
    componentNodeIds: string[], 
    adjacencyList: Map<string, string[]>
): number => {
    let totalDistanceSum = 0;
    const n = componentNodeIds.length;
    let reachablePairs = 0;
    
    if (n < 2) return 0;

    for (const startNodeId of componentNodeIds) {
        const { distances } = bfs(startNodeId, adjacencyList);
        for (const [endNodeId, d] of distances.entries()) {
            if (startNodeId !== endNodeId) {
                totalDistanceSum += d;
                reachablePairs++;
            }
        }
    }
    
    return reachablePairs > 0 ? totalDistanceSum / reachablePairs : 0;
};

const findArticulationPoints = (
    componentNodeIds: string[], 
    adjacencyList: Map<string, string[]>
): string[] => {
    const points = new Set<string>();
    const visited = new Set<string>();
    const discoveryTimes = new Map<string, number>();
    const lowLinkValues = new Map<string, number>();
    const parent = new Map<string, string | null>();
    let time = 0;

    const dfs = (u: string) => {
        visited.add(u);
        discoveryTimes.set(u, time);
        lowLinkValues.set(u, time);
        time++;
        let children = 0;
        
        const neighbors = adjacencyList.get(u) || [];
        for (const v of neighbors) {
            if (v === parent.get(u)) continue;

            if (visited.has(v)) {
                lowLinkValues.set(u, Math.min(lowLinkValues.get(u)!, discoveryTimes.get(v)!));
            } else {
                children++;
                parent.set(v, u);
                dfs(v);
                lowLinkValues.set(u, Math.min(lowLinkValues.get(u)!, lowLinkValues.get(v)!));
                
                if (parent.get(u) === null && children > 1) {
                    points.add(u);
                }
                if (parent.get(u) !== null && lowLinkValues.get(v)! >= discoveryTimes.get(u)!) {
                    points.add(u);
                }
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

// Implements Brandes' algorithm for betweenness centrality.
const calculateBetweennessCentrality = (
    componentNodeIds: string[],
    adjacencyList: Map<string, string[]>
): CentralityResult[] => {
    const centrality = new Map<string, number>();
    for (const id of componentNodeIds) {
        centrality.set(id, 0);
    }

    for (const s of componentNodeIds) {
        const stack: string[] = [];
        const predecessors = new Map<string, string[]>();
        const shortestPathCounts = new Map<string, number>();
        const distances = new Map<string, number>();

        for (const id of componentNodeIds) {
            predecessors.set(id, []);
            shortestPathCounts.set(id, 0);
            distances.set(id, -1);
        }
        
        shortestPathCounts.set(s, 1);
        distances.set(s, 0);
        const queue = [s];
        
        let head = 0;
        while (head < queue.length) {
            const v = queue[head++];
            stack.push(v);
            const neighbors = adjacencyList.get(v) || [];

            for (const w of neighbors) {
                // Path discovery
                if (distances.get(w)! < 0) {
                    queue.push(w);
                    distances.set(w, distances.get(v)! + 1);
                }
                // Path counting
                if (distances.get(w)! === distances.get(v)! + 1) {
                    shortestPathCounts.set(w, shortestPathCounts.get(w)! + shortestPathCounts.get(v)!);
                    predecessors.get(w)!.push(v);
                }
            }
        }

        const dependencies = new Map<string, number>();
        for(const id of componentNodeIds) {
            dependencies.set(id, 0);
        }

        // Accumulation phase
        while (stack.length > 0) {
            const w = stack.pop()!;
            for (const v of predecessors.get(w)!) {
                const dependency = shortestPathCounts.get(v)! / shortestPathCounts.get(w)! * (1 + dependencies.get(w)!);
                dependencies.set(v, dependencies.get(v)! + dependency);
            }
            if (w !== s) {
                centrality.set(w, centrality.get(w)! + dependencies.get(w)!);
            }
        }
    }

    // Normalize for undirected graphs and prepare result
    return componentNodeIds
        .map(id => ({ node: {id}, value: centrality.get(id)! / 2 }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
};


const calculateDegreeCentrality = (
    graphData: GraphData,
    adjacencyList: Map<string, string[]>
): CentralityResult[] => {
    return graphData.nodes
        .map(node => ({
            node,
            value: (adjacencyList.get(node.id) || []).length,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
};

const calculateDegreeDistribution = (
    adjacencyList: Map<string, string[]>
): DegreeDistributionResult[] => {
    const distribution = new Map<number, number>();
    for (const neighbors of adjacencyList.values()) {
        const degree = neighbors.length;
        distribution.set(degree, (distribution.get(degree) || 0) + 1);
    }
    return Array.from(distribution.entries())
        .map(([degree, count]) => ({ degree, count }))
        .sort((a, b) => a.degree - b.degree);
};

// Robust recursive implementation with memoization
const createMemoizedCounter = (map: Map<string, string[]>) => {
    const memo = new Map<string, Set<string>>();

    const count = (nodeId: string): Set<string> => {
        if (memo.has(nodeId)) {
            return memo.get(nodeId)!;
        }

        const relatedNodes = new Set<string>();
        const directConnections = map.get(nodeId) || [];

        for (const connectedId of directConnections) {
            relatedNodes.add(connectedId);
            const indirect = count(connectedId);
            indirect.forEach(node => relatedNodes.add(node));
        }

        memo.set(nodeId, relatedNodes);
        return relatedNodes;
    };

    return count;
};

const calculateDescendantCentrality = (graphData: GraphData): CentralityResult[] => {
    const childMap = new Map<string, string[]>();
    graphData.links.forEach(link => {
        if (link.type === 'parent-child') {
            const parentId = typeof link.source === 'object' ? (link.source as NodeObject).id : link.source;
            const childId = typeof link.target === 'object' ? (link.target as NodeObject).id : link.target;
            if (!childMap.has(parentId)) childMap.set(parentId, []);
            childMap.get(parentId)!.push(childId);
        }
    });

    const countAllDescendants = createMemoizedCounter(childMap);
    return graphData.nodes
        .map(node => ({ node, value: countAllDescendants(node.id).size }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
};

const calculateAncestorCentrality = (graphData: GraphData): CentralityResult[] => {
    const parentMap = new Map<string, string[]>();
    graphData.links.forEach(link => {
        if (link.type === 'parent-child') {
            const parentId = typeof link.source === 'object' ? (link.source as NodeObject).id : link.source;
            const childId = typeof link.target === 'object' ? (link.target as NodeObject).id : link.target;
            if (!parentMap.has(childId)) parentMap.set(childId, []);
            parentMap.get(childId)!.push(parentId);
        }
    });

    const countAllAncestors = createMemoizedCounter(parentMap);
    return graphData.nodes
        .map(node => ({ node, value: countAllAncestors(node.id).size }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
};


const analyzeGraph = (graphData: GraphData): AnalysisResult => {
  const nodeCount = graphData.nodes.length;
  const edgeCount = graphData.links.length;
  const isGedcomGraph = graphData.links.some(l => l.type === 'parent-child' || l.type === 'marriage');
  const nodeMap = new Map(graphData.nodes.map(n => [n.id, n]));

  const adjacencyList = new Map<string, string[]>();
  graphData.nodes.forEach(node => adjacencyList.set(node.id, []));
  graphData.links.forEach(({ source, target }) => {
    const sourceId = typeof source === 'object' && source !== null ? (source as NodeObject).id : source;
    const targetId = typeof target === 'object' && target !== null ? (target as NodeObject).id : target;
    adjacencyList.get(sourceId)?.push(targetId);
    adjacencyList.get(targetId)?.push(sourceId);
  });
  
  const components = findConnectedComponents(graphData, adjacencyList);
  const componentCount = components.length;
  
  const largestComponent = components.reduce((largest, current) => current.length > largest.length ? current : largest, []);
  const largestComponentSize = largestComponent.length;
  
  let diameter: number | string = 'N/A';
  let averageShortestPath: number | string = 'N/A';
  let articulationPoints: NodeObject[] = [];
  let betweennessCentrality: CentralityResult[] = [];
  
  if (largestComponentSize > 1) {
    let maxEccentricity = 0;
    const componentAdjacencyList = new Map<string, string[]>();
    largestComponent.forEach(nodeId => {
        componentAdjacencyList.set(nodeId, adjacencyList.get(nodeId) || []);
    });

    for (const nodeId of largestComponent) {
      const { maxDistance } = bfs(nodeId, componentAdjacencyList);
      if (maxDistance > maxEccentricity) {
        maxEccentricity = maxDistance;
      }
    }
    diameter = maxEccentricity;
    averageShortestPath = parseFloat(calculateAverageShortestPath(largestComponent, componentAdjacencyList).toFixed(2));
    
    const allArticulationPoints = findArticulationPoints(largestComponent, componentAdjacencyList);
    articulationPoints = allArticulationPoints
                            .slice(0, 5)
                            .map(id => nodeMap.get(id)!)
                            .filter(Boolean);

    const fullBetweenness = calculateBetweennessCentrality(largestComponent, componentAdjacencyList);
    betweennessCentrality = fullBetweenness
                                .map(item => ({...item, node: nodeMap.get(item.node.id) || item.node }))
                                .filter(item => item.node);

  } else if (largestComponentSize <= 1 && nodeCount > 0) {
      diameter = 0;
      averageShortestPath = 0;
  }
  
  const graphDensity = parseFloat(calculateGraphDensity(nodeCount, edgeCount).toFixed(4));
  
  const result: AnalysisResult = {
    nodeCount,
    edgeCount,
    componentCount,
    isConnected: componentCount === 1,
    largestComponentSize,
    diameter,
    graphDensity,
    averageShortestPath,
    articulationPoints,
  };
  
  // Always calculate network metrics
  result.centralityByConnections = calculateDegreeCentrality(graphData, adjacencyList);
  result.degreeDistribution = calculateDegreeDistribution(adjacencyList);
  result.betweennessCentrality = betweennessCentrality;

  // Add genealogical metrics if applicable
  if (isGedcomGraph) {
      result.centralityByDescendants = calculateDescendantCentrality(graphData);
      result.centralityByAncestors = calculateAncestorCentrality(graphData);
  }

  return result;
};

// --- END of graphService.ts analysis functions ---

// Worker message handler
self.onmessage = (event: MessageEvent<GraphData>) => {
  try {
    const graphData = event.data;
    if (!graphData) {
        throw new Error("No graph data received by worker.");
    }
    const result = analyzeGraph(graphData);
    self.postMessage({ type: 'success', result });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred in the worker.';
    self.postMessage({ type: 'error', error });
  }
};
