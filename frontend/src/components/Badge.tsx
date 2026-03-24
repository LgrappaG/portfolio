import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'slate';
  children: React.ReactNode;
}

export default function Badge({ variant = 'blue', children, className = '', ...props }: BadgeProps) {
  const variants = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
