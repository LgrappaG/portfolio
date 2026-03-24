import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export default function Card({ children, hoverable = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`card-base p-6 ${hoverable ? 'hover:scale-105 cursor-pointer' : ''} transition-transform ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
