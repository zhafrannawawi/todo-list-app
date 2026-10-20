'use client';

import React from 'react';
import { Todo } from '@/types/todo';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Check, Flame, CalendarClock, Users, Trash2 } from 'lucide-react';

interface EisenhowerMatrixProps {
  todos: Todo[];
  onToggle: (id: string, current: boolean) => void;
  onUpdateQuadrant: (id: string, is_urgent: boolean, is_important: boolean) => void;
  onSelectFocus: (todo: Todo) => void;
}

export const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({
  todos,
  onToggle,
  onUpdateQuadrant,
  onSelectFocus,
}) => {
  const activeTodos = todos.filter((t) => !t.is_completed);

  const q1 = activeTodos.filter((t) => t.is_urgent && t.is_important);
  const q2 = activeTodos.filter((t) => !t.is_urgent && t.is_important);
  const q3 = activeTodos.filter((t) => t.is_urgent && !t.is_important);
  const q4 = activeTodos.filter((t) => !t.is_urgent && !t.is_important);

  const quadrants = [
    {
      title: '1. Kerjakan Sekarang (Do First)',
      desc: 'Mendesak & Penting',
      icon: Flame,
      color: 'border-rose-500/30 bg-rose-500/5 text-rose-500',
      items: q1,
      targetUrgent: true,
      targetImportant: true,
    },
    {
      title: '2. Jadwalkan (Schedule)',
      desc: 'Tidak Mendesak, Sangat Penting',
      icon: CalendarClock,
      color: 'border-blue-500/30 bg-blue-500/5 text-blue-500',
      items: q2,
      targetUrgent: false,
      targetImportant: true,
    },
    {
      title: '3. Delegasikan (Delegate)',
      desc: 'Mendesak, Kurang Penting',
      icon: Users,
      color: 'border-amber-500/30 bg-amber-500/5 text-amber-500',
      items: q3,
      targetUrgent: true,
      targetImportant: false,
    },
    {
      title: '4. Eliminasi (Don’t Do)',
      desc: 'Tidak Mendesak & Tidak Penting',
      icon: Trash2,
      color: 'border-zinc-500/30 bg-zinc-500/5 text-zinc-500',
      items: q4,
      targetUrgent: false,
      targetImportant: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {quadrants.map((q, idx) => {
        const Icon = q.icon;
        return (
          <div
            key={idx}
            className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 min-h-[220px]"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${q.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{q.title}</h3>
                  <p className="text-[10px] text-zinc-400">{q.desc}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {q.items.length}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-60 pr-1">
              {q.items.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[11px] text-zinc-400 italic py-6">
                  Kosong
                </div>
              ) : (
                q.items.map((todo) => (
                  <div
                    key={todo.id}
                    className="group flex items-center justify-between gap-2 p-2.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => onToggle(todo.id, todo.is_completed)}
                        className="w-4 h-4 rounded border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 flex items-center justify-center flex-shrink-0"
                      >
                        {todo.is_completed && <Check className="w-3 h-3 text-blue-500" />}
                      </button>
                      <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                        {todo.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <PriorityBadge priority={todo.priority} />
                      <button
                        onClick={() => onSelectFocus(todo)}
                        title="Fokus"
                        className="px-2 py-0.5 rounded text-[10px] bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                      >
                        Fokus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
