
export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface Todo {
  id: string;
  text: string;
  dueDate?: string; // ISO date string
  done: boolean;
  doneDate?: string; // ISO date string
  priority: Priority;
  creationDate: string; // ISO date string
}

export interface CreateTodoRequest {
  text: string;
  priority: Priority;
  dueDate?: string;
}

export interface UpdateTodoRequest {
  text?: string;
  priority?: Priority;
  dueDate?: string;
}

export interface TodoFilters {
  text?: string;
  priority?: Priority;
  done?: boolean;
}

export interface TodoSorting {
  sortBy?: 'priority' | 'dueDate';
  sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export interface Metrics {
  averageCompletionTime: number;
  priorityMetrics: PriorityMetric[];
}

export interface PriorityMetric {
  priority: Priority;
  averageCompletionTime: number;
  count: number;
}