
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

export interface SortConfig {
  field: 'priority' | 'dueDate' | null;
  direction: 'asc' | 'desc';
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

export interface FilterState {
  text?: string;
  priority?: Priority;
  done?: boolean;
}




export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface TodoResponse {
  content: Todo[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: CreateTodoRequest | UpdateTodoRequest) => Promise<void>;
  title: string; // <-- agrega esto
  initialData?: Todo;
}

export interface Metrics {
  overall: {
    averageCompletionTime: number; // in milliseconds
    totalCompletedTasks: number;
  };
  byPriority: {
    [key in Priority]: {
      averageCompletionTime: number;
      totalCompletedTasks: number;
    };
  };
}