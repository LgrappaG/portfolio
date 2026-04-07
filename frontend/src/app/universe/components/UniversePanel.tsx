'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Star, GitFork, AlertCircle } from 'lucide-react';
import type { GraphNode, GraphLink } from '@/types/graph';

interface UniversePanelProps {
  selectedNode: GraphNode | null;
  onClose: () => void;
  allLinks: GraphLink[];
  allNodes: GraphNode[];
}

export function UniversePanel({
  selectedNode,
  onClose,
  allLinks,
  allNodes,
}: UniversePanelProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedNode) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, onClose]);

  // Get connected nodes (related projects)
  const getConnectedNodes = () => {
    if (!selectedNode) return [];

    const connectedIds = new Set<string>();
    allLinks.forEach((link) => {
      const source = String(link.source);
      const target = String(link.target);

      if (source === selectedNode.id) connectedIds.add(target);
      if (target === selectedNode.id) connectedIds.add(source);
    });

    return Array.from(connectedIds)
      .map((id) => allNodes.find((n) => n.id === id))
      .filter(Boolean) as GraphNode[];
  };

  const connectedProjects = getConnectedNodes();

  // Get link type to connected node
  const getLinkType = (connectedId: string) => {
    const link = allLinks.find((l) => {
      const source = String(l.source);
      const target = String(l.target);
      return (
        (source === selectedNode?.id && target === connectedId) ||
        (target === selectedNode?.id && source === connectedId)
      );
    });
    return link?.type || 'unknown';
  };

  // Get link label
  const getLinkLabel = (connectedId: string) => {
    const link = allLinks.find((l) => {
      const source = String(l.source);
      const target = String(l.target);
      return (
        (source === selectedNode?.id && target === connectedId) ||
        (target === selectedNode?.id && source === connectedId)
      );
    });
    return link?.label || '';
  };

  return (
    <AnimatePresence>
      {selectedNode && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 overflow-y-auto z-50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-700 p-6 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate">
                  {selectedNode.name}
                </h2>
                {selectedNode.language && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-slate-800 text-cyan-400 rounded border border-slate-700">
                    {selectedNode.language}
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 hover:bg-slate-800 rounded-lg transition"
                aria-label="Close panel"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Category Badge */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Category
                </h3>
                <span className="inline-block px-3 py-1 text-sm font-medium bg-slate-800 text-slate-300 rounded-full border border-slate-700 capitalize">
                  {selectedNode.category.replace('-', ' ')}
                </span>
              </div>

              {/* Description */}
              {selectedNode.description && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="text-center">
                  <div className="flex items-center justify-center text-yellow-400 mb-1">
                    <Star className="w-4 h-4 mr-1" />
                    {selectedNode.stars}
                  </div>
                  <p className="text-xs text-slate-400">Stars</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-slate-300 mb-1">
                    <GitFork className="w-4 h-4 mr-1" />
                    {selectedNode.forks}
                  </div>
                  <p className="text-xs text-slate-400">Forks</p>
                </div>
                <div className="text-center">
                  <div className="text-slate-300 mb-1 text-lg font-semibold">
                    {selectedNode.issues}
                  </div>
                  <p className="text-xs text-slate-400">Issues</p>
                </div>
              </div>

              {/* Topics */}
              {selectedNode.topics && selectedNode.topics.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.topics.map((topic) => (
                      <span
                        key={topic}
                        className="inline-block px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded border border-slate-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex gap-3 pt-2">
                <a
                  href={selectedNode.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-slate-700 transition text-sm font-medium"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>

                {selectedNode.homepage && (
                  <a
                    href={selectedNode.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit
                  </a>
                )}
              </div>

              {/* Related Projects */}
              {connectedProjects.length > 0 && (
                <div className="pt-4 border-t border-slate-700">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Related Projects ({connectedProjects.length})
                  </h3>
                  <div className="space-y-2">
                    {connectedProjects.map((project) => {
                      const linkType = getLinkType(project.id);
                      const linkLabel = getLinkLabel(project.id);
                      const isTechtLink = linkType === 'technology';

                      return (
                        <div
                          key={project.id}
                          className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition truncate"
                            >
                              {project.name}
                            </a>
                            <span
                              className={`flex-shrink-0 inline-block w-2 h-2 rounded-full ${
                                isTechtLink ? 'bg-cyan-500' : 'bg-purple-500'
                              }`}
                            />
                          </div>
                          {linkLabel && (
                            <p className="text-xs text-slate-400">{linkLabel}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No connections */}
              {connectedProjects.length === 0 && (
                <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-400">No connections to other projects</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
