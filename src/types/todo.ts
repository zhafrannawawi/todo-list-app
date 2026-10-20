export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  is_completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  is_completed: boolean;
  subtasks: Subtask[];
  estimated_minutes: number;
  is_urgent: boolean;
  is_important: boolean;
  created_at: string;
  completed_at?: string | null;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  estimated_minutes?: number;
  is_urgent?: boolean;
  is_important?: boolean;
  subtasks?: Subtask[];
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: Priority;
  is_completed?: boolean;
  subtasks?: Subtask[];
  estimated_minutes?: number;
  is_urgent?: boolean;
  is_important?: boolean;
  completed_at?: string | null;
}

export type FilterStatus = 'all' | 'active' | 'completed';
export type ViewMode = 'list' | 'matrix' | 'analytics';
