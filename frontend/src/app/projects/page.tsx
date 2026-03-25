'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Eye, ArrowRight } from 'lucide-react';
import Image from 'next/image';

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
        const userRes = await fetch('https://api.github.com/users/LgrappaG');
        const userData = await userRes.json();

        const reposRes = await fetch('https://api.github.com/users/LgrappaG/repos?per_page=100&sort=stars');
        const reposData = await reposRes.json();

        if (!userRes.ok || !reposRes.ok) {
          console.error('GitHub API error:', userRes.status, reposRes.status);
          throw new Error(`GitHub API error: ${userRes.status} ${reposRes.status}`);
        }

        const gameProjects = reposData
          .filter((repo: GitHubRepo) => {
            const isGameDev =
              repo.language === 'C#' ||
              repo.language === 'C++' ||
              (repo.description && (repo.description.toLowerCase().includes('game') || repo.description.toLowerCase().includes('unity'))) ||
              repo.topics?.some((t: string) => ['game', 'unity', 'gamedev', 'game-development', 'c-sharp'].includes(t.toLowerCase()));
            return isGameDev;
          })
          .slice(0, 12);

        let totalStars = 0;
        reposData.forEach((repo: GitHubRepo) => {
          totalStars += repo.stargazers_count || 0;
        });

        setStats({
          repos: userData.public_repos || 0,
          stars: totalStars,
          followers: userData.followers || 0
        });

        const projectsToShow = gameProjects.length > 0 ? gameProjects : reposData.slice(0, 12);
        setProjects(projectsToShow);
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <section className="py-24 md:py-32 border-b border-slate-200 dark:border-slate-800">
        <div className="container-max container-px">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm md:text-base tracking-widest text-amber-600 dark:text-amber-400 font-light uppercase mb-4">
                Projects
              </p>
              <h1 className="text-5xl md:text-7xl font-black italic mb-6 leading-tight">
                All Projects & Works
              </h1>
              <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed font-light max-w-2xl">
                Complete collection of game development projects featuring C#, Unity, and innovative gameplay mechanics
              </p>
            </motion.div>

            {/* Right - Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full aspect-video max-w-md mx-auto lg:mx-0"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-slate-300 dark:border-slate-700">
                <Image
                  src="/images/project.jpg"
                  alt="Projects showcase"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 md:py-32">
        <div className="container-max container-px">
          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {[
              { label: 'Total Repositories', value: loading ? '—' : stats.repos, icon: '📦' },
              { label: 'GitHub Stars', value: loading ? '—' : stats.stars, icon: '⭐' },
              { label: 'Community', value: loading ? '—' : stats.followers, icon: '👥' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-6 text-center"
              >
                <p className="text-3xl mb-2">{stat.icon}</p>
                <p className="text-2xl md:text-3xl font-black text-gradient mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-widest font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500">Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              projects.map((project, i) => (
                <motion.a
                  key={project.id}
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  {/* Project Card */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-300 h-full flex flex-col justify-between p-6 relative overflow-hidden">
                    {/* Accent line */}
                    <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-amber-500 to-orange-500 group-hover:h-full transition-all duration-500"></div>

                    {/* Content */}
                    <div className="pl-4">
                      <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold mb-3">
                        {project.language || 'Project'}
                      </p>
                      <h3 className="text-lg md:text-xl font-black mb-3 group-hover:text-gradient transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 italic font-light">
                        {project.description || 'No description available'}
                      </p>
                    </div>

                    {/* Tags */}
                    {project.topics && project.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 my-4 pl-4">
                        {project.topics.slice(0, 2).map((topic) => (
                          <span key={topic} className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 pl-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1 font-semibold">
                          <Star size={14} />
                          {project.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Eye size={14} />
                          {project.watchers_count}
                        </span>
                      </div>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.a>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500">No projects found</p>
              </div>
            )}
          </div>

          {/* View More CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <a
              href="https://github.com/LgrappaG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold hover:gap-3 transition-all"
            >
              View on GitHub <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="container-max container-px">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black dark:bg-white text-white dark:text-black p-12 md:p-16 lg:p-20"
          >
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-black italic">
                Have a Project in Mind?
              </h2>
              <p className="text-lg md:text-xl text-gray-300 dark:text-gray-700 italic font-light">
                Let's discuss how I can help bring your game project to life
              </p>
              <motion.a
                href="/portfolio/contact/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-semibold hover:gap-3 transition-all"
              >
                Start a Project <ArrowRight size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
