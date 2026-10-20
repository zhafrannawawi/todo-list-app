'use client';

import React, { useState } from 'react';
import { Subtask, Todo } from '@/types/todo';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import {
  Check,
  Trash2,
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  Plus,
  Play,
} from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (todo: Todo, subtaskId: string) => void;
  onAddSubtask: (todo: Todo, title: string) => void;
  onDeleteSubtask: (todo: Todo, subtaskId: string) => void;
  onStartFocus: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
  onStartFocus,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const formattedDate = new Date(todo.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });

  const subtasks = todo.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.is_completed).length;

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(todo, newSubtaskTitle);
    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
  };

  return (
    <div
      className={`group relative flex flex-col p-3 rounded-xl border transition-all duration-150 ${
        todo.is_completed
          ? 'bg-zinc-50/60 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 opacity-65'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(todo.id, todo.is_completed)}
          className={`mt-0.5 flex-shrink-0 w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors ${
            todo.is_completed
              ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900'
              : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-500'
          }`}
          aria-label={todo.is_completed ? 'Tandai belum selesai' : 'Tandai selesai'}
        >
          {todo.is_completed && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-medium tracking-tight break-words ${
                todo.is_completed
                  ? 'line-through text-zinc-400 dark:text-zinc-500'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {todo.title}
            </span>

            <PriorityBadge priority={todo.priority} />

            {todo.is_urgent && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
                Mendesak
              </span>
            )}

            {todo.is_important && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                Penting
              </span>
            )}
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

          {/* Action bar on task */}
          <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
            {/* Subtasks expand toggle */}
            <button
              type="button"
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              {showSubtasks ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <span>
                {subtasks.length > 0
                  ? `${completedSubtasks}/${subtasks.length} subtask`
                  : '+ Subtask'}
              </span>
            </button>

            {/* Focus button */}
            {!todo.is_completed && (
              <button
                type="button"
                onClick={() => onStartFocus(todo)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Mulai sesi fokus"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>{todo.estimated_minutes || 25}m fokus</span>
              </button>
            )}

            <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono ml-auto">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          title="Hapus"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subtasks drawer */}
      {showSubtasks && (
        <div className="mt-2.5 pl-7 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-1.5">
          {subtasks.map((st) => (
            <div
              key={st.id}
              className="group/st flex items-center justify-between gap-2 text-xs py-1 px-1.5 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
            >
              <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={st.is_completed}
                  onChange={() => onToggleSubtask(todo, st.id)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0 w-3 h-3 cursor-pointer"
                />
                <span
                  className={`truncate text-xs ${
                    st.is_completed
                      ? 'line-through text-zinc-400 dark:text-zinc-600'
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {st.title}
                </span>
              </label>

              <button
                type="button"
                onClick={() => onDeleteSubtask(todo, st.id)}
                className="opacity-0 group-hover/st:opacity-100 text-zinc-400 hover:text-rose-500"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {isAddingSubtask ? (
            <form onSubmit={handleAddSubtaskSubmit} className="flex gap-1.5 mt-1">
              <input
                type="text"
                autoFocus
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Nama langkah..."
                className="flex-1 px-2 py-1 text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded text-xs font-medium"
              >
                Tambah
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSubtask(false)}
                className="px-2 py-1 text-zinc-400 hover:text-zinc-600 text-xs"
              >
                Batal
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingSubtask(true)}
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 mt-1 transition-colors self-start"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah subtask</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
