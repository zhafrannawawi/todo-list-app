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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari tugas..."
          className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
        />
      </div>

      {/* Tabs & Priority */}
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs">
          {(['all', 'active', 'completed'] as FilterStatus[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(st)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                status === st
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {st === 'all' ? 'Semua' : st === 'active' ? 'Aktif' : 'Selesai'}
            </button>
          ))}
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
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
