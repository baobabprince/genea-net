
import React, { useState, useCallback, useRef } from 'react';
import { GraphData, AnalysisResult, NodeObject } from './types';
import { parseEdgeList, parseGedcom, analyzeGraph } from './services/graphService';
import ControlPanel from './components/ControlPanel';
import GraphVisualizer from './components/GraphVisualizer';
import GraphLegend from './components/GraphLegend';
import { UploadIcon, GraphIcon } from './components/ui/Icons';

const App: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGedcom, setIsGedcom] = useState<boolean>(false);

  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeObject | null>(null);
  const fgRef = useRef<any>(null);


  const clearAnalysis = () => {
    setAnalysisResult(null);
    setSelectedNode(null);
    setHoveredNode(null);
  };

  const resetGraphState = () => {
    setGraphData(null);
    clearAnalysis();
    setIsGedcom(false);
  };

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    resetGraphState();
    if (!file) return;
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['gdcom', 'ged', 'txt'].includes(fileExtension || '')) {
      setError("Invalid file type. Please upload a '.gdcom', '.ged', or '.txt' file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content.trim()) {
          throw new Error("File is empty.");
        }
        
        let data: GraphData;
        const isGedcomFile = fileExtension === 'ged';
        setIsGedcom(isGedcomFile);
        
        if (isGedcomFile) {
            data = parseGedcom(content);
        } else {
            data = parseEdgeList(content);
        }

        if (data.nodes.length === 0) {
            throw new Error("No nodes found in the file. Ensure the file is not empty and is formatted correctly (e.g., 'node1 node2' for .txt or valid GEDCOM for .ged).");
        }
        setGraphData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file.');
        setGraphData(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setGraphData(null);
    };
    reader.readAsText(file);
  }, []);
  
  const handleSampleSelect = useCallback((content: string, type: 'ged' | 'txt') => {
    setError(null);
    resetGraphState();

    try {
        if (!content.trim()) {
            throw new Error("Sample data is empty.");
        }
        
        let data: GraphData;
        const isGedcomFile = type === 'ged';
        setIsGedcom(isGedcomFile);
        
        if (isGedcomFile) {
            data = parseGedcom(content);
        } else {
            data = parseEdgeList(content);
        }

        if (data.nodes.length === 0) {
            throw new Error("No nodes found in the sample data.");
        }
        setGraphData(data);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse sample data.');
        setGraphData(null);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!graphData) return;
    clearAnalysis();
    setIsLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const result = analyzeGraph(graphData);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [graphData]);
  
  const handleNodeClick = useCallback((node: NodeObject) => {
    setSelectedNode(node);
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(2.5, 1000);
    }
  }, []);

  const handleClearSelection = useCallback(() => {
      setSelectedNode(null);
  }, []);

  return (
    <div className="h-screen flex flex-col font-sans bg-gray-900 text-gray-200">
      <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 z-10 border-b border-gray-700">
        <div className="container mx-auto flex items-center gap-4">
          <GraphIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Graph Analysis Tool
          </h1>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row container mx-auto p-4 gap-4 min-h-0">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 md:h-full max-h-[50%] md:max-h-none">
          <ControlPanel
            onFileSelect={handleFileSelect}
            onAnalyze={handleAnalyze}
            onSampleSelect={handleSampleSelect}
            analysisResult={analysisResult}
            isLoading={isLoading}
            error={error}
            hasGraphData={!!graphData}
            graphData={graphData}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeClick}
            onClearSelection={handleClearSelection}
          />
        </div>
        
        <div className="flex-grow min-h-0 bg-gray-800 rounded-lg shadow-2xl overflow-hidden relative border border-gray-700 md:h-full">
          {graphData ? (
            <>
              <GraphVisualizer
                fgRef={fgRef}
                graphData={graphData}
                onNodeClick={handleNodeClick}
                onBackgroundClick={handleClearSelection}
                hoveredNode={hoveredNode}
                onNodeHover={setHoveredNode}
                selectedNode={selectedNode}
              />
              <GraphLegend isGedcom={isGedcom} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <UploadIcon className="w-24 h-24 text-gray-600 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-300">Welcome to the Graph Analyzer</h2>
              <p className="mt-2 text-gray-400 max-w-md">
                To get started, please upload a <code className="bg-gray-700 text-cyan-400 px-1 py-0.5 rounded">.gdcom</code>, <code className="bg-gray-700 text-cyan-400 px-1 py-0.5 rounded">.ged</code>, or <code className="bg-gray-700 text-cyan-400 px-1 py-0.5 rounded">.txt</code> file, or load a sample dataset from the panel on the left.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
