import { Priority } from '../types';

// Format date to display string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date to input value (YYYY-MM-DD)
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Get background color based on due date
export const getDueDateBackgroundColor = (dueDate?: string): string => {
  if (!dueDate) return '';

  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'bg-red-200'; // Overdue
  if (diffDays <= 7) return 'bg-red-100'; // Less than a week
  if (diffDays <= 14) return 'bg-yellow-100'; // Less than 2 weeks
  return 'bg-green-100'; // More than 2 weeks
};

// Get priority display color
export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case Priority.HIGH:
      return 'text-red-600 bg-red-50';
    case Priority.MEDIUM:
      return 'text-yellow-600 bg-yellow-50';
    case Priority.LOW:
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

// Get priority sort value (for sorting)
export const getPrioritySortValue = (priority: Priority): number => {
  switch (priority) {
    case Priority.HIGH:
      return 3;
    case Priority.MEDIUM:
      return 2;
    case Priority.LOW:
      return 1;
    default:
      return 0;
  }
};

// Format time duration (for metrics)
export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }
  
  if (hours < 24) {
    return `${hours.toFixed(1)} hours`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  
  if (remainingHours === 0) {
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }
  
  return `${days}d ${remainingHours}h`;
};

// Debounce function for search input
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

