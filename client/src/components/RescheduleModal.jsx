import { useState, useEffect } from 'react'
import { X, Calendar, Clock, AlertCircle } from 'lucide-react'
import { getTodayDateString, isValidDateString, formatDateForDisplay } from '../utils/dateUtils'
import './RescheduleModal.css'

export default function RescheduleModal({
  isOpen,
  onClose,
  task,
  onReschedule
}) {
  const [newDate, setNewDate] = useState(getTodayDateString())
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setNewDate(getTodayDateString())
      setError('')
    }
  }, [task, isOpen])

  if (!isOpen || !task) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isValidDateString(newDate)) {
      setError('Please choose a valid date.')
      return
    }

    onReschedule(task.id, newDate)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-card reschedule-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-text">
            <h3 className="modal-title">Reschedule Task</h3>
            <p className="modal-subtitle">
              Assign a new target date and reset overdue tracking
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="modal-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="reschedule-task-preview">
            <span className="reschedule-label">Task</span>
            <h4 className="reschedule-task-title">{task.title}</h4>
            <div className="reschedule-meta-row">
              <span className="reschedule-meta-item">
                Current Scheduled: <strong>{formatDateForDisplay(task.scheduledDate)}</strong>
              </span>
              {task.originalScheduledDate && task.originalScheduledDate !== task.scheduledDate && (
                <span className="reschedule-meta-item text-danger">
                  Original: <strong>{formatDateForDisplay(task.originalScheduledDate)}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="new-reschedule-date" className="form-label required-label">
              New Scheduled Date
            </label>
            <div className="input-with-icon">
              <Calendar size={16} className="input-icon" />
              <input
                id="new-reschedule-date"
                type="date"
                className="form-input with-icon-padding"
                value={newDate}
                onChange={(e) => {
                  setNewDate(e.target.value)
                  if (error) setError('')
                }}
                autoFocus
              />
            </div>
            <span className="form-hint">
              Intentionally rescheduling a task establishes a fresh schedule and resets its overdue status.
            </span>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Calendar size={16} />
              <span>Reschedule Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
