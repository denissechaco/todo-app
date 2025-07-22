import React from 'react';
import { Metrics as MetricsType, Priority } from '../types';
import { formatDuration } from '../utils';

interface MetricsProps {
  metrics: MetricsType | null;
}

const Metrics: React.FC<MetricsProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="metrics-section">
        <h2 style={{ marginBottom: '16px', color: '#333' }}>📊 Performance Metrics</h2>
        <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          <p>No metrics available yet. Complete some tasks to see performance data.</p>
        </div>
      </div>
    );
  }

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return '🔴';
      case Priority.MEDIUM:
        return '🟡';
      case Priority.LOW:
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  };

  return (
    <div className="metrics-section">
      <h2 style={{ marginBottom: '16px', color: '#333' }}>📊 Performance Metrics</h2>
      
      <div className="metrics-grid">
        {/* Overall Average */}
        <div className="metric-card">
          <div className="metric-value">
            {metrics.averageCompletionTime > 0 
              ? formatDuration(metrics.averageCompletionTime)
              : 'N/A'
            }
          </div>
          <div className="metric-label">⏱️ Overall Average</div>
        </div>

        {/* Priority-based metrics */}
        {metrics.priorityMetrics.map((priorityMetric) => (
          <div key={priorityMetric.priority} className="metric-card">
            <div className="metric-value">
              {priorityMetric.averageCompletionTime > 0
                ? formatDuration(priorityMetric.averageCompletionTime)
                : 'N/A'
              }
            </div>
            <div className="metric-label">
              {getPriorityIcon(priorityMetric.priority)} {getPriorityLabel(priorityMetric.priority)} Priority
              {priorityMetric.count > 0 && (
                <div style={{ fontSize: '0.75rem', marginTop: '2px', opacity: 0.8 }}>
                  ({priorityMetric.count} completed)
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Total completed tasks */}
        <div className="metric-card">
          <div className="metric-value">
            {metrics.priorityMetrics.reduce((sum, pm) => sum + pm.count, 0)}
          </div>
          <div className="metric-label">✅ Tasks Completed</div>
        </div>
      </div>

      {/* Additional insights */}
      {metrics.priorityMetrics.length > 0 && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '6px',
          fontSize: '0.875rem',
          color: '#666'
        }}>
          <strong>💡 Insight:</strong>{' '}
          {(() => {
            const sortedByTime = [...metrics.priorityMetrics]
              .filter(pm => pm.averageCompletionTime > 0)
              .sort((a, b) => a.averageCompletionTime - b.averageCompletionTime);
            
            if (sortedByTime.length === 0) {
              return "Complete more tasks to see performance insights.";
            }
            
            const fastest = sortedByTime[0];
            const slowest = sortedByTime[sortedByTime.length - 1];
            
            if (sortedByTime.length === 1) {
              return `You complete ${getPriorityLabel(fastest.priority).toLowerCase()} priority tasks in an average of ${formatDuration(fastest.averageCompletionTime)}.`;
            }
            
            return `You're fastest with ${getPriorityLabel(fastest.priority).toLowerCase()} priority tasks (${formatDuration(fastest.averageCompletionTime)}) and take longer with ${getPriorityLabel(slowest.priority).toLowerCase()} priority tasks (${formatDuration(slowest.averageCompletionTime)}).`;
          })()}
        </div>
      )}
    </div>
  );
};

export default Metrics;