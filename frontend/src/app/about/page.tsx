export default function About() {
  return (
    <div className="container-max container-px py-12 md:py-20">
      {/* Header */}
      <section className="mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">About Me</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Game Developer & Software Engineer passionate about creating immersive gameplay experiences and engaging interactive worlds.
        </p>
      </section>

      {/* Bio */}
      <section className="mb-16 md:mb-24">
        <div className="card-base p-8 border-2 border-transparent hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-colors">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Who I Am</h2>
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <p>
              I'm a passionate game developer specializing in Unity and C# with 5+ years of experience creating games and interactive experiences.
              I focus on gameplay mechanics, physics systems, and creating engaging player experiences.
            </p>
            <p>
              My game development journey started in 2019-2020, where I built foundations in game design and C# programming.
              Since then, I've been developing games using Unity, creating everything from 2D platformers to 3D adventure games.
            </p>
            <p>
              I also have frontend web development experience (React, TypeScript) from 2019-2020, but my primary focus is game development
              with C#, C++, and creating immersive gaming experiences using modern game engines.
            </p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Game Development */}
          <div className="card-base p-6 border-2 border-transparent hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-colors">
            <h3 className="text-xl font-bold mb-4">🎮 Game Development</h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li>• <strong>Unity</strong> (Primary)</li>
              <li>• C# (Advanced)</li>
              <li>• Game Physics</li>
              <li>• Gameplay Mechanics</li>
              <li>• 2D & 3D Development</li>
              <li>• Audio Integration</li>
            </ul>
          </div>

          {/* Programming */}
          <div className="card-base p-6 border-2 border-transparent hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-colors">
            <h3 className="text-xl font-bold mb-4">💻 Programming</h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li>• C# (Expert)</li>
              <li>• C++ (Intermediate)</li>
              <li>• TypeScript</li>
              <li>• Object-Oriented Design</li>
              <li>• Design Patterns</li>
              <li>• Git & Version Control</li>
            </ul>
          </div>

          {/* Tools & Other */}
          <div className="card-base p-6 border-2 border-transparent hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-colors">
            <h3 className="text-xl font-bold mb-4">🛠️ Tools & Other</h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li>• React & Next.js</li>
              <li>• Blender (3D)</li>
              <li>• Godot Engine</li>
              <li>• UI/UX Design</li>
              <li>• Level Design</li>
              <li>• Asset Management</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-3xl font-bold mb-8">Experience</h2>
        <div className="space-y-6">
          {[
            {
              role: "Senior Game Developer",
              company: "Independent Developer",
              period: "2021 - Present",
              desc: "Created multiple commercial and indie games, focusing on gameplay mechanics and player experience"
            },
            {
              role: "Game Developer",
              company: "Game Studio",
              period: "2020 - 2021",
              desc: "Developed games using Unity, implemented physics systems and gameplay mechanics"
            },
            {
              role: "Game Development Enthusiast",
              company: "Personal Projects",
              period: "2019 - 2020",
              desc: "Started game development journey, built foundations in C# and game design"
            },
            {
              role: "Frontend Developer",
              company: "Web Projects",
              period: "2019 - 2020",
              desc: "Limited frontend experience with React and TypeScript"
            }
          ].map((exp, i) => (
            <div key={i} className="card-base p-6 border-l-4 border-blue-600 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{exp.role}</h3>
                <span className="text-sm text-slate-500">{exp.period}</span>
              </div>
              <p className="font-semibold text-blue-600 mb-2">{exp.company}</p>
              <p className="text-slate-700 dark:text-slate-300">{exp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Games Shipped", value: "8+", icon: "🎮" },
            { label: "GitHub Stars", value: "250+", icon: "⭐" },
            { label: "Years Experience", value: "5+", icon: "🚀" }
          ].map((stat, i) => (
            <div key={i} className="card-base p-8 text-center border-2 border-transparent hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-colors hover:scale-105 duration-300">
              <div className="text-5xl mb-4">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-3">{stat.value}</div>
              <p className="text-slate-700 dark:text-slate-300 text-lg font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Let's Create Something Amazing</h2>
        <p className="text-lg mb-8 opacity-90">Have a game project or collaboration idea? Let's connect!</p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
        >
          Get In Touch
        </a>
      </section>
    </div>
  );
}
