'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, Eye } from 'lucide-react';

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
          throw new Error(`GitHub API error: ${userRes.status} ${reposRes.status}`);
        }

        // Filter game dev related projects (C#, Unity, Godot keywords)
        const gameProjects = reposData
          .filter((repo: GitHubRepo) => {
            const isGameDev =
              repo.language === 'C#' ||
              repo.language === 'C++' ||
              (repo.description && (repo.description.toLowerCase().includes('game') || repo.description.toLowerCase().includes('unity'))) ||
              repo.topics?.some((t: string) => ['game', 'unity', 'gamedev', 'game-development', 'c-sharp'].includes(t.toLowerCase()));
            return isGameDev;
          })
          .slice(0, 6);

        let totalStars = 0;
        reposData.forEach((repo: GitHubRepo) => {
          totalStars += repo.stargazers_count || 0;
        });

        setStats({
          repos: userData.public_repos || 0,
          stars: totalStars,
          followers: userData.followers || 0
        });

        setProjects(gameProjects);
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
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 py-20 md:py-32">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container-max container-px relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
            >
              <Github size={18} className="text-blue-400" />
              <span className="text-sm text-blue-400 font-semibold">@LgrappaG</span>
            </motion.div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient leading-tight">
              Game Developer
              <br />
              & Software Engineer
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Creating immersive gaming experiences with C# and Unity. Specialized in gameplay mechanics, physics systems,
              and interactive world building.
            </p>

            {/* CTA Buttons */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex gap-4 justify-center flex-wrap"
            >
              <motion.a
                href="/portfolio/projects/"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold"
              >
                View Projects
              </motion.a>
              <motion.a
                href="/portfolio/contact/"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-slate-400 text-slate-300 rounded-lg hover:bg-slate-400/10 hover:border-slate-300 transition-all font-semibold"
              >
                Contact
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="container-max container-px py-16 md:py-24">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-24"
        >
          {[
            { label: 'Game Projects', value: loading ? '...' : stats.repos, icon: '🎮' },
            { label: 'GitHub Stars', value: loading ? '...' : stats.stars, icon: '⭐' },
            { label: 'Community', value: loading ? '...' : stats.followers, icon: '👥' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="card-base p-8 text-center hover:scale-105 transition-transform border-2 border-transparent hover:border-blue-400/50 dark:hover:border-blue-500/50"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Featured Projects */}
        <motion.section
          id="projects"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">🎮 My Games & Projects</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              A collection of game development projects featuring C#, Unity, and gameplay mechanics
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
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
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Your Next Game?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Whether it's a game project, technical collaboration, or just want to discuss game development - let's connect!
          </p>
          <motion.a
            href="/portfolio/contact/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-slate-100 transition-colors"
          >
            Get In Touch
          </motion.a>
        </motion.section>
      </div>
    </div>
  );
}
