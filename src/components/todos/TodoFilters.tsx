'use client';

import React from 'react';
import { FilterStatus, Priority } from '@/types/todo';
import { Search } from 'lucide-react';

interface TodoFiltersProps {
  status: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  priorityFilter: Priority | 'all';
  onPriorityChange: (priority: Priority | 'all') => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  status,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  search,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari tugas..."
          className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <div className="inline-flex rounded-xl p-0.5 bg-zinc-100 dark:bg-zinc-800 text-xs">
          {(['all', 'active', 'completed'] as FilterStatus[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(st)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                status === st
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              {st === 'all' ? 'Semua' : st === 'active' ? 'Aktif' : 'Selesai'}
            </button>
          ))}
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
        >
          <option value="all">Semua Prioritas</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
};
