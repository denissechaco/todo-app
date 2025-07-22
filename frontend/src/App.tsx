import React, { useEffect } from 'react';
import './App.css';
import { TodoProvider, useTodoContext } from './context/TodoContext';
import TodoFilters from './components/TodoFilters';
import TodoTable from './components/TodoTable';
import TodoModal from './components/TodoModal';
import Pagination from './components/Pagination';
import Metrics from './components/Metrics';
import ErrorMessage from './components/ErrorMessage';

// Main App Content Component (inside TodoProvider)
const AppContent: React.FC = () => {
  const { state, actions } = useTodoContext();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingTodo, setEditingTodo] = React.useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    actions.loadTodos();
    actions.loadMetrics();
  }, [actions]);

  // Reload todos when filters, sorting, or page changes
  useEffect(() => {
    actions.loadTodos();
  }, [state.filters, state.sorting, state.currentPage, actions]);

  const handleCreateTodo = () => {
    setShowCreateModal(true);
  };

  const handleEditTodo = (todoId: string) => {
    setEditingTodo(todoId);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingTodo(null);
  };

  const getTodoById = (id: string) => {
    return state.todos?.content.find(todo => todo.id === id);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <h1>To do List Manager</h1>
        <p>Let's get the job done</p>
      </header>

      {/* Error Message */}
      {state.error && (
        <ErrorMessage 
          message={state.error} 
          onClose={actions.clearError}
        />
      )}

      {/* Metrics Section */}
      <Metrics metrics={state.metrics} />

      {/* Filters Section */}
      <div className="filters-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>📝 Tasks</h2>
          <button 
            className="btn btn-primary"
            onClick={handleCreateTodo}
            disabled={state.loading}
          >
            {state.loading ? (
              <>
                <span className="loading-spinner" style={{ marginRight: '8px' }}></span>
                Loading...
              </>
            ) : (
              '+ New Task'
            )}
          </button>
        </div>
        
        <TodoFilters
          filters={state.filters}
          sorting={state.sorting}
          onFiltersChange={actions.setFilters}
          onSortingChange={actions.setSorting}
        />
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', minHeight: '400px' }}>
        {state.loading && !state.todos && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
            <p>Loading your tasks...</p>
          </div>
        )}

        {!state.loading && state.todos && (
          <>
            {/* Todo Table */}
            <TodoTable
              todos={state.todos.content}
              onToggleDone={actions.toggleTodoDone}
              onEdit={handleEditTodo}
              onDelete={actions.deleteTodo}
              sorting={state.sorting}
              onSortingChange={actions.setSorting}
            />

            {/* Pagination */}
            {state.todos.totalPages > 1 && (
              <Pagination
                currentPage={state.currentPage}
                totalPages={state.todos.totalPages}
                onPageChange={actions.setCurrentPage}
              />
            )}

            {/* Empty State */}
            {state.todos.content.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#666'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📝</div>
                <h3>No tasks found</h3>
                <p>
                  {Object.keys(state.filters).length > 0 || state.filters.text || state.filters.priority || state.filters.done !== undefined
                    ? 'Try adjusting your filters or create a new task.'
                    : 'Create your first task to get started!'}
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateTodo}
                  style={{ marginTop: '16px' }}
                >
                  + Create First Task
                </button>
              </div>
            )}
          </>
        )}

        {/* Loading overlay for actions */}
        {state.loading && state.todos && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10
          }}>
            <div className="loading-spinner" style={{ width: '30px', height: '30px' }}></div>
          </div>
        )}
      </div>

      {/* Create Todo Modal */}
      {showCreateModal && (
        <TodoModal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          onSave={actions.createTodo}
          title="Create New Task"
        />
      )}

      {/* Edit Todo Modal */}
      {editingTodo && (
        <TodoModal
          isOpen={!!editingTodo}
          onClose={handleCloseModal}
          onSave={(updates) => actions.updateTodo(editingTodo, updates)}
          title="Edit Task"
          initialData={getTodoById(editingTodo)}
        />
      )}

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        padding: '20px', 
        color: '#666',
        borderTop: '1px solid #eee'
      }}>
        <p>Built with React + TypeScript + Spring Boot</p>
        <p style={{ fontSize: '0.875rem' }}>
          Tasks: {state.todos?.totalElements || 0} | 
          Pages: {state.todos?.totalPages || 0} | 
          Current: {(state.currentPage || 0) + 1}
        </p>
      </footer>
    </div>
  );
};

const handleDeleteTodo = async (id: string) => {
  if (window.confirm('Are you sure you want to delete this to do?')) {
    await deleteTodo(id);
  }
}


// Main App Component with Provider
const App: React.FC = () => {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
};

export default App;
