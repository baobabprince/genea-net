
export interface NodeObject {
  id: string;
  [key: string]: any;
}

export interface LinkObject {
  source: string;
  target: string;
  type?: 'marriage' | 'parent-child';
  [key: string]: any;
}

export interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

export interface CentralityResult {
  node: NodeObject;
  value: number;
}

export interface DegreeDistributionResult {
    degree: number;
    count: number;
}

export interface AnalysisResult {
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