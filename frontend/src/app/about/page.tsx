'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function About() {
  const skills = [
    {
      category: 'Game Development',
      icon: '🎮',
      items: ['Unity (C#)', 'Godot', 'Game Physics', 'Gameplay Mechanics', '2D & 3D', 'Audio Integration']
    },
    {
      category: 'Programming',
      icon: '💻',
      items: ['C# (Expert)', 'C++', 'TypeScript', 'Object-Oriented Design', 'Design Patterns', 'Git & Version Control']
    },
    {
      category: 'Tools & Other',
      icon: '🛠️',
      items: ['React & Next.js', 'Blender (3D)', 'UI/UX Design', 'Level Design', 'Asset Management', 'Scripting']
    },
    {
      category: 'VR & XR',
      icon: '🥽',
      items: ['VR Development', 'Meta Quest / Oculus', 'SteamVR', 'VR Interactions & Locomotion', 'VR UI/UX Design', 'Mixed Reality (XR)']
    }
  ];

  const experience = [
    {
      role: 'Senior Game Developer',
      company: 'Independent Developer',
      period: '2021 - Present',
      desc: 'Creating commercial and indie games, focusing on gameplay mechanics and player experience'
    },
    {
      role: 'Game Developer',
      company: 'Game Studio',
      period: '2020 - 2021',
      desc: 'Developed games using Unity, implemented physics systems and gameplay mechanics'
    },
    {
      role: 'Game Development Enthusiast',
      company: 'Personal Projects',
      period: '2019 - 2020',
      desc: 'Started game development journey, built foundations in C# and game design'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-black dark:text-white">
      {/* Hero Section */}
      <section className="py-24 md:py-32 border-b border-slate-200 dark:border-slate-800">
        <div className="container-max container-px">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="text-sm md:text-base tracking-widest text-amber-600 dark:text-amber-400 font-light uppercase mb-4">
              About
            </p>
            <h1 className="text-5xl md:text-7xl font-black italic mb-6 leading-tight">
              Game Developer & Full Stack Developer
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed font-light max-w-2xl">
              Passionate about creating immersive gameplay experiences and engaging interactive worlds with modern technologies
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-24 md:py-32 border-b border-slate-200 dark:border-slate-800">
        <div className="container-max container-px">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Left - Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full aspect-square max-w-sm">
                {/* Image with Border */}
                <div className="w-full h-full relative rounded-lg overflow-hidden border-2 border-slate-300 dark:border-slate-700">
                  <img
                    src="/portfolio/images/about.jpg"
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Decorative Border */}
                <div className="absolute -inset-4 border border-dashed border-amber-500 dark:border-amber-400 rounded-lg opacity-30"></div>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-black italic mb-8">Who I Am</h2>
              <div className="space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                <p>
                  I'm a passionate game developer specializing in Unity and C# with 5+ years of experience creating games and interactive experiences. I focus on gameplay mechanics, physics systems, and creating engaging player experiences.
                </p>
                <p>
                  My game development journey started in 2019-2020, where I built foundations in game design and C# programming. Since then, I've been developing games using Unity, creating everything from 2D platformers to 3D adventure games.
                </p>
                <p>
                  I also have frontend web development experience with React and TypeScript, but my primary focus is game development with C#, C++, and creating immersive gaming experiences using modern game engines.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 md:py-32 border-b border-slate-200 dark:border-slate-800">
        <div className="container-max container-px">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black italic">Skills & Technologies</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((skillGroup, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-8 hover:border-amber-500 dark:hover:border-amber-400 transition-colors"
              >
                <p className="text-4xl mb-4">{skillGroup.icon}</p>
                <h3 className="text-xl font-black mb-6 italic">{skillGroup.category}</h3>
                <ul className="space-y-3">
                  {skillGroup.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                      <span className="text-amber-600 dark:text-amber-400 font-black mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 md:py-32 border-b border-slate-200 dark:border-slate-800">
        <div className="container-max container-px">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black italic">Experience</h2>
          </motion.div>

          <div className="space-y-6">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-colors p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black">{exp.role}</h3>
                    <p className="text-lg font-semibold text-amber-600 dark:text-amber-400 mt-2">{exp.company}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{exp.period}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{exp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              <h2 className="text-4xl md:text-5xl font-black italic">
                Let's Create Something Amazing
              </h2>
              <p className="text-lg md:text-xl text-gray-300 dark:text-gray-700 italic font-light">
                Have a game project or collaboration idea? Let's connect and bring your vision to life
              </p>
              <motion.a
                href="/portfolio/contact/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-semibold hover:gap-3 transition-all"
              >
                Get In Touch <ArrowRight size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
