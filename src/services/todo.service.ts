import { supabase } from '@/lib/supabase/client';
import { CreateTodoInput, Todo, UpdateTodoInput } from '@/types/todo';

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

    return (data as Todo[]) || [];
  },

  async create(input: CreateTodoInput): Promise<Todo> {
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          title: input.title.trim(),
          description: input.description?.trim() || null,
          priority: input.priority || 'medium',
          is_completed: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating todo:', error.message);
      throw error;
    }

    return data as Todo;
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

    return data as Todo;
  },

  async toggleComplete(id: string, isCompleted: boolean): Promise<Todo> {
    return this.update(id, { is_completed: isCompleted });
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
};
