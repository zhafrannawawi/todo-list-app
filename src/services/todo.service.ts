import { supabase } from '@/lib/supabase/client';
import { CreateTodoInput, Subtask, Todo, UpdateTodoInput } from '@/types/todo';

export const todoService = {
  async getAll(): Promise<Todo[]> {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error.message);
      throw error;
    }

    return (data || []).map((row: any) => ({
      ...row,
      subtasks: Array.isArray(row.subtasks) ? row.subtasks : [],
      estimated_minutes: row.estimated_minutes || 25,
      is_urgent: !!row.is_urgent,
      is_important: row.is_important !== undefined ? !!row.is_important : true,
    })) as Todo[];
  },

  async create(input: CreateTodoInput): Promise<Todo> {
    const payload = {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      priority: input.priority || 'medium',
      is_completed: false,
      subtasks: input.subtasks || [],
      estimated_minutes: input.estimated_minutes || 25,
      is_urgent: input.is_urgent ?? false,
      is_important: input.is_important ?? true,
    };

    const { data, error } = await supabase
      .from('todos')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error creating todo:', error.message);
      throw error;
    }

    return {
      ...data,
      subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
      estimated_minutes: data.estimated_minutes || 25,
      is_urgent: !!data.is_urgent,
      is_important: data.is_important !== undefined ? !!data.is_important : true,
    } as Todo;
  },

  async update(id: string, input: UpdateTodoInput): Promise<Todo> {
    const { data, error } = await supabase
      .from('todos')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating todo:', error.message);
      throw error;
    }

    return {
      ...data,
      subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
      estimated_minutes: data.estimated_minutes || 25,
      is_urgent: !!data.is_urgent,
      is_important: data.is_important !== undefined ? !!data.is_important : true,
    } as Todo;
  },

  async toggleComplete(id: string, isCompleted: boolean): Promise<Todo> {
    return this.update(id, {
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    });
  },

  async toggleSubtask(todo: Todo, subtaskId: string): Promise<Todo> {
    const updatedSubtasks = todo.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, is_completed: !st.is_completed } : st
    );
    const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.is_completed);

    return this.update(todo.id, {
      subtasks: updatedSubtasks,
      ...(allCompleted && !todo.is_completed ? { is_completed: true, completed_at: new Date().toISOString() } : {}),
    });
  },

  async addSubtask(todo: Todo, title: string): Promise<Todo> {
    const newSubtask: Subtask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      is_completed: false,
    };
    const updatedSubtasks = [...todo.subtasks, newSubtask];
    return this.update(todo.id, { subtasks: updatedSubtasks });
  },

  async deleteSubtask(todo: Todo, subtaskId: string): Promise<Todo> {
    const updatedSubtasks = todo.subtasks.filter((st) => st.id !== subtaskId);
    return this.update(todo.id, { subtasks: updatedSubtasks });
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error.message);
      throw error;
    }
  },

  // Smart Decomposer: Analyzes task title and generates industrial sub-actions
  decomposeTask(title: string): Subtask[] {
    const lower = title.toLowerCase();
    const subtaskTitles: string[] = [];

    if (lower.includes('buat') || lower.includes('bikin') || lower.includes('create') || lower.includes('build')) {
      subtaskTitles.push('Riset referensi & buat spesifikasi kebutuhan');
      subtaskTitles.push('Desain arsitektur dasar / mockup awal');
      subtaskTitles.push('Implementasi fungsionalitas inti');
      subtaskTitles.push('Testing & verifikasi akhir');
    } else if (lower.includes('belajar') || lower.includes('study') || lower.includes('learn')) {
      subtaskTitles.push('Baca dokumentasi resmi bab 1-3');
      subtaskTitles.push('Coba kode contoh di sandbox');
      subtaskTitles.push('Buat rangkuman catatan penting');
      subtaskTitles.push('Praktek studi kasus nyata');
    } else if (lower.includes('laporan') || lower.includes('report') || lower.includes('analisis')) {
      subtaskTitles.push('Kumpulkan data mentah & verifikasi validitas');
      subtaskTitles.push('Susun draft temuan & ringkasan eksekutif');
      subtaskTitles.push('Review angka dan formatting');
      subtaskTitles.push('Kirim ke stakeholder / atasan');
    } else if (lower.includes('fix') || lower.includes('bug') || lower.includes('error')) {
      subtaskTitles.push('Reproduksi error di local environment');
      subtaskTitles.push('Isolasi akar masalah via debugging');
      subtaskTitles.push('Tulis patch perbaikan & test regressi');
      subtaskTitles.push('Push commit dan validasi deploy');
    } else {
      subtaskTitles.push(`Definisikan target selesai untuk: ${title}`);
      subtaskTitles.push('Kerjakan sprint fokus pertama (25 menit)');
      subtaskTitles.push('Review hasil pekerjaan & tandai selesai');
    }

    return subtaskTitles.map((t) => ({
      id: crypto.randomUUID(),
      title: t,
      is_completed: false,
    }));
  },
};
