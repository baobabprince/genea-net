import { GraphData, AnalysisResult, NodeObject, LinkObject, CentralityResult, DegreeDistributionResult } from './types';

/**
 * Parses a simple edge list file content (e.g., .gdcom, .txt) into graph data format.
 * Expected format: one edge per line, with two node IDs separated by whitespace.
 * e.g., "nodeA nodeB"
 */
export const parseEdgeList = (content: string): GraphData => {
  const links: LinkObject[] = [];
  const nodeSet = new Set<string>();
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;

    const parts = trimmedLine.split(/\s+/);
    if (parts.length >= 2) {
      const [source, target] = parts;
      if (source && target) {
        links.push({ source, target });
        nodeSet.add(source);
        nodeSet.add(target);
      }
    }
  }

  const nodes: NodeObject[] = Array.from(nodeSet).map(id => ({ id }));
  return { nodes, links };
};

/**
 * Parses a .ged (GEDCOM) file content into a graph of family relationships.
 */
export const parseGedcom = (content: string): GraphData => {
  const individuals = new Map<string, { name: string }>();
  const families: { id: string; type: 'FAM', husb?: string; wife?: string; children: string[] }[] = [];
  const lines = content.split('\n');
  let currentRecord: any = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const match = trimmedLine.match(/^(\d+)\s+(@\S+@|[^@\s]+)\s*(.*)$/);
    if (!match) continue;

    const level = parseInt(match[1], 10);
    const tagOrId = match[2];
    const value = match[3];

    if (level === 0) {
      const id = tagOrId;
      const type = value;
      if (type === 'INDI') {
        currentRecord = { id, type: 'INDI' };
        individuals.set(id, { name: id.replace(/@/g, '') }); // Default name
      } else if (type === 'FAM') {
        currentRecord = { id, type: 'FAM', children: [] };
        families.push(currentRecord);
      } else {
        currentRecord = null;
      }
    } else if (level === 1 && currentRecord) {
      const tag = tagOrId;
      if (currentRecord.type === 'INDI' && tag === 'NAME') {
        const name = value.replace(/\//g, '').trim();
        const indi = individuals.get(currentRecord.id);
        if (indi && name) {
          indi.name = name;
        }
      } else if (currentRecord.type === 'FAM') {
        if (tag === 'HUSB') currentRecord.husb = value;
        if (tag === 'WIFE') currentRecord.wife = value;
        if (tag === 'CHIL') currentRecord.children.push(value);
      }
    }
  }

  const links: LinkObject[] = [];
  const nodeSet = new Set<string>(individuals.keys());

  for (const family of families) {
    const parents: string[] = [];
    if (family.husb) {
      parents.push(family.husb);
      nodeSet.add(family.husb);
    }
    if (family.wife) {
      parents.push(family.wife);
      nodeSet.add(family.wife);
    }

    if (family.husb && family.wife) {
      links.push({ source: family.husb, target: family.wife, type: 'marriage' });
    }

    family.children.forEach(child => {
      nodeSet.add(child);
      parents.forEach(parent => {
        links.push({ source: parent, target: child, type: 'parent-child' });
      });
    });
  }
  
  const nodes: NodeObject[] = Array.from(nodeSet).map(id => {
      const indi = individuals.get(id);
      return { id, name: indi ? indi.name : id.replace(/@/g, '') };
  });

  return { nodes, links };
};

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


export const analyzeGraph = (graphData: GraphData): AnalysisResult => {
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