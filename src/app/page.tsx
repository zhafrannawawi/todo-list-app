'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CreateTodoInput, FilterStatus, Priority, Todo, ViewMode } from '@/types/todo';
import { todoService } from '@/services/todo.service';
import { TodoStats } from '@/components/todos/TodoStats';
import { TodoForm } from '@/components/todos/TodoForm';
import { TodoFilters } from '@/components/todos/TodoFilters';
import { TodoItem } from '@/components/todos/TodoItem';
import { EisenhowerMatrix } from '@/components/todos/EisenhowerMatrix';
import { PomodoroModal } from '@/components/todos/PomodoroModal';
import { DailyStandupModal } from '@/components/todos/DailyStandupModal';
import { CheckSquare, Loader2, RefreshCw } from 'lucide-react';

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

  // Smart Decomposition
  const handleDecompose = async (todo: Todo) => {
    const generatedSubtasks = todoService.decomposeTask(todo.title);
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, subtasks: generatedSubtasks } : t))
    );
    try {
      await todoService.update(todo.id, { subtasks: generatedSubtasks });
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black text-zinc-900 dark:text-zinc-100 py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <CheckSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TaskFlow Pro</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Next.js &bull; Tailwind &bull; Supabase &bull; Industrial Productivity Suite
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchTodos(true)}
            disabled={isRefreshing || isLoading}
            title="Muat ulang data"
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {/* Stats & Gamification */}
        <TodoStats todos={todos} onOpenStandup={() => setIsStandupOpen(true)} />

        {/* Input Form */}
        <TodoForm onSubmit={handleCreate} />

        {/* Filter, Search & View Switcher */}
        <TodoFilters
          status={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          search={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Content View */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs">Sinkronisasi data dengan Supabase...</span>
          </div>
        ) : viewMode === 'matrix' ? (
          <EisenhowerMatrix
            todos={todos}
            onToggle={handleToggle}
            onUpdateQuadrant={handleUpdateQuadrant}
            onSelectFocus={(t) => setFocusTodo(t)}
          />
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-zinc-900/50">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {todos.length === 0
                ? 'Belum ada tugas tersimpan'
                : 'Tidak ada tugas yang sesuai filter'}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              {todos.length === 0
                ? 'Ketik di form di atas untuk membuat tugas baru.'
                : 'Coba ubah kata kunci pencarian atau status filter.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onToggleSubtask={handleToggleSubtask}
                onAddSubtask={handleAddSubtask}
                onDeleteSubtask={handleDeleteSubtask}
                onDecompose={handleDecompose}
                onStartFocus={(t) => setFocusTodo(t)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Focus Mode (Pomodoro) Modal */}
      <PomodoroModal
        todo={focusTodo}
        onClose={() => setFocusTodo(null)}
        onComplete={(id) => handleToggle(id, false)}
      />

      {/* Daily Standup Copy Modal */}
      <DailyStandupModal
        todos={todos}
        isOpen={isStandupOpen}
        onClose={() => setIsStandupOpen(false)}
      />
    </div>
  );
}
