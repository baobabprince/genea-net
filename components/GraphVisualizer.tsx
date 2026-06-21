
import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphData, NodeObject, LinkObject, AnalysisResult } from '../types';

interface GraphVisualizerProps {
  fgRef: React.MutableRefObject<any>;
  graphData: GraphData;
  onNodeClick: (node: NodeObject) => void;
  onBackgroundClick: () => void;
  hoveredNode: NodeObject | null;
  onNodeHover: (node: NodeObject | null) => void;
  selectedNode: NodeObject | null;
  analysisResult: AnalysisResult | null;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ 
  fgRef,
  graphData, 
  onNodeClick, 
  onBackgroundClick,
  hoveredNode,
  onNodeHover,
  selectedNode,
  analysisResult
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const communityColorMap = useMemo(() => {
    const map = new Map<string, string>();
    const colors = [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
        '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
        '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
    ];
    
    if (analysisResult?.communities) {
        analysisResult.communities.forEach((community, i) => {
            const color = colors[i % colors.length];
            community.forEach(node => {
                map.set(node.id, color);
            });
        });
    }
    return map;
  }, [analysisResult]);
  
  const {highlightNodes, highlightLinks} = useMemo(() => {
    const highlightNodes = new Set();
    const highlightLinks = new Set();
    
    const nodeToInspect = hoveredNode || selectedNode;

    if (nodeToInspect) {
      highlightNodes.add(nodeToInspect.id);
      graphData.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? (link.source as NodeObject).id : link.source;
        const targetId = typeof link.target === 'object' ? (link.target as NodeObject).id : link.target;
        if (sourceId === nodeToInspect.id || targetId === nodeToInspect.id) {
          highlightLinks.add(link);
          highlightNodes.add(sourceId);
          highlightNodes.add(targetId);
        }
      });
    }

    return { highlightNodes, highlightLinks };

  }, [graphData, hoveredNode, selectedNode]);

  const getLinkColor = (link: LinkObject) => {
    const isHighlighted = highlightLinks.has(link);
    
    let baseColor = '107, 114, 128'; // Default Gray
    if (link.type === 'marriage') baseColor = '255, 165, 0'; // Orange
    else if (link.type === 'parent-child') baseColor = '135, 206, 250'; // Light Blue
    else if (link.type === 'event_link') baseColor = '74, 222, 128'; // Greenish

    if (hoveredNode || selectedNode) {
        if(isHighlighted) {
            return `rgba(${baseColor}, 0.9)`;
        }
        return `rgba(107, 114, 128, 0.05)`;
    }
    
    // Normal opacity
    return `rgba(${baseColor}, ${link.type === 'marriage' ? '0.9' : '0.5'})`;
  };
  
  const getNodeColor = (node: NodeObject) => {
    const nodeToInspect = hoveredNode || selectedNode;
    const isHighlighted = highlightNodes.has(node.id);

    if (nodeToInspect) {
        if (node.id === nodeToInspect.id) {
            return '#facc15'; // Bright yellow for selected/hovered
        }
        if (isHighlighted) {
            return '#22d3ee'; // Bright cyan for neighbors
        }
        return 'rgba(209, 213, 219, 0.2)'; // Dim non-neighbors
    }

    // Default color logic based on node TYPE
    // 1. Check Community Map first if exists (override type colors if community detection ran)
    //    (Actually, keeping Type colors is often more useful in advanced mode, but let's stick to community if present)
    if (communityColorMap.has(node.id)) {
        return communityColorMap.get(node.id);
    }

    // 2. Type based coloring
    switch (node.type) {
        case 'place': return '#16a34a'; // Green
        case 'date': return '#ea580c'; // Orange
        case 'source': return '#9333ea'; // Purple
        case 'person': return '#0284c7'; // Blue (Standard)
        default: return '#06b6d4'; // Cyan default
    }
  }

  // Adjust node val (size) based on type
  const getNodeVal = (node: NodeObject) => {
      if (node.type === 'person' || !node.type) return 8;
      if (node.type === 'place') return 6;
      return 4; // Dates/Sources smaller
  }

  return (
    <div ref={containerRef} className="w-full h-full cursor-pointer">
      <ForceGraph2D
        ref={fgRef}
        width={size.width}
        height={size.height}
        graphData={graphData}
        nodeLabel={(node: NodeObject) => node.name || node.id}
        nodeVal={getNodeVal}
        nodeColor={getNodeColor}
        linkColor={getLinkColor}
        linkWidth={(link: LinkObject) => highlightLinks.has(link) ? (link.type === 'marriage' ? 2.5 : 2) : 1}
        linkDirectionalParticles={(link: LinkObject) => (highlightLinks.has(link) && link.type !== 'event_link') ? 1 : 0}
        linkDirectionalParticleWidth={2.5}
        linkDirectionalParticleColor={(link: LinkObject) => getLinkColor(link)}
        backgroundColor="transparent"
        enableZoomInteraction={true}
        enablePointerInteraction={true}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
        onBackgroundClick={onBackgroundClick}
      />
    </div>
  );
};

export default GraphVisualizer;
