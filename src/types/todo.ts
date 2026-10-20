export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  is_completed: boolean;
  created_at: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: Priority;
  is_completed?: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';
