'use client';

import { useEffect } from 'react';
import { useUniverseStore } from '@/lib/store/universeStore';
import { UniverseGraph } from './components/UniverseGraph';
import { UniversePanel } from './components/UniversePanel';
import { UniverseControls } from './components/UniverseControls';

export default function UniversePage() {
  const graphData = useUniverseStore((s) => s.graphData);
  const selectedNode = useUniverseStore((s) => s.selectedNode);
  const isLoading = useUniverseStore((s) => s.isLoading);
  const error = useUniverseStore((s) => s.error);
  const fetchGraphData = useUniverseStore((s) => s.fetchGraphData);
  const selectNode = useUniverseStore((s) => s.selectNode);

  // Fetch graph data on mount
  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const handleClosePanel = () => {
    selectNode(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-950 overflow-hidden">
      {/* Loading State */}
      {isLoading && !graphData && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-300 text-sm">Loading Project Universe...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-md text-center">
            <p className="text-red-400 text-sm font-medium mb-2">Error Loading Graph</p>
            <p className="text-red-300/80 text-xs">{error}</p>
          </div>
        </div>
      )}

      {/* Graph View */}
      {graphData && !isLoading && (
        <>
          <div className="flex-1 relative">
            <UniverseGraph />
            <UniverseControls />
          </div>

          <UniversePanel
            selectedNode={selectedNode}
            onClose={handleClosePanel}
            allLinks={graphData.links}
            allNodes={graphData.nodes}
          />
        </>
      )}
    </div>
  );
}
