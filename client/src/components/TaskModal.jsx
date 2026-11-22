import { useState, useEffect } from 'react'
import { X, Calendar, Clock, AlertCircle, Tag, CheckCircle2 } from 'lucide-react'
import { getTodayDateString, isValidDateString } from '../utils/dateUtils'
import './TaskModal.css'

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low']
const CATEGORY_OPTIONS = ['Study', 'Project', 'Personal', 'Career', 'Shopping', 'Other']
const STATUS_OPTIONS = ['Pending', 'Partially Completed', 'Completed']

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  task = null, // null for create mode, task object for edit mode
  defaultDate
}) {
  const isEditMode = Boolean(task)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledDate, setScheduledDate] = useState(defaultDate || getTodayDateString())
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState('Personal')
  const [reminderTime, setReminderTime] = useState('')
  const [status, setStatus] = useState('Pending')
  const [remainingWork, setRemainingWork] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Prepopulate form when editing or opening
  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setScheduledDate(task.scheduledDate || getTodayDateString())
      setPriority(task.priority || 'Medium')
      setCategory(task.category || 'Personal')
      setReminderTime(task.reminderTime || '')
      setStatus(task.status || 'Pending')
      setRemainingWork(task.remainingWork || '')
    } else {
      setTitle('')
      setDescription('')
      setScheduledDate(defaultDate || getTodayDateString())
      setPriority('Medium')
      setCategory('Personal')
      setReminderTime('')
      setStatus('Pending')
      setRemainingWork('')
    }
    setErrorMessage('')
  }, [task, defaultDate, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!title.trim()) {
      setErrorMessage('Task title cannot be empty.')
      return
    }

    if (!isValidDateString(scheduledDate)) {
      setErrorMessage('Please select a valid scheduled date.')
      return
    }

    if (status === 'Partially Completed' && !remainingWork.trim()) {
      setErrorMessage('Please describe the remaining work for a partially completed task.')
      return
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      scheduledDate,
      priority,
      category,
      reminderTime: reminderTime.trim(),
      status,
      remainingWork: status === 'Partially Completed' ? remainingWork.trim() : ''
    })

    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-text">
            <h3 className="modal-title">{isEditMode ? 'Edit Task' : 'Add New Task'}</h3>
            <p className="modal-subtitle">
              {isEditMode ? 'Update task details and progress' : 'Plan a prioritized action item'}
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

        {errorMessage && (
          <div className="modal-error-banner">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          {/* Task Title (Required) */}
          <div className="form-group">
            <label htmlFor="task-title" className="form-label required-label">
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              placeholder="e.g. Complete Java Collections revision"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errorMessage) setErrorMessage('')
              }}
              autoFocus
            />
          </div>

          {/* Date & Reminder Time Row */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="task-date" className="form-label required-label">
                Scheduled Date
              </label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <input
                  id="task-date"
                  type="date"
                  className="form-input with-icon-padding"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="task-time" className="form-label">
                Reminder Time (Optional)
              </label>
              <div className="input-with-icon">
                <Clock size={16} className="input-icon" />
                <input
                  id="task-time"
                  type="text"
                  className="form-input with-icon-padding"
                  placeholder="e.g. 09:30 AM"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Priority & Category Row */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="task-priority" className="form-label">
                Priority
              </label>
              <select
                id="task-priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} Priority
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-category" className="form-label">
                Category
              </label>
              <select
                id="task-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Selection */}
          <div className="form-group">
            <label className="form-label">Task Status</label>
            <div className="status-radio-group">
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`status-radio-card ${status === opt ? 'radio-card-active' : ''}`}
                >
                  <input
                    type="radio"
                    name="task-status"
                    value={opt}
                    checked={status === opt}
                    onChange={(e) => setStatus(e.target.value)}
                    className="radio-hidden-input"
                  />
                  <span className={`status-dot-indicator status-dot-${opt.toLowerCase().replace(/\s+/g, '-')}`} />
                  <span className="status-radio-label">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Remaining Work (Conditional for Partially Completed) */}
          {status === 'Partially Completed' && (
            <div className="form-group remaining-work-group">
              <label htmlFor="remaining-work" className="form-label required-label">
                Remaining Work Description
              </label>
              <textarea
                id="remaining-work"
                className="form-textarea remaining-textarea"
                rows={2}
                placeholder="What remains to be completed? (e.g. Need to complete unit tests and documentation)"
                value={remainingWork}
                onChange={(e) => setRemainingWork(e.target.value)}
              />
            </div>
          )}

          {/* Description (Optional) */}
          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="task-desc"
              className="form-textarea"
              rows={3}
              placeholder="Additional notes, sub-tasks, or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
