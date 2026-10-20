import React from 'react';
import { Priority } from '@/types/todo';

interface BadgeProps {
  priority: Priority;
  className?: string;
}

const colorMap: Record<Priority, { bg: string; text: string; border: string; label: string }> = {
  low: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-500/20 dark:border-emerald-500/30',
    label: 'Low',
  },
  medium: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/20 dark:border-amber-500/30',
    label: 'Medium',
  },
  high: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-500/20 dark:border-rose-500/30',
    label: 'High',
  },
};

export const PriorityBadge: React.FC<BadgeProps> = ({ priority, className = '' }) => {
  const conf = colorMap[priority] || colorMap.medium;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${conf.bg} ${conf.text} ${conf.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70" />
      {conf.label}
    </span>
  );
};
