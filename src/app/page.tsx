'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CreateTodoInput, FilterStatus, Priority, Todo, ViewMode } from '@/types/todo';
import { todoService } from '@/services/todo.service';
import { Header } from '@/components/layout/Header';
import { TodoStats } from '@/components/todos/TodoStats';
import { TodoForm } from '@/components/todos/TodoForm';
import { TodoFilters } from '@/components/todos/TodoFilters';
import { TodoItem } from '@/components/todos/TodoItem';
import { EisenhowerMatrix } from '@/components/todos/EisenhowerMatrix';
import { PomodoroModal } from '@/components/todos/PomodoroModal';
import { DailyStandupModal } from '@/components/todos/DailyStandupModal';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals state
  const [focusTodo, setFocusTodo] = useState<Todo | null>(null);
  const [isStandupOpen, setIsStandupOpen] = useState(false);

  const fetchTodos = async (isSilent = false) => {
    try {
      if (!isSilent) setIsLoading(true);
      else setIsRefreshing(true);
      setErrorMsg(null);
      const data = await todoService.getAll();
      setTodos(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat tugas dari Supabase';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreate = async (input: CreateTodoInput) => {
    const newTodo = await todoService.create(input);
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_completed: !currentStatus } : t))
    );
    try {
      await todoService.toggleComplete(id, !currentStatus);
    } catch (err) {
      console.error(err);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_completed: currentStatus } : t))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const prevList = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await todoService.delete(id);
    } catch (err) {
      console.error(err);
      setTodos(prevList);
    }
  };

  // Subtask handlers
  const handleToggleSubtask = async (todo: Todo, subtaskId: string) => {
    try {
      const updated = await todoService.toggleSubtask(todo, subtaskId);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubtask = async (todo: Todo, title: string) => {
    try {
      const updated = await todoService.addSubtask(todo, title);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubtask = async (todo: Todo, subtaskId: string) => {
    try {
      const updated = await todoService.deleteSubtask(todo, subtaskId);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // Quadrant update
  const handleUpdateQuadrant = async (
    id: string,
    is_urgent: boolean,
    is_important: boolean
  ) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_urgent, is_important } : t))
    );
    try {
      await todoService.update(id, { is_urgent, is_important });
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = useMemo(() => todos.filter((t) => t.is_completed).length, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (statusFilter === 'active' && todo.is_completed) return false;
      if (statusFilter === 'completed' && !todo.is_completed) return false;

      if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = todo.title.toLowerCase().includes(query);
        const matchesDesc = todo.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [todos, statusFilter, priorityFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors">
      {/* Top Navbar Header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        completedCount={completedCount}
        totalCount={todos.length}
        isRefreshing={isRefreshing}
        onRefresh={() => fetchTodos(true)}
        onOpenStandup={() => setIsStandupOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Stats progress summary */}
        <TodoStats todos={todos} />

        {/* Quick add form */}
        <TodoForm onSubmit={handleCreate} />

        {/* Search & Filter */}
        <TodoFilters
          status={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          search={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {errorMsg && (
          <div className="p-3 mb-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Content View */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-900 dark:text-zinc-100" />
            <span className="text-xs">Sinkronisasi tugas...</span>
          </div>
        ) : viewMode === 'matrix' ? (
          <EisenhowerMatrix
            todos={todos}
            onToggle={handleToggle}
            onUpdateQuadrant={handleUpdateQuadrant}
            onSelectFocus={(t) => setFocusTodo(t)}
          />
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white/40 dark:bg-zinc-900/30">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {todos.length === 0
                ? 'Belum ada tugas'
                : 'Tidak ada tugas yang sesuai filter'}
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
              {todos.length === 0
                ? 'Gunakan kolom input di atas untuk membuat tugas baru.'
                : 'Sesuaikan pencarian atau filter status.'}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 divide-y divide-zinc-100 dark:divide-zinc-800/60 overflow-hidden shadow-2xs">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onToggleSubtask={handleToggleSubtask}
                onAddSubtask={handleAddSubtask}
                onDeleteSubtask={handleDeleteSubtask}
                onStartFocus={(t) => setFocusTodo(t)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Focus Timer Modal */}
      <PomodoroModal
        todo={focusTodo}
        onClose={() => setFocusTodo(null)}
        onComplete={(id) => handleToggle(id, false)}
      />

      {/* Daily Standup Modal */}
      <DailyStandupModal
        todos={todos}
        isOpen={isStandupOpen}
        onClose={() => setIsStandupOpen(false)}
      />
    </div>
  );
}
