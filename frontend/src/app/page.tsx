'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({ repos: 0, stars: 0, followers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const userRes = await fetch('https://api.github.com/users/LgrappaG');
        const userData = await userRes.json();

        const reposRes = await fetch('https://api.github.com/users/LgrappaG/repos?per_page=100');
        const reposData = await reposRes.json();

        let totalStars = 0;
        reposData.forEach((repo: any) => {
          totalStars += repo.stargazers_count || 0;
        });

        setStats({
          repos: userData.public_repos || 0,
          stars: totalStars,
          followers: userData.followers || 0
        });
      } catch (error) {
        console.error('Failed to fetch GitHub stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
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
              Full Stack Developer
              <br />
              & Game Dev
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Building beautiful digital experiences with modern web technologies and creating engaging games.
              Check out my projects below.
            </p>

            {/* CTA Buttons */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex gap-4 justify-center flex-wrap"
            >
              <motion.a
                href="#projects"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold"
              >
                View Projects
              </motion.a>
              <motion.a
                href="/about"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-slate-400 text-slate-300 rounded-lg hover:bg-slate-400/10 hover:border-slate-300 transition-all font-semibold"
              >
                About Me
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
            { label: 'Repositories', value: loading ? '...' : stats.repos, icon: '📦' },
            { label: 'GitHub Stars', value: loading ? '...' : stats.stars, icon: '⭐' },
            { label: 'Followers', value: loading ? '...' : stats.followers, icon: '👥' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="card-base p-8 text-center hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">🚀 Featured Projects</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              A selection of my best work in web development and game creation
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                name: 'E-Commerce Platform',
                desc: 'Full-stack e-commerce solution with payment integration',
                tech: ['React', 'Node.js', 'PostgreSQL'],
                color: 'from-blue-500 to-cyan-500',
              },
              {
                name: 'CMS Dashboard',
                desc: 'Modern content management system with real-time updates',
                tech: ['Next.js', 'TypeScript', 'Tailwind'],
                color: 'from-purple-500 to-pink-500',
              },
              {
                name: '2D Platformer Game',
                desc: 'Indie platformer game with multiple levels and mechanics',
                tech: ['Unity', 'C#'],
                color: 'from-green-500 to-emerald-500',
              },
            ].map((project, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="card-base p-6 cursor-pointer group overflow-hidden"
              >
                <div className={`h-48 bg-gradient-to-br ${project.color} rounded-lg mb-4 flex items-center justify-center group-hover:shadow-xl transition-shadow`}>
                  <span className="text-white font-bold text-center px-4 text-lg">{project.name}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">{project.desc}</p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {project.tech.map((tech, t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href="/projects"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm"
                >
                  View All Projects →
                </a>
              </motion.div>
            ))}
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Build Something Amazing</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Have a project in mind? I'm always interested in hearing about new opportunities and collaborations.
          </p>
          <motion.a
            href="/contact"
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
