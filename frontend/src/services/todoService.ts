import axios from 'axios';
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoFilters,
  TodoSorting,
  PaginatedResponse,
  Metrics
} from '../types';

const API_BASE_URL = 'http://localhost:9090';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GetTodosParams extends TodoFilters, TodoSorting {
  page?: number;
  size?: number;
}

export const todoService = {
  // Get paginated todos with filters and sorting
  getTodos: async (params: GetTodosParams = {}): Promise<PaginatedResponse<Todo>> => {
    const {
      text,
      priority,
      done,
      sortBy,
      sortDirection,
      page = 0,
      size = 10
    } = params;

    const searchParams = new URLSearchParams();
    
    if (text) searchParams.append('text', text);
    if (priority) searchParams.append('priority', priority);
    if (done !== undefined) searchParams.append('done', done.toString());
    if (sortBy) searchParams.append('sortBy', sortBy);
    if (sortDirection) searchParams.append('sortDirection', sortDirection);
    searchParams.append('page', page.toString());
    searchParams.append('size', size.toString());

    const response = await api.get(`/todos?${searchParams.toString()}`);
    return response.data;
  },

  // Create new todo
  createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post('/todos', todo);
    return response.data;
  },

  // Update existing todo
  updateTodo: async (id: string, updates: UpdateTodoRequest): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  // Mark todo as done
  markTodoAsDone: async (id: string): Promise<Todo> => {
    const response = await api.post(`/todos/${id}/done`);
    return response.data;
  },

  // Mark todo as undone
  markTodoAsUndone: async (id: string): Promise<Todo> => {
    const response = await api.put(`/todos/${id}/undone`);
    return response.data;
  },

  // Get metrics
  getMetrics: async (): Promise<Metrics> => {
    const response = await api.get('/todos/metrics');
    return response.data;
  }
};

export default todoService;