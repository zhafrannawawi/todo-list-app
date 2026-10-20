import React from 'react';
import { Priority } from '@/types/todo';

interface BadgeProps {
  priority: Priority;
  className?: string;
}

const config: Record<Priority, { dot: string; text: string; label: string }> = {
  low: {
    dot: 'bg-zinc-400 dark:bg-zinc-500',
    text: 'text-zinc-600 dark:text-zinc-400',
    label: 'Low',
  },
  medium: {
    dot: 'bg-blue-500 dark:bg-blue-400',
    text: 'text-blue-700 dark:text-blue-300',
    label: 'Medium',
  },
  high: {
    dot: 'bg-rose-500 dark:bg-rose-400',
    text: 'text-rose-700 dark:text-rose-300',
    label: 'High',
  },
};

export const PriorityBadge: React.FC<BadgeProps> = ({ priority, className = '' }) => {
  const conf = config[priority] || config.medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 ${conf.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
      <span>{conf.label}</span>
    </span>
  );
};
