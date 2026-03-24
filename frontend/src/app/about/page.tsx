export default function About() {
  return (
    <div className="container-max container-px py-12 md:py-20">
      {/* Header */}
      <section className="mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">About Me</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Full Stack Developer & Game Developer passionate about creating beautiful, functional digital experiences.
        </p>
      </section>

      {/* Bio */}
      <section className="mb-16 md:mb-24">
        <div className="card-base p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Who I Am</h2>
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <p>
              I'm a passionate full-stack developer with 5+ years of experience building web applications and games.
              I specialize in React, Next.js, TypeScript, and modern web technologies.
            </p>
            <p>
              Beyond web development, I'm also interested in game development using Unity and Godot, combining my love
              for interactive experiences with solid engineering practices.
            </p>
            <p>
              I believe in writing clean, maintainable code and creating user-focused solutions that solve real problems.
            </p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Frontend */}
          <div className="card-base p-6">
            <h3 className="text-xl font-bold mb-4">Frontend</h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li>• React & Next.js 14</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Framer Motion</li>
              <li>• Zustand</li>
            </ul>
          </div>

          {/* Backend */}
          <div className="card-base p-6">
            <h3 className="text-xl font-bold mb-4">Backend</h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li>• Node.js & Express</li>
              <li>• PostgreSQL</li>
              <li>• Prisma ORM</li>
              <li>• Redis</li>
              <li>• RESTful APIs</li>
            </ul>
          </div>

          {/* Game Dev */}
          <div className="card-base p-6">
            <h3 className="text-xl font-bold mb-4">Game Development</h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li>• Unity (C#)</li>
              <li>• Godot (GDScript)</li>
              <li>• Game Physics</li>
              <li>• UI/UX Design</li>
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
              role: "Senior Full Stack Developer",
              company: "Tech Company",
              period: "2023 - Present",
              desc: "Leading frontend development and architecture decisions"
            },
            {
              role: "Full Stack Developer",
              company: "Startup",
              period: "2021 - 2023",
              desc: "Built and maintained production applications"
            },
            {
              role: "Junior Developer",
              company: "Agency",
              period: "2019 - 2021",
              desc: "Started career building web applications"
            }
          ].map((exp, i) => (
            <div key={i} className="card-base p-6 border-l-4 border-blue-600">
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

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
        <p className="text-lg mb-8 opacity-90">Have a project or opportunity? Let's connect!</p>
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
