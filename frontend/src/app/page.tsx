'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, Eye, ArrowRight } from 'lucide-react';

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

export default function Home() {
  const [stats, setStats] = useState({ repos: 0, stars: 0, followers: 0 });
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [featuredProject, setFeaturedProject] = useState<GitHubRepo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch('https://api.github.com/users/LgrappaG');
        const userData = await userRes.json();

        const reposRes = await fetch('https://api.github.com/users/LgrappaG/repos?per_page=100&sort=stars');
        const reposData = await reposRes.json();

        // Fetch featured project
        const featuredRes = await fetch('https://api.github.com/repos/LgrappaG/Workflows-Agents');
        const featuredData = await featuredRes.json();

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
          .slice(0, 3);

        let totalStars = 0;
        reposData.forEach((repo: GitHubRepo) => {
          totalStars += repo.stargazers_count || 0;
        });

        setStats({
          repos: userData.public_repos || 0,
          stars: totalStars,
          followers: userData.followers || 0
        });

        const projectsToShow = gameProjects.length > 0 ? gameProjects : reposData.slice(0, 3);
        setProjects(projectsToShow);

        if (featuredRes.ok && featuredData.id) {
          setFeaturedProject(featuredData);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white dark:text-black">
      {/* Hero Section - Elegant with Sidebar */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="container-max container-px">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            {/* Sidebar - Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 space-y-8"
            >
              {/* Decorative Element */}
              <div className="inline-block">
                <div className="w-1 h-12 bg-gradient-to-b from-amber-500 to-orange-500"></div>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <p className="text-sm md:text-base tracking-widest text-amber-600 dark:text-amber-400 font-light uppercase">
                  Welcome to my portfolio
                </p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold italic text-black dark:text-white leading-tight">
                  Game Developer & Full Stack Developer
                </h1>
              </div>

              {/* Bio */}
              <p className="text-lg md:text-xl text-slate-300 dark:text-slate-700 leading-relaxed italic font-light max-w-md">
                Crafting immersive gaming experiences with C# and Unity, combined with full-stack web development expertise.
              </p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <a
                  href="/portfolio/projects/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-black text-black dark:text-white font-semibold hover:gap-3 transition-all"
                >
                  Explore Projects <ArrowRight size={18} />
                </a>
                <a
                  href="/portfolio/contact/"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white dark:border-black text-white dark:text-black font-semibold hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all"
                >
                  Get In Touch
                </a>
              </motion.div>

              {/* Social Links */}
              <div className="flex gap-6 pt-8 border-t border-slate-700 dark:border-slate-300">
                <a href="https://github.com/LgrappaG" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-600 hover:text-white dark:hover:text-black transition-colors">
                  <Github size={24} />
                </a>
              </div>
            </motion.div>

            {/* Content Area - Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="lg:col-span-7"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                {[
                  { label: 'Projects', value: loading ? '—' : stats.repos, icon: '📦' },
                  { label: 'Stars', value: loading ? '—' : stats.stars, icon: '⭐' },
                  { label: 'Followers', value: loading ? '—' : stats.followers, icon: '👥' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-center p-6 bg-slate-900/50 dark:bg-slate-50 border border-slate-800 dark:border-slate-200"
                  >
                    <p className="text-3xl mb-2">{stat.icon}</p>
                    <p className="text-2xl md:text-3xl font-bold text-gradient mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-400 dark:text-slate-600 uppercase tracking-wide">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Featured Work */}
              {loading ? (
                <div className="bg-gradient-to-br from-slate-900 dark:from-slate-100 to-slate-950 dark:to-slate-50 aspect-video rounded border border-slate-800 dark:border-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-slate-400 dark:text-slate-600 text-sm">Loading featured project...</p>
                  </div>
                </div>
              ) : featuredProject ? (
                <motion.a
                  href={featuredProject.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="block"
                >
                  <div className="bg-gradient-to-br from-slate-900 dark:from-slate-100 to-slate-950 dark:to-slate-50 aspect-video rounded border border-slate-800 dark:border-slate-200 hover:border-amber-500 dark:hover:border-amber-400 transition-all p-8 flex flex-col justify-between cursor-pointer group overflow-hidden relative">
                    {/* Accent line */}
                    <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-amber-500 to-orange-500 group-hover:h-full transition-all duration-500"></div>

                    {/* Content */}
                    <div className="pl-4">
                      <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-600 font-semibold mb-3">
                        {featuredProject.language || 'Project'} • Featured
                      </p>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-gradient transition-colors text-white dark:text-black">
                        {featuredProject.name}
                      </h3>
                      <p className="text-sm text-slate-300 dark:text-slate-700 line-clamp-2 italic font-light">
                        {featuredProject.description || 'No description available'}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-slate-300 dark:text-slate-700 pl-4 pt-4 border-t border-slate-800 dark:border-slate-200">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1 font-semibold">
                          <Star size={14} />
                          {featuredProject.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Eye size={14} />
                          {featuredProject.watchers_count}
                        </span>
                      </div>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.a>
              ) : (
                <div className="bg-gradient-to-br from-slate-900 dark:from-slate-100 to-slate-950 dark:to-slate-50 aspect-video rounded border border-slate-800 dark:border-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-3">🎮</div>
                    <p className="text-slate-400 dark:text-slate-600 text-sm">Featured work unavailable</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* Featured Projects Section */}
      <section className="py-24 md:py-32">
        <div className="container-max container-px">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4 mb-16"
          >
            <div className="inline-block">
              <div className="w-1 h-12 bg-gradient-to-b from-amber-500 to-orange-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold italic">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-lg text-slate-400 dark:text-slate-600 max-w-2xl italic font-light">
              A selection of my most recent and impactful game development work
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  {/* Project Card */}
                  <div className="bg-slate-900/50 dark:bg-slate-50 border border-slate-800 dark:border-slate-200 hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-300 aspect-square flex flex-col justify-between p-6 relative overflow-hidden">
                    {/* Accent line */}
                    <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-amber-500 to-orange-500 group-hover:h-full transition-all duration-500"></div>

                    {/* Content */}
                    <div className="pl-4">
                      <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-3">
                        {project.language || 'Project'}
                      </p>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-colors text-white dark:text-black">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-300 dark:text-slate-700 line-clamp-2 italic font-light">
                        {project.description || 'No description available'}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-slate-300 dark:text-slate-700 pl-4 pt-4 border-t border-slate-800 dark:border-slate-200">
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1">
                          <Star size={14} />
                          {project.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
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

          {/* View All Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex justify-center mt-16"
          >
            <a
              href="/portfolio/projects/"
              className="inline-flex items-center gap-2 text-lg font-semibold text-white dark:text-black hover:text-gradient transition-colors group"
            >
              View All Projects <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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
            className="bg-black/50 dark:bg-white/30 text-white dark:text-black p-12 md:p-16 lg:p-20 backdrop-blur-sm"
          >
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold italic">
                Let's Collaborate
              </h2>
              <p className="text-lg md:text-xl text-gray-300 dark:text-gray-700 italic font-light">
                Whether you have a game project in mind, need technical guidance, or want to discuss game development innovations, I'm ready to help bring your vision to life.
              </p>
              <motion.a
                href="/portfolio/contact/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-semibold hover:gap-3 transition-all"
              >
                Start a Conversation <ArrowRight size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
