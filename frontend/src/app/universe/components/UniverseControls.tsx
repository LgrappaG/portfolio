'use client';

import { ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { useUniverseStore } from '@/lib/store/universeStore';

export function UniverseControls() {
  const zoomLevel = useUniverseStore((s) => s.zoomLevel);
  const filters = useUniverseStore((s) => s.filters);
  const zoomIn = useUniverseStore((s) => s.zoomIn);
  const zoomOut = useUniverseStore((s) => s.zoomOut);
  const setFilter = useUniverseStore((s) => s.setFilter);
  const clearFilters = useUniverseStore((s) => s.clearFilters);

  return (
    <div className="absolute top-6 right-6 flex flex-col gap-4 pointer-events-auto z-10">
      {/* Zoom Controls */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-2 backdrop-blur-sm">
        <button
          onClick={zoomIn}
          disabled={zoomLevel >= 5}
          className="w-10 h-10 flex items-center justify-center hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
          title="Zoom in"
        >
          <ChevronUp className="w-5 h-5 text-slate-200" />
        </button>

        <div className="text-center text-xs font-semibold text-slate-300 py-2 px-3 border-y border-slate-700">
          {zoomLevel} / 5
        </div>

        <button
          onClick={zoomOut}
          disabled={zoomLevel <= 1}
          className="w-10 h-10 flex items-center justify-center hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
          title="Zoom out"
        >
          <ChevronDown className="w-5 h-5 text-slate-200" />
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3 backdrop-blur-sm min-w-max">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-slate-300" />
          <span className="text-xs font-semibold text-slate-300">Category</span>
        </div>

        <div className="space-y-2">
          {['all', 'web-dev', 'game-dev', 'tools'].map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filters.category === cat}
                onChange={() => setFilter('category', cat)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border-2 transition ${
                  filters.category === cat
                    ? 'bg-cyan-500 border-cyan-500'
                    : 'border-slate-600 group-hover:border-slate-500'
                }`}
              />
              <span className="text-sm text-slate-300 group-hover:text-slate-200 transition capitalize">
                {cat.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>

        {filters.category !== 'all' && (
          <button
            onClick={clearFilters}
            className="mt-3 w-full px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3 backdrop-blur-sm min-w-max">
        <p className="text-xs font-semibold text-slate-300 mb-3">Legend</p>

        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3" viewBox="0 0 12 2">
              <line
                x1="0"
                y1="1"
                x2="12"
                y2="1"
                stroke="#06b6d4"
                strokeWidth="1.5"
                opacity="0.4"
              />
            </svg>
            <span>Shared technology</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-3 h-3" viewBox="0 0 12 2">
              <line
                x1="0"
                y1="1"
                x2="12"
                y2="1"
                stroke="#a855f7"
                strokeWidth="1"
                opacity="0.3"
              />
            </svg>
            <span>Same category</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-400" />
            <span>Node color = language</span>
          </div>
        </div>
      </div>
    </div>
  );
}
