'use client';

import React from 'react';
import { ViewMode } from '@/types/todo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CheckSquare, ListTodo, LayoutGrid, FileText, RefreshCw } from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  completedCount: number;
  totalCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenStandup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  completedCount,
  totalCount,
  isRefreshing,
  onRefresh,
  onOpenStandup,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shadow-xs">
            <CheckSquare className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
              FokusTask
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500">
              Workspace
            </span>
          </div>
        </div>

        {/* Center: View Switcher */}
        <nav className="flex items-center p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/60 text-xs font-medium">
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Tugas</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('matrix')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              viewMode === 'matrix'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Matriks</span>
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Progress Pill */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              {completedCount}/{totalCount} selesai
            </span>
          </div>

          {/* Standup Export */}
          <button
            type="button"
            onClick={onOpenStandup}
            title="Export Daily Standup"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Standup</span>
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Muat ulang sinkronisasi"
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* GitHub Repo */}
          <a
            href="https://github.com/zhafrannawawi/todo-list-app"
            target="_blank"
            rel="noopener noreferrer"
            title="Source Code GitHub"
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
