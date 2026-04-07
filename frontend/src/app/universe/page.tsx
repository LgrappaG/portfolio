'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Star, GitFork } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  html_url: string;
  homepage: string | null;
}

export default function UniversePage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Repo | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/users/LgrappaG/repos?per_page=100&sort=stars')
      .then(r => r.json())
      .then(data => {
        setRepos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Project Universe</h1>
        <p className="text-slate-300 mb-12">Explore all GitHub projects</p>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <div
                key={repo.id}
                onClick={() => setSelected(repo)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 cursor-pointer hover:bg-slate-700 transition-all hover:border-cyan-500"
              >
                <h2 className="text-xl font-semibold text-white mb-2">{repo.name}</h2>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{repo.description || 'No description'}</p>

                <div className="flex items-center gap-3 mb-4 text-sm text-slate-300">
                  {repo.language && <span className="px-2 py-1 bg-slate-700 rounded">{repo.language}</span>}
                  <span className="flex items-center gap-1"><Star className="w-4 h-4" />{repo.stargazers_count}</span>
                </div>

                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-cyan-400 text-sm hover:underline"
                >
                  View on GitHub →
                </a>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selected && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
              />
              <motion.div
                className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 overflow-y-auto z-50"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30 }}
              >
                <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                  <button onClick={() => setSelected(null)} className="p-1 hover:bg-slate-800 rounded">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {selected.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-2">Description</h3>
                      <p className="text-slate-400 text-sm">{selected.description}</p>
                    </div>
                  )}

                  {selected.language && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-2">Language</h3>
                      <span className="px-3 py-1 bg-slate-800 text-cyan-400 text-xs rounded-full border border-slate-700">
                        {selected.language}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-slate-700">
                    <div className="text-center">
                      <div className="flex items-center justify-center text-yellow-400 mb-1">
                        <Star className="w-4 h-4 mr-1" />
                        {selected.stargazers_count}
                      </div>
                      <p className="text-xs text-slate-400">Stars</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center text-slate-300 mb-1">
                        <GitFork className="w-4 h-4 mr-1" />
                        {selected.forks_count}
                      </div>
                      <p className="text-xs text-slate-400">Forks</p>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-300 mb-1">{selected.open_issues_count}</div>
                      <p className="text-xs text-slate-400">Issues</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={selected.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-slate-700"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm font-medium">GitHub</span>
                    </a>
                    {selected.homepage && (
                      <a
                        href={selected.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Visit</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
