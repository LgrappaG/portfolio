export default function Projects() {
  const projectCategories = {
    "Web Development": [
      { name: "E-Commerce Platform", tech: ["React", "Node.js", "PostgreSQL"], featured: true },
      { name: "CMS Dashboard", tech: ["Next.js", "TypeScript", "Tailwind"], featured: true },
      { name: "Real-time Chat App", tech: ["React", "WebSocket", "Express"] }
    ],
    "Game Development": [
      { name: "2D Platformer", tech: ["Unity", "C#"], featured: true },
      { name: "Puzzle Game", tech: ["Godot", "GDScript"] },
      { name: "3D Adventure", tech: ["Unity", "C#"] }
    ],
    "Tools & Libraries": [
      { name: "UI Component Library", tech: ["React", "TypeScript", "Storybook"] },
      { name: "CLI Tool", tech: ["Node.js", "TypeScript"] },
      { name: "API Client", tech: ["TypeScript"] }
    ]
  };

  return (
    <div className="container-max container-px py-12 md:py-20">
      {/* Header */}
      <section className="mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">Projects</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          A collection of web projects, game development work, and tools I've built over the years.
        </p>
      </section>

      {/* Projects by Category */}
      {Object.entries(projectCategories).map((category, idx) => (
        <section key={idx} className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            {category[0]}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category[1].map((project: any, i: number) => (
              <div key={i} className="card-base p-6 hover:scale-105 transition-transform cursor-pointer group">
                {/* Featured Badge */}
                {project.featured && (
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold">
                      ⭐ Featured
                    </span>
                  </div>
                )}

                {/* Project Image Placeholder */}
                <div className="h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
                  <span className="text-slate-400 text-sm">{project.name}</span>
                </div>

                {/* Project Info */}
                <h3 className="text-lg font-bold mb-2">{project.name}</h3>

                {/* Tech Stack */}
                <div className="flex gap-2 flex-wrap">
                  {project.tech.map((tech: string, t: number) => (
                    <span key={t} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <a
                  href="#"
                  className="mt-4 inline-block text-blue-600 dark:text-blue-400 font-semibold hover:underline group-hover:text-blue-700 transition-colors"
                >
                  View Project →
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Stats */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">By The Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Projects Completed", value: "50+" },
            { label: "Game Dev Games", value: "8" },
            { label: "GitHub Stars", value: "250+" },
            { label: "Open Source", value: "15+" }
          ].map((stat, i) => (
            <div key={i} className="card-base p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <p className="text-slate-600 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Have a Project in Mind?</h2>
        <p className="text-lg mb-8 opacity-90">Let's discuss how I can help bring your vision to life</p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
        >
          Start a Project
        </a>
      </section>
    </div>
  );
}
