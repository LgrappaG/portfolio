'use client';

import { useState } from 'react';
import { Header } from '@/components';
import { SplashScreen } from '@/components/SplashScreen';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div className="flex flex-col min-h-screen relative">
        {/* Background decorative element */}
        <div className="fixed inset-0 z-0 pointer-events-none" />

        {/* Main content wrapper */}
        <div className="relative z-10">
          {/* Header */}
          <Header />

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
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
      </div>
    </>
  );
}
