import { useState } from 'react'
import {
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Tag,
  Check,
  Edit2,
  Trash2,
  ChevronDown
} from 'lucide-react'
import './TaskCard.css'

export default function TaskCard({
  task,
  onToggleComplete,
  onStatusChange,
  onEdit,
  onDelete
}) {
  const {
    id,
    title,
    description,
    priority,
    category,
    reminderTime,
    status,
    remainingWork
  } = task

  const isCompleted = status === 'Completed'

  // Priority color styling helper
  const getPriorityClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'priority-high'
      case 'medium':
        return 'priority-medium'
      case 'low':
      default:
        return 'priority-low'
    }
  }

  // Handle status selector change (mutually exclusive)
  const handleSelectStatus = (e) => {
    const newStatus = e.target.value
    if (newStatus !== status) {
      onStatusChange(task, newStatus)
    }
  }

  return (
    <div className={`task-card task-card-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="task-main-row">
        {/* Completion Checkbox (Represents Completed <-> Pending only) */}
        <button
          type="button"
          className={`task-checkbox-btn ${isCompleted ? 'btn-status-completed' : 'btn-status-uncompleted'}`}
          onClick={() => onToggleComplete(id)}
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          aria-label={isCompleted ? `Mark ${title} as Pending` : `Mark ${title} as Completed`}
        >
          {isCompleted && <Check size={14} className="check-icon" />}
        </button>

        <div className="task-content">
          <div className="task-header-line">
            <h4 className={`task-title ${isCompleted ? 'task-title-completed' : ''}`}>
              {title}
            </h4>

            <div className="task-actions-group">
              {/* Status Selector Dropdown */}
              <div className="status-selector-wrapper">
                <select
                  className={`task-status-dropdown dropdown-status-${status.toLowerCase().replace(/\s+/g, '-')}`}
                  value={status}
                  onChange={handleSelectStatus}
                  aria-label="Change task status"
                >
                  <option value="Pending">Pending</option>
                  <option value="Partially Completed">Partially Completed</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown size={12} className="dropdown-arrow" />
              </div>

              {/* Edit Action Button */}
              <button
                type="button"
                className="task-icon-action-btn btn-edit"
                onClick={() => onEdit(task)}
                title="Edit task"
                aria-label={`Edit ${title}`}
              >
                <Edit2 size={15} />
              </button>

              {/* Delete Action Button */}
              <button
                type="button"
                className="task-icon-action-btn btn-delete"
                onClick={() => onDelete(task)}
                title="Delete task"
                aria-label={`Delete ${title}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Optional Task Description */}
          {description && (
            <p className={`task-description ${isCompleted ? 'task-desc-completed' : ''}`}>
              {description}
            </p>
          )}

          {/* Remaining Work Callout (Displayed when Partially Completed) */}
          {status === 'Partially Completed' && remainingWork && (
            <div className="task-remaining-callout">
              <AlertCircle size={14} className="remaining-callout-icon" />
              <div className="remaining-callout-text">
                <span className="remaining-callout-label">Remaining Work:</span>
                <span className="remaining-callout-desc">{remainingWork}</span>
              </div>
            </div>
          )}

          {/* Footer Metadata */}
          <div className="task-footer-meta">
            <span className={`task-tag ${getPriorityClass(priority)}`}>
              {priority} Priority
            </span>

            <span className="task-tag task-category-tag">
              <Tag size={11} />
              {category}
            </span>

            {reminderTime && (
              <span className="task-time-badge">
                <Clock size={12} />
                <span>{reminderTime}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
