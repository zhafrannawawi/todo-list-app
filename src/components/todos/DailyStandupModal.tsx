'use client';

import React, { useState } from 'react';
import { Todo } from '@/types/todo';
import { Copy, Check, X, FileText } from 'lucide-react';

interface DailyStandupModalProps {
  todos: Todo[];
  isOpen: boolean;
  onClose: () => void;
}

export const DailyStandupModal: React.FC<DailyStandupModalProps> = ({
  todos,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const completed = todos.filter((t) => t.is_completed);
  const active = todos.filter((t) => !t.is_completed);

  const standupText = `Daily Standup Summary (${todayStr})

[Done - ${completed.length}]
${
  completed.length === 0
    ? '- (Tidak ada tugas selesai)'
    : completed.map((t) => `- [${t.priority.toUpperCase()}] ${t.title}`).join('\n')
}

[In Progress / Next - ${active.length}]
${
  active.length === 0
    ? '- (Semua tugas selesai)'
    : active
        .map((t) => `- [${t.priority.toUpperCase()}] ${t.title} (~${t.estimated_minutes || 25}m)`)
        .join('\n')
}

Status: ${completed.length}/${todos.length} selesai (${
    todos.length === 0 ? 0 : Math.round((completed.length / todos.length) * 100)
  }%)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(standupText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1 text-zinc-900 dark:text-zinc-100">
          <FileText className="w-4 h-4 text-zinc-500" />
          <h2 className="text-sm font-semibold tracking-tight">Daily Standup</h2>
        </div>
        <p className="text-xs text-zinc-500 mb-3">
          Teks format markdown siap disalin ke chat kerja atau catatan sprint.
        </p>

        <pre className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap max-h-64 overflow-y-auto mb-4 leading-relaxed">
          {standupText}
        </pre>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Tutup
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Teks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
