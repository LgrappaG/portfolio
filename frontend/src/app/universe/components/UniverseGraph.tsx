'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useUniverseStore, selectFilteredGraphData } from '@/lib/store/universeStore';
import { findConnectedNodes } from '@/lib/utils/graphBuilder';
import type { GraphNode } from '@/types/graph';

const ForceGraph3D = dynamic(
  () => import('react-force-graph').then((mod) => mod.ForceGraph3D),
  { ssr: false, loading: () => <div>Loading graph...</div> }
);

interface UniverseGraphProps {
  onNodeClick?: (node: GraphNode) => void;
}

export function UniverseGraph({ onNodeClick }: UniverseGraphProps) {
  const fgRef = useRef<any>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Get store state
  const graphData = useUniverseStore((s) => s.graphData);
  const selectedNode = useUniverseStore((s) => s.selectedNode);
  const zoomLevel = useUniverseStore((s) => s.zoomLevel);
  const filters = useUniverseStore((s) => s.filters);

  // Get filtered data
  const filteredData = useMemo(() => {
    const state = useUniverseStore.getState();
    return selectFilteredGraphData(state);
  }, [graphData, filters]);

  // Track hovered node for visual feedback
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const connectedNodes = useMemo(() => {
    if (!hoveredNodeId || !filteredData) return new Set<string>();
    return new Set(findConnectedNodes(hoveredNodeId, filteredData.links));
  }, [hoveredNodeId, filteredData]);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Configure force graph when data changes
  useEffect(() => {
    if (!fgRef.current || !filteredData) return;

    const fg = fgRef.current;

    // Physics configuration
    fg.d3Force('link')?.distance(80);
    fg.d3Force('charge')?.strength(-300);
    fg.d3Force('collide')?.radius((d: any) => (d.val || 5) / 100 + 15);

    // Node rendering
    fg.nodeCanvasObject(
      (
        node: any,
        ctx: CanvasRenderingContext2D,
        globalScale: number
      ) => {
        // Calculate node size
        const baseSize = Math.max((node.val as number) / 100, 3);
        const size = baseSize / globalScale;

        // Determine fill color
        let fillColor = node.color || '#858585';

        // Highlight hovered node
        if (hoveredNodeId === node.id) {
          fillColor = '#fbbf24'; // Warm glow
        }

        // Highlight selected node
        if (selectedNode?.id === node.id) {
          fillColor = '#06b6d4'; // Cyan
        }

        // Dim nodes connected to hovered node
        if (
          hoveredNodeId &&
          hoveredNodeId !== node.id &&
          connectedNodes.has(node.id)
        ) {
          fillColor = fillColor;
          // Will apply reduced opacity below
        }

        // Draw node circle
        ctx.globalAlpha = 1;
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
        ctx.fill();

        // Draw glow effect on selected
        if (selectedNode?.id === node.id) {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
          ctx.lineWidth = 2 / globalScale;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 3, 0, 2 * Math.PI);
          ctx.stroke();
        }

        // Draw label if zoom >= 2
        if (zoomLevel >= 2) {
          const fontSize = Math.max(8 + zoomLevel * 2, 4) / globalScale;
          ctx.globalAlpha = 1;
          ctx.font = `${fontSize}px sans-serif`;
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.name, node.x, node.y - size - 8);
        }
      }
    );

    // Link rendering
    fg.linkCanvasObject((link: any, ctx: CanvasRenderingContext2D) => {
      const source = link.source as any;
      const target = link.target as any;

      // Link styling
      ctx.strokeStyle =
        link.type === 'technology'
          ? 'rgba(6, 182, 212, 0.4)'
          : 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = link.type === 'technology' ? 2 : 1;

      // Draw line
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();

      // Draw label if zoom >= 3
      if (zoomLevel >= 3 && (hoveredNodeId === source.id || hoveredNodeId === target.id)) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;

        ctx.fillStyle = '#fff';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(link.label || '', midX, midY);
      }
    });

    // Node click handler
    fg.onNodeClick((node: any) => {
      const selectedGraphNode = filteredData.nodes.find(
        (n) => n.id === node.id
      );
      if (selectedGraphNode && onNodeClick) {
        onNodeClick(selectedGraphNode);
      }

      // Camera focus
      const distance = 100;
      const distRatio = 1 + (distance / Math.hypot(node.x, node.y));
      fg.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        3000
      );
    });

    // Node hover handler
    fg.onNodeHover((node: any) => {
      setHoveredNodeId(node?.id || null);
      containerRef.current!.style.cursor = node ? 'pointer' : 'default';
    });
  }, [filteredData, zoomLevel, hoveredNodeId, selectedNode, onNodeClick]);

  // Handle double-click to reset view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleDoubleClick = () => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(400, 50);
      }
    };

    container.addEventListener('dblclick', handleDoubleClick);
    return () => container.removeEventListener('dblclick', handleDoubleClick);
  }, []);

  if (!filteredData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-sm">Loading Project Universe...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-950"
    >
      <ForceGraph3D
        ref={fgRef}
        graphData={filteredData}
        width={containerSize.width}
        height={containerSize.height}
        nodeColor="color"
        nodeVal="val"
        nodeRelSize={4}
        nodeOpacity={0.9}
        // @ts-ignore
        warmupTicks={40}
        cooldownTicks={200}
        backgroundColor="transparent"
      />

      {/* Info text */}
      <div className="absolute top-6 left-6 text-sm text-slate-300 pointer-events-none">
        <p className="font-semibold text-cyan-400 mb-2">Project Universe</p>
        <p className="text-xs text-slate-400 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 mr-2"></span>
          Shared technology
        </p>
        <p className="text-xs text-slate-400 mb-4">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
          Same category
        </p>
        <p className="text-xs text-slate-500">Scroll to zoom • Click to select • Double-click to reset</p>
      </div>

      {/* Stats */}
      <div className="absolute bottom-6 left-6 text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded border border-slate-700 pointer-events-none">
        <p>{filteredData.nodes.length} projects • {filteredData.links.length} connections</p>
      </div>
    </div>
  );
}
