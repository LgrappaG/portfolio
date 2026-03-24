/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export for GitHub Pages
  output: 'export',
  // basePath for GitHub Pages - IMPORTANT: this is required for repository-based hosting
  basePath: '/portfolio',
  trailingSlash: true,

  // Image optimization (disabled for static export)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://lgrapag.github.io/portfolio',
  },
}

module.exports = nextConfig
