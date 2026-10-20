'use client';

import React from 'react';
import { Todo } from '@/types/todo';
import { CheckCircle2, Clock, ListTodo, Zap, Share2 } from 'lucide-react';

interface TodoStatsProps {
  todos: Todo[];
  onOpenStandup: () => void;
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos, onOpenStandup }) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.is_completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Gamified XP calculation
  const totalXp = todos.reduce((acc, t) => {
    let xp = 0;
    if (t.is_completed) xp += 100;
    const completedSubs = (t.subtasks || []).filter((s) => s.is_completed).length;
    xp += completedSubs * 25;
    return acc + xp;
  }, 0);

  const level = Math.floor(totalXp / 300) + 1;

  // Total Focus Minutes completed
  const focusMinutesCompleted = todos
    .filter((t) => t.is_completed)
    .reduce((acc, t) => acc + (t.estimated_minutes || 25), 0);

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Top Banner: Velocity & Standup Share */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-transparent border border-blue-500/20 dark:border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
            L{level}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>{totalXp} Productivity XP</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {focusMinutesCompleted} menit deep-work terselesaikan
            </p>
          </div>
        </div>

        <button
          onClick={onOpenStandup}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-blue-500 hover:text-blue-500 shadow-2xs transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Export Standup</span>
        </button>
      </div>

      {/* Grid counters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
            <ListTodo className="w-3.5 h-3.5 text-blue-500" />
            <span>Total Tugas</span>
          </div>
          <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{total}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending</span>
          </div>
          <p className="text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{pending}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Selesai ({percentage}%)</span>
          </div>
          <p className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{completed}</p>
        </div>
      </div>
    </div>
  );
};
