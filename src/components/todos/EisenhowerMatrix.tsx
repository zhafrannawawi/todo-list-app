'use client';

import React from 'react';
import { Todo } from '@/types/todo';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Check, Play } from 'lucide-react';

interface EisenhowerMatrixProps {
  todos: Todo[];
  onToggle: (id: string, current: boolean) => void;
  onUpdateQuadrant: (id: string, is_urgent: boolean, is_important: boolean) => void;
  onSelectFocus: (todo: Todo) => void;
}

export const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({
  todos,
  onToggle,
  onSelectFocus,
}) => {
  const activeTodos = todos.filter((t) => !t.is_completed);

  const q1 = activeTodos.filter((t) => t.is_urgent && t.is_important);
  const q2 = activeTodos.filter((t) => !t.is_urgent && t.is_important);
  const q3 = activeTodos.filter((t) => t.is_urgent && !t.is_important);
  const q4 = activeTodos.filter((t) => !t.is_urgent && !t.is_important);

  const quadrants = [
    {
      title: 'Prioritas Utama (Do)',
      desc: 'Mendesak & Penting',
      indicator: 'bg-rose-500',
      items: q1,
    },
    {
      title: 'Jadwalkan (Schedule)',
      desc: 'Tidak Mendesak, Penting',
      indicator: 'bg-blue-500',
      items: q2,
    },
    {
      title: 'Delegasikan (Delegate)',
      desc: 'Mendesak, Kurang Penting',
      indicator: 'bg-amber-500',
      items: q3,
    },
    {
      title: 'Eliminasi (Don’t Do)',
      desc: 'Tidak Mendesak & Tidak Penting',
      indicator: 'bg-zinc-400',
      items: q4,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      {quadrants.map((q, idx) => (
        <div
          key={idx}
          className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-3.5 min-h-[200px]"
        >
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${q.indicator}`} />
              <div>
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {q.title}
                </h3>
                <p className="text-[10px] text-zinc-400">{q.desc}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500">
              {q.items.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto max-h-56 pr-1">
            {q.items.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[11px] text-zinc-400 italic py-6">
                Tidak ada tugas
              </div>
            ) : (
              q.items.map((todo) => (
                <div
                  key={todo.id}
                  className="group flex items-center justify-between gap-2 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/30 text-xs hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => onToggle(todo.id, todo.is_completed)}
                      className="w-3.5 h-3.5 rounded border border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 flex items-center justify-center flex-shrink-0"
                    >
                      {todo.is_completed && <Check className="w-2.5 h-2.5" />}
                    </button>
                    <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                      {todo.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <PriorityBadge priority={todo.priority} />
                    <button
                      type="button"
                      onClick={() => onSelectFocus(todo)}
                      title="Mulai fokus"
                      className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
