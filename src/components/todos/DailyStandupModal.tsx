'use client';

import React, { useState } from 'react';
import { Todo } from '@/types/todo';
import { Copy, Check, X, Share2 } from 'lucide-react';

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

  const standupText = `🚀 *Daily Standup Report — ${todayStr}*

✅ *Selesai Dilakukan (${completed.length})*:
${
  completed.length === 0
    ? '- (Belum ada tugas selesai)'
    : completed.map((t) => `• [${t.priority.toUpperCase()}] ${t.title}`).join('\n')
}

⏳ *Fokus / Rencana Selanjutnya (${active.length})*:
${
  active.length === 0
    ? '- (Semua tugas beres! 🎉)'
    : active
        .map((t) => `• [${t.priority.toUpperCase()}] ${t.title} (~${t.estimated_minutes || 25}m)`)
        .join('\n')
}

📊 *Productivity Velocity*: ${
    todos.length === 0 ? '0%' : Math.round((completed.length / todos.length) * 100) + '%'
  } completed
Generated via FokusTask Industrial Suite.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(standupText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-blue-400">
          <Share2 className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-tight text-white">
            Daily Standup & Sync
          </h2>
        </div>
        <p className="text-xs text-zinc-400 mb-4">
          Format otomatis siap kirim ke Slack, Telegram, atau Discord tim kamu.
        </p>

        <pre className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap max-h-72 overflow-y-auto mb-4 leading-relaxed">
          {standupText}
        </pre>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Tutup
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-500/20"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Standup</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
