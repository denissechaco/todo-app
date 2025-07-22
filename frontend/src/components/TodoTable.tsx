import React from 'react';
import { Todo, SortConfig, Priority } from '../types';
import { formatDate, getDueDateBackgroundColor } from '../utils';

interface TodoTableProps {
  todos: Todo[];
  onSort: (field: 'priority' | 'dueDate') => void;
  sortConfig: SortConfig;
  onToggleDone: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoTable: React.FC<TodoTableProps> = ({
  todos,
  onSort,
  sortConfig,
  onToggleDone,
  onEdit,
  onDelete
}) => {
  const getSortIcon = (field: 'priority' | 'dueDate') => {
    if (sortConfig.field === field) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return ' ↕';
  };

  const getPriorityOrder = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return 3;
      case Priority.MEDIUM: return 2;
      case Priority.LOW: return 1;
      default: return 0;
    }
  };

  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return 'priority-high';
      case Priority.MEDIUM: return 'priority-medium';
      case Priority.LOW: return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="table-container">
      <table className="todo-table">
        <thead>
          <tr>
            <th className="checkbox-column">Done</th>
            <th>Task</th>
            <th 
              className="sortable-header"
              onClick={() => onSort('priority')}
            >
              Priority {getSortIcon('priority')}
            </th>
            <th 
              className="sortable-header"
              onClick={() => onSort('dueDate')}
            >
              Due Date {getSortIcon('dueDate')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr 
              key={todo.id}
              className={`todo-row ${getDueDateBackgroundColor(todo.dueDate)}`}
            >
              <td>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => onToggleDone(todo.id)}
                  className="todo-checkbox"
                />
              </td>
              <td className={todo.done ? 'done-task' : ''}>
                {todo.text}
              </td>
              <td>
                <span className={`priority-badge ${getPriorityClass(todo.priority)}`}>
                  {todo.priority}
                </span>
              </td>
              <td>
                {todo.dueDate ? formatDate(todo.dueDate) : '-'}
              </td>
              <td className="actions-column">
                <button
                  onClick={() => onEdit(todo)}
                  className="action-btn edit-btn"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="action-btn delete-btn"
                  title="Delete"
                  disabled={todo.done}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {todos.length === 0 && (
        <div className="empty-state">
          <p>No todos found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default TodoTable;