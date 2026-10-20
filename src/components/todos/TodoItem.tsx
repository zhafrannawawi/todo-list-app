'use client';

import React from 'react';
import { Todo } from '@/types/todo';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Check, Trash2, Calendar } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const formattedDate = new Date(todo.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`group relative flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
        todo.is_completed
          ? 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 opacity-75'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm'
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(todo.id, todo.is_completed)}
        className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
          todo.is_completed
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'border-zinc-300 dark:border-zinc-600 hover:border-blue-500 dark:hover:border-blue-400'
        }`}
        aria-label={todo.is_completed ? 'Tandai belum selesai' : 'Tandai selesai'}
      >
        {todo.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3
            className={`text-sm font-semibold tracking-tight break-words ${
              todo.is_completed
                ? 'line-through text-zinc-400 dark:text-zinc-500'
                : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {todo.title}
          </h3>
          <PriorityBadge priority={todo.priority} />
        </div>

        {todo.description && (
          <p
            className={`text-xs mt-1 leading-relaxed break-words ${
              todo.is_completed
                ? 'line-through text-zinc-400 dark:text-zinc-600'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {todo.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
        title="Hapus tugas"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
