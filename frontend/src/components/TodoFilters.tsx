import React, { useState } from 'react';
import { Priority, FilterState, TodoSorting } from '../types';

export interface TodoFiltersProps {
  filters: FilterState;
  sorting: TodoSorting;
  onFiltersChange: (filters: FilterState) => void;
  onSortingChange: (sorting: TodoSorting) => void;
  onNewTodo: () => void;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({
  filters,
  sorting,
  onFiltersChange,
  onSortingChange,
  onNewTodo
}) => {
  
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  return (
    <div className="filters-container">
      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="name-filter">Search by name:</label>
          <input
            id="name-filter"
            type="text"
            placeholder="Filter by name..."
            value={filters.text}
            onChange={(e) => handleFilterChange('text', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="priority-filter">Priority:</label>
          <select
            id="priority-filter"
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
            className="filter-select"
          >
            <option value="">All priorities</option>
            <option value={Priority.HIGH}>High</option>
            <option value={Priority.MEDIUM}>Medium</option>
            <option value={Priority.LOW}>Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={filters.done === undefined ? '' : filters.done.toString()}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('done', value === '' ? undefined : value === 'true');
            }}
            className="filter-select"
          >
            <option value="">All tasks</option>
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>

        <button
          onClick={onNewTodo}
          className="new-todo-btn"
        >
          + New To Do
        </button>
      </div>
    </div>
  );
};

export default TodoFilters;