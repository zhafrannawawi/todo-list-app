'use client';

import React, { useState } from 'react';
import { CreateTodoInput, Priority } from '@/types/todo';
import { Plus, Loader2, Clock, AlertCircle } from 'lucide-react';

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
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 shadow-2xs mb-6 transition-all"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Tulis tugas baru..."
          required
          className="flex-1 bg-transparent px-2.5 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Simpan</span>
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-2.5">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tambahkan catatan atau deskripsi (opsional)..."
            rows={2}
            className="w-full bg-zinc-50 dark:bg-zinc-800/40 rounded-lg p-2 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 resize-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Priority */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500">Prioritas:</span>
                <div className="inline-flex rounded-md p-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-[11px]">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
                        priority === p
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimate */}
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-zinc-400" />
                <div className="inline-flex rounded-md p-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-[11px]">
                  {[15, 25, 45, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setEstimatedMinutes(m)}
                      className={`px-1.5 py-0.5 rounded font-mono transition-all ${
                        estimatedMinutes === m
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgent/Important check */}
              <label className="flex items-center gap-1 cursor-pointer text-[11px] text-zinc-600 dark:text-zinc-400 select-none">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0 w-3 h-3 cursor-pointer"
                />
                <span>Mendesak</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer text-[11px] text-zinc-600 dark:text-zinc-400 select-none">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0 w-3 h-3 cursor-pointer"
                />
                <span>Penting</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
