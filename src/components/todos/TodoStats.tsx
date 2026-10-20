'use client';

import React from 'react';
import { Todo } from '@/types/todo';

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.is_completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const totalMinutes = todos
    .filter((t) => !t.is_completed)
    .reduce((acc, t) => acc + (t.estimated_minutes || 25), 0);

  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  const timeDisplay =
    hours > 0 ? `${hours}j ${remainingMins}m tersisa` : `${remainingMins}m tersisa`;

  return (
    <div className="mb-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
          <div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{total}</span>
            <span className="ml-1 text-zinc-400">tugas</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
          <div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{pending}</span>
            <span className="ml-1 text-zinc-400">pending</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
          <div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{completed}</span>
            <span className="ml-1 text-zinc-400">selesai</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
          <span>{percentage}% progres</span>
          {pending > 0 && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
              <span>{timeDisplay}</span>
            </>
          )}
        </div>
      </div>

      {/* Thin subtle progress bar */}
      <div className="mt-3 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
