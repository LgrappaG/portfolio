'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Eye, Github } from 'lucide-react';

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  html_url: string;
  topics: string[];
}

export default function Projects() {
  const [stats, setStats] = useState({ repos: 0, stars: 0, followers: 0 });
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user stats
        const userRes = await fetch('https://api.github.com/users/LgrappaG');
        const userData = await userRes.json();

        // Fetch repositories
        const reposRes = await fetch('https://api.github.com/users/LgrappaG/repos?per_page=100&sort=stars');
        const reposData = await reposRes.json();

        // Check for API errors
        if (!userRes.ok || !reposRes.ok) {
          console.error('GitHub API error:', userRes.status, reposRes.status);
          throw new Error(`GitHub API error: ${userRes.status} ${reposRes.status}`);
        }

        console.log('Fetched repos:', reposData.length, 'repos');
        console.log('Raw repos:', reposData.map((r: GitHubRepo) => ({
          name: r.name,
          language: r.language,
          description: r.description,
          topics: r.topics
        })));

        // Filter game dev related projects (C#, Unity, Godot keywords)
        const gameProjects = reposData
          .filter((repo: GitHubRepo) => {
            const isGameDev =
              repo.language === 'C#' ||
              repo.language === 'C++' ||
              (repo.description && (repo.description.toLowerCase().includes('game') || repo.description.toLowerCase().includes('unity'))) ||
              repo.topics?.some((t: string) => ['game', 'unity', 'gamedev', 'game-development', 'c-sharp'].includes(t.toLowerCase()));

            if (isGameDev) {
              console.log('✓ Matched:', repo.name, '| Lang:', repo.language, '| Desc:', repo.description?.substring(0, 40));
            }
            return isGameDev;
          })
          .slice(0, 12);

        console.log('Filtered game projects:', gameProjects.length);

        let totalStars = 0;
        reposData.forEach((repo: GitHubRepo) => {
          totalStars += repo.stargazers_count || 0;
        });

        setStats({
          repos: userData.public_repos || 0,
          stars: totalStars,
          followers: userData.followers || 0
        });

        // If no game dev projects found, show recent public repos as fallback
        const projectsToShow = gameProjects.length > 0 ? gameProjects : reposData.slice(0, 12);
        console.log('Projects to display:', projectsToShow.length);
        setProjects(projectsToShow);
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
        // Keep previous state on error (don't clear projects)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="container-max container-px py-12 md:py-20">
      {/* Header */}
      <section className="mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">🎮 My Games & Projects</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          A collection of game development projects featuring C#, Unity, and gameplay mechanics.
        </p>
      </section>

      {/* Projects Grid */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-16 md:mb-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && !projects.length ? (
            <div className="col-span-full text-center p-8">
              <p className="text-slate-500">Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <motion.a
                key={project.id}
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="card-base p-6 cursor-pointer group overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-400/50 dark:hover:border-blue-500/50"
              >
                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center group-hover:shadow-lg transition-shadow relative">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all rounded-lg"></div>
                  <Github size={48} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-300 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors">
                  {project.name}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm line-clamp-2">
                  {project.description || 'No description'}
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {project.language && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                      {project.language}
                    </span>
                  )}
                  {project.topics?.slice(0, 2).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    {project.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {project.watchers_count}
                  </span>
                </div>
              </motion.a>
            ))
          ) : (
            <div className="col-span-full text-center p-8">
              <p className="text-slate-500">No game dev projects found</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Stats */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">By The Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Repositories", value: loading ? '...' : stats.repos, icon: '📦' },
            { label: "GitHub Stars", value: loading ? '...' : stats.stars, icon: '⭐' },
            { label: "Community", value: loading ? '...' : stats.followers, icon: '👥' }
          ].map((stat, i) => (
            <div key={i} className="card-base p-6 text-center border-2 border-transparent hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-colors">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <p className="text-slate-700 dark:text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Have a Project in Mind?</h2>
        <p className="text-lg mb-8 opacity-90">Let's discuss how I can help bring your vision to life</p>
        <a
          href="/portfolio/contact/"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
        >
          Start a Project
        </a>
      </section>
    </div>
  );
}
