'use client';

import React, { useState, useMemo } from 'react';
import { useUniverseStore, selectFilteredGraphData } from '@/lib/store/universeStore';
import type { GraphNode } from '@/types/graph';

interface UniverseGraphProps {
  onNodeClick?: (node: GraphNode) => void;
}

export function UniverseGraph({ onNodeClick }: UniverseGraphProps) {
  const graphData = useUniverseStore((s) => s.graphData);
  const filters = useUniverseStore((s) => s.filters);

  // Get filtered data
  const filteredData = useMemo(() => {
    const state = useUniverseStore.getState();
    return selectFilteredGraphData(state);
  }, [graphData, filters]);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  if (!filteredData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-sm">Loading Project Universe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-900 to-slate-950 overflow-auto">
      {/* Grid of projects */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => onNodeClick?.(node)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="group relative p-4 bg-slate-800/50 border border-slate-700 rounded-lg cursor-pointer transition-all duration-200 hover:border-cyan-500 hover:bg-slate-700/50 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                {/* Node sizing circle indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <div
                    className="rounded-full transition-all"
                    style={{
                      width: `${Math.max(node.val / 100, 3)}px`,
                      height: `${Math.max(node.val / 100, 3)}px`,
                      backgroundColor: node.color,
                    }}
                  />
                </div>

                {/* Name */}
                <h3 className="text-sm font-bold text-white mb-2 pr-12 line-clamp-2">
                  {node.name}
                </h3>

                {/* Language badge */}
                {node.language && (
                  <div className="mb-3">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-700 text-cyan-400 rounded border border-slate-600">
                      {node.language}
                    </span>
                  </div>
                )}

                {/* Description */}
                {node.description && (
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                    {node.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                  <span>⭐ {node.stars}</span>
                  <span>🔀 {node.forks}</span>
                  <span>🐛 {node.issues}</span>
                </div>

                {/* Category badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-900 text-slate-300 rounded capitalize">
                    {node.category.replace('-', ' ')}
                  </span>
                </div>

                {/* Hover overlay */}
                {hoveredNodeId === node.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 rounded-lg pointer-events-none" />
                )}
              </div>
            ))}
          </div>

          {filteredData.nodes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No projects match the selected filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Info overlay */}
      <div className="absolute bottom-6 left-6 text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded border border-slate-700 pointer-events-none backdrop-blur-sm">
        <p>{filteredData.nodes.length} projects • {filteredData.links.length} connections</p>
      </div>
    </div>
  );
}
