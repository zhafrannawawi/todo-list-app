'use client';

import React from 'react';
import { Todo } from '@/types/todo';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.is_completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5">
        <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
          <ListTodo className="w-3.5 h-3.5 text-blue-500" />
          <span>Total</span>
        </div>
        <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{total}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5">
        <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Pending</span>
        </div>
        <p className="text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{pending}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5">
        <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Selesai ({percentage}%)</span>
        </div>
        <p className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{completed}</p>
      </div>
    </div>
  );
};
