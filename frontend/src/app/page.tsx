export default function Home() {
  return (
    <div className="container-max container-px py-12 md:py-20">
      {/* Hero Section */}
      <section className="text-center mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient animate-fadeIn">
          Welcome to My Portfolio
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Full stack developer specializing in web development and game development.
          Explore my projects and learn about my journey.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/projects"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Projects
          </a>
          <a
            href="/about"
            className="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
          >
            About Me
          </a>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-24">
        <div className="card-base p-6 text-center">
          <div className="text-4xl font-bold text-gradient mb-2">15+</div>
          <p className="text-slate-600 dark:text-slate-400">Active Projects</p>
        </div>
        <div className="card-base p-6 text-center">
          <div className="text-4xl font-bold text-gradient mb-2">50+</div>
          <p className="text-slate-600 dark:text-slate-400">GitHub Stars</p>
        </div>
        <div className="card-base p-6 text-center">
          <div className="text-4xl font-bold text-gradient mb-2">5+</div>
          <p className="text-slate-600 dark:text-slate-400">Years Experience</p>
        </div>
      </section>

      {/* Featured Section */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">🚀 Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "E-Commerce Platform",
              desc: "Full-stack e-commerce solution with payment integration",
              tech: ["React", "Node.js", "PostgreSQL"]
            },
            {
              name: "CMS Dashboard",
              desc: "Modern content management system with real-time updates",
              tech: ["Next.js", "TypeScript", "Tailwind"]
            },
            {
              name: "2D Platformer Game",
              desc: "Indie platformer game with multiple levels and mechanics",
              tech: ["Unity", "C#"]
            }
          ].map((project, i) => (
            <div
              key={i}
              className="card-base p-6 hover:scale-105 transition-transform cursor-pointer group"
            >
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <span className="text-white font-semibold text-center px-4">{project.name}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{project.desc}</p>
              <div className="flex gap-2 flex-wrap">
                {project.tech.map((tech, t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href="/projects"
                className="mt-4 inline-block text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to collaborate?</h2>
        <p className="text-lg mb-8 opacity-90">
          Let's build something amazing together
        </p>
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
