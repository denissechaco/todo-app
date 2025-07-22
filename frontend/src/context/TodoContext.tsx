import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoFilters,
  TodoSorting,
  PaginatedResponse,
  Metrics
} from '../types';
import todoService, { GetTodosParams } from '../services/todoService';

// State interface
interface TodoState {
  todos: PaginatedResponse<Todo> | null;
  metrics: Metrics | null;
  loading: boolean;
  error: string | null;
  filters: TodoFilters;
  sorting: TodoSorting;
  currentPage: number;
}

// Action types
type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TODOS'; payload: PaginatedResponse<Todo> }
  | { type: 'SET_METRICS'; payload: Metrics }
  | { type: 'SET_FILTERS'; payload: TodoFilters }
  | { type: 'SET_SORTING'; payload: TodoSorting }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string };

// Context interface
interface TodoContextType {
  state: TodoState;
  actions: {
    loadTodos: () => Promise<void>;
    loadMetrics: () => Promise<void>;
    createTodo: (todo: CreateTodoRequest) => Promise<void>;
    updateTodo: (id: string, updates: UpdateTodoRequest) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    toggleTodoDone: (id: string, currentDone: boolean) => Promise<void>;
    setFilters: (filters: TodoFilters) => void;
    setSorting: (sorting: TodoSorting) => void;
    setCurrentPage: (page: number) => void;
    clearError: () => void;
  };
}

// Initial state
const initialState: TodoState = {
  todos: null,
  metrics: null,
  loading: false,
  error: null,
  filters: {},
  sorting: {},
  currentPage: 0,
};

// Reducer
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TODOS':
      return { ...state, todos: action.payload, loading: false, error: null };
    case 'SET_METRICS':
      return { ...state, metrics: action.payload, loading: false, error: null };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload, currentPage: 0 };
    case 'SET_SORTING':
      return { ...state, sorting: action.payload, currentPage: 0 };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'UPDATE_TODO':
      if (!state.todos) return state;
      return {
        ...state,
        todos: {
          ...state.todos,
          content: state.todos.content.map(todo =>
            todo.id === action.payload.id ? action.payload : todo
          ),
        },
      };
    case 'DELETE_TODO':
      if (!state.todos) return state;
      return {
        ...state,
        todos: {
          ...state.todos,
          content: state.todos.content.filter(todo => todo.id !== action.payload),
          totalElements: state.todos.totalElements - 1,
        },
      };
    default:
      return state;
  }
};

// Create context
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Provider component
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load todos with current filters, sorting, and pagination
  const loadTodos = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params: GetTodosParams = {
        ...state.filters,
        ...state.sorting,
        page: state.currentPage,
        size: 10,
      };
      const todos = await todoService.getTodos(params);
      dispatch({ type: 'SET_TODOS', payload: todos });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load todos' });
    }
  }, [state.filters, state.sorting, state.currentPage]);

  // Load metrics
  const loadMetrics = useCallback(async () => {
    try {
      const metrics = await todoService.getMetrics();
      dispatch({ type: 'SET_METRICS', payload: metrics });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load metrics' });
    }
  }, []);

  // Create todo
  const createTodo = useCallback(async (todo: CreateTodoRequest) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await todoService.createTodo(todo);
      await loadTodos(); // Reload todos
      await loadMetrics(); // Reload metrics
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create todo' });
    }
  }, [loadTodos, loadMetrics]);

  // Update todo
  const updateTodo = useCallback(async (id: string, updates: UpdateTodoRequest) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, updates);
      dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
      await loadMetrics(); // Reload metrics
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update todo' });
    }
  }, [loadMetrics]);

  // Delete todo
  const deleteTodo = useCallback(async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      dispatch({ type: 'DELETE_TODO', payload: id });
      await loadMetrics(); // Reload metrics
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete todo' });
    }
  }, [loadMetrics]);

  // Toggle todo done status
  const toggleTodoDone = useCallback(async (id: string, currentDone: boolean) => {
    try {
      const updatedTodo = currentDone
        ? await todoService.markTodoAsUndone(id)
        : await todoService.markTodoAsDone(id);
      dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
      await loadMetrics(); // Reload metrics
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to toggle todo status' });
    }
  }, [loadMetrics]);

  // Set filters
  const setFilters = useCallback((filters: TodoFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  // Set sorting
  const setSorting = useCallback((sorting: TodoSorting) => {
    dispatch({ type: 'SET_SORTING', payload: sorting });
  }, []);

  // Set current page
  const setCurrentPage = useCallback((page: number) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const contextValue: TodoContextType = {
    state,
    actions: {
      loadTodos,
      loadMetrics,
      createTodo,
      updateTodo,
      deleteTodo,
      toggleTodoDone,
      setFilters,
      setSorting,
      setCurrentPage,
      clearError,
    },
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

// Hook to use the todo context
export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

export default TodoContext;
