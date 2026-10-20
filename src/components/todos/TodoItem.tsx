'use client';

import React, { useState } from 'react';
import { Subtask, Todo } from '@/types/todo';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import {
  Check,
  Trash2,
  Calendar,
  Sparkles,
  Flame,
  Clock,
  ChevronDown,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (todo: Todo, subtaskId: string) => void;
  onAddSubtask: (todo: Todo, title: string) => void;
  onDeleteSubtask: (todo: Todo, subtaskId: string) => void;
  onDecompose: (todo: Todo) => void;
  onStartFocus: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
  onDecompose,
  onStartFocus,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const formattedDate = new Date(todo.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const subtasks = todo.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.is_completed).length;
  const subtaskProgress =
    subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(todo, newSubtaskTitle);
    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
  };

  return (
    <div
      className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-200 ${
        todo.is_completed
          ? 'bg-zinc-50/50 dark:bg-zinc-950/40 border-zinc-200/60 dark:border-zinc-800/60 opacity-80'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(todo.id, todo.is_completed)}
          className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            todo.is_completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : 'border-zinc-300 dark:border-zinc-600 hover:border-blue-500'
          }`}
          aria-label={todo.is_completed ? 'Tandai belum selesai' : 'Tandai selesai'}
        >
          {todo.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content */}
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

            {todo.is_urgent && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">
                Mendesak
              </span>
            )}
            {todo.is_important && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
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

          {/* Subtask progress bar if has subtasks */}
          {subtasks.length > 0 && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                <span>
                  Subtask: {completedSubtasks}/{subtasks.length}
                </span>
                <span>{subtaskProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action buttons bar */}
          <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
            {/* Focus Pomodoro */}
            {!todo.is_completed && (
              <button
                type="button"
                onClick={() => onStartFocus(todo)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-all"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Fokus ({todo.estimated_minutes || 25}m)</span>
              </button>
            )}

            {/* Smart Decompose / Breakdown */}
            {!todo.is_completed && subtasks.length === 0 && (
              <button
                type="button"
                onClick={() => onDecompose(todo)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
                title="Pecah otomatis menjadi subtask langkah demi langkah"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Breakdown</span>
              </button>
            )}

            {/* Toggle subtasks collapse */}
            {subtasks.length > 0 && (
              <button
                type="button"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                {showSubtasks ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                <span>{showSubtasks ? 'Tutup Subtask' : 'Buka Subtask'}</span>
              </button>
            )}

            <div className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono ml-auto">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
          title="Hapus tugas"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Subtasks nested section */}
      {showSubtasks && (subtasks.length > 0 || isAddingSubtask) && (
        <div className="mt-3 pl-8 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-2">
          {subtasks.map((st) => (
            <div
              key={st.id}
              className="group/st flex items-center justify-between gap-2 text-xs py-1 px-2 rounded-lg hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={st.is_completed}
                  onChange={() => onToggleSubtask(todo, st.id)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span
                  className={`truncate ${
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
                className="opacity-0 group-hover/st:opacity-100 text-zinc-400 hover:text-rose-500 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {isAddingSubtask ? (
            <form onSubmit={handleAddSubtaskSubmit} className="flex gap-2 mt-1">
              <input
                type="text"
                autoFocus
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Nama subtask..."
                className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium"
              >
                Simpan
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
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-blue-500 mt-1 transition-colors self-start"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah langkah</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
