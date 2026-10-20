'use client';

import React, { useState } from 'react';
import { CreateTodoInput, Priority } from '@/types/todo';
import { Plus, Loader2, Clock, Sparkles } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (input: CreateTodoInput) => Promise<void>;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(25);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title,
        description: description.trim() || undefined,
        priority,
        estimated_minutes: estimatedMinutes,
        is_urgent: isUrgent,
        is_important: isImportant,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setEstimatedMinutes(25);
      setIsUrgent(false);
      setIsImportant(true);
      setIsExpanded(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm mb-6 transition-all"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Tulis tugas baru (misal: 'Buat laporan keuangan', 'Belajar Docker')..."
          required
          className="flex-1 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah</span>
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi detail atau catatan tambahan..."
            rows={2}
            className="w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Priority */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-medium">Prioritas:</span>
              <div className="inline-flex rounded-lg p-0.5 bg-zinc-100 dark:bg-zinc-800">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                      priority === p
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimasi Durasi Focus */}
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-500 font-medium">Estimasi:</span>
              <div className="inline-flex rounded-lg p-0.5 bg-zinc-100 dark:bg-zinc-800">
                {[15, 25, 45, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setEstimatedMinutes(m)}
                    className={`px-2 py-0.5 rounded-md font-mono transition-all ${
                      estimatedMinutes === m
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Eisenhower Tags */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-zinc-600 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded border-zinc-300 text-rose-600 focus:ring-0 cursor-pointer"
                />
                <span>Mendesak (Urgent)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-zinc-600 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Penting (Important)</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
