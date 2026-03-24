import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'LgrappaG - Full Stack Developer & Game Dev',
    template: '%s | LgrappaG',
  },
  description:
    'Full stack developer specializing in web development and game development. Check out my portfolio, projects, and blog.',
  keywords: [
    'portfolio',
    'developer',
    'fullstack',
    'game-dev',
    'react',
    'nextjs',
    'typescript',
    'node.js',
  ],
  authors: [
    {
      name: 'LgrappaG',
      url: 'https://github.com/LgrappaG',
    },
  ],
  creator: 'LgrappaG',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'LgrappaG Portfolio',
    title: 'LgrappaG - Full Stack Developer & Game Dev',
    description: 'Full stack developer portfolio showcasing web and game development projects',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'LgrappaG Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LgrappaG - Full Stack Developer',
    description: 'Check out my portfolio of web and game development projects',
    creator: '@LgrappaG',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: 'no',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased">
        <div className="flex flex-col min-h-screen">
          {/* Header will go here */}
          <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 backdrop-blur-sm">
            <nav className="container-max container-px py-4">
              <div className=" text-center">
                <h1 className="text-2xl font-bold text-gradient">LgrappaG</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Full Stack Developer & Game Dev
                </p>
              </div>
            </nav>
          </header>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer will go here */}
          <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 mt-16">
            <div className="container-max container-px py-12">
              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                <p>
                  Built with Next.js 14 & React | Hosted on{' '}
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Vercel
                  </a>
                </p>
                <p className="mt-2">
                  © {new Date().getFullYear()} LgrappaG. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
