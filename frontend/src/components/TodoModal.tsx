import React, { useState, useEffect } from 'react';
import { Todo, Priority, CreateTodoRequest, UpdateTodoRequest } from '../types';

interface TodoModalProps {
  isOpen: boolean;
  todo?: Todo;
  onClose: () => void;
  onSave: (todo: CreateTodoRequest | UpdateTodoRequest) => void;
  title: string; // a ver si funciona
  initialData?: Todo;
}

const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
  title
}) => {
  const [formData, setFormData] = useState({
    text: '',
    priority: Priority.MEDIUM,
    dueDate: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit mode
        setFormData({
          text: initialData.text,
          priority: initialData.priority,
          dueDate: initialData.dueDate ? initialData.dueDate.toString().split('T')[0] : ''
        });
      } else {
        // Create mode
        setFormData({
          text: '',
          priority: Priority.MEDIUM,
          dueDate: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Task name is required';
    } else if (formData.text.length > 120) {
      newErrors.text = 'Task name must be 120 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const todoData = {
      text: formData.text.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
    };

    if (initialData) {
      // Edit mode
      onSave({ ...todoData, id: initialData.id } as UpdateTodoRequest);
    } else {
      // Create mode
      onSave(todoData as CreateTodoRequest);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            onClick={onClose}
            className="close-btn"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-text">Task Name *</label>
            <input
              id="task-text"
              type="text"
              value={formData.text}
              onChange={(e) => handleChange('text', e.target.value)}
              className={errors.text ? 'form-input error' : 'form-input'}
              placeholder="Enter task description..."
              maxLength={120}
            />
            {errors.text && <span className="error-text">{errors.text}</span>}
            <small className="char-counter">
              {formData.text.length}/120 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value as Priority)}
              className="form-select"
            >
              <option value={Priority.HIGH}>High</option>
              <option value={Priority.MEDIUM}>Medium</option>
              <option value={Priority.LOW}>Low</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="due-date">Due Date</label>
            <input
              id="due-date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
            />
            {formData.dueDate && (
              <button
                type="button"
                onClick={() => handleChange('dueDate', '')}
                className="clear-date-btn"
              >
                Clear date
              </button>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {initialData ? 'Update' : 'Create'} Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal;