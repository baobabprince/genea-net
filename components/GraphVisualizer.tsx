import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphData, NodeObject, LinkObject } from '../types';

interface GraphVisualizerProps {
  fgRef: React.MutableRefObject<any>;
  graphData: GraphData;
  onNodeClick: (node: NodeObject) => void;
  onBackgroundClick: () => void;
  hoveredNode: NodeObject | null;
  onNodeHover: (node: NodeObject | null) => void;
  selectedNode: NodeObject | null;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ 
  fgRef,
  graphData, 
  onNodeClick, 
  onBackgroundClick,
  hoveredNode,
  onNodeHover,
  selectedNode
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
    const baseColor = link.type === 'marriage' ? '255, 165, 0' : '135, 206, 250';
    const defaultColor = '107, 114, 128';

    if (hoveredNode || selectedNode) {
        if(isHighlighted) {
            return link.type ? `rgba(${baseColor}, 0.9)` : `rgba(${defaultColor}, 0.8)`;
        }
        return `rgba(${defaultColor}, 0.1)`;
    }
    
    return link.type ? `rgba(${baseColor}, ${link.type === 'marriage' ? '0.9' : '0.7'})` : `rgba(${defaultColor}, 0.5)`;
  };
  
  const getNodeColor = (node: NodeObject) => {
      const isHighlighted = highlightNodes.has(node.id);
      if (hoveredNode || selectedNode) {
          return isHighlighted ? '#06b6d4' : 'rgba(209, 213, 219, 0.3)';
      }
      return '#06b6d4';
  }

  return (
    <div ref={containerRef} className="w-full h-full cursor-pointer">
      <ForceGraph2D
        ref={fgRef}
        width={size.width}
        height={size.height}
        graphData={graphData}
        nodeLabel={(node: NodeObject) => node.name || node.id}
        nodeVal={8}
        nodeColor={getNodeColor}
        linkColor={getLinkColor}
        linkWidth={(link: LinkObject) => highlightLinks.has(link) ? (link.type === 'marriage' ? 2.5 : 2) : 1}
        linkDirectionalParticles={(link: LinkObject) => (link.type === 'parent-child' && highlightLinks.has(link)) ? 1 : 0}
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