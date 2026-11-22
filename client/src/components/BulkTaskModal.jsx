import { useState, useEffect } from 'react'
import { X, ListPlus, Trash2, Calendar, AlertCircle, CheckCircle2, Edit2 } from 'lucide-react'
import { parseBulkTasks } from '../utils/taskParser'
import { getTodayDateString, isValidDateString } from '../utils/dateUtils'
import './BulkTaskModal.css'

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low']
const CATEGORY_OPTIONS = ['Study', 'Project', 'Personal', 'Career', 'Shopping', 'Other']

export default function BulkTaskModal({
  isOpen,
  onClose,
  onSubmit,
  defaultDate
}) {
  const [rawText, setRawText] = useState('')
  const [extractedTasks, setExtractedTasks] = useState([])
  const [scheduledDate, setScheduledDate] = useState(defaultDate || getTodayDateString())
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState('Personal')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      setRawText('')
      setExtractedTasks([])
      setScheduledDate(defaultDate || getTodayDateString())
      setPriority('Medium')
      setCategory('Personal')
      setErrorMessage('')
    }
  }, [isOpen, defaultDate])

  // Automatically parse whenever rawText changes
  useEffect(() => {
    const parsed = parseBulkTasks(rawText)
    setExtractedTasks(parsed)
  }, [rawText])

  if (!isOpen) return null

  // Update single extracted title in the preview list
  const handleEditExtracted = (index, newTitle) => {
    setExtractedTasks((prev) => {
      const copy = [...prev]
      copy[index] = newTitle
      return copy
    })
  }

  // Remove single extracted title from the preview list
  const handleRemoveExtracted = (index) => {
    setExtractedTasks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validTasks = extractedTasks.map((t) => t.trim()).filter((t) => t.length > 0)

    if (validTasks.length === 0) {
      setErrorMessage('Please enter at least one task in the text area.')
      return
    }

    if (!isValidDateString(scheduledDate)) {
      setErrorMessage('Please select a valid scheduled date.')
      return
    }

    onSubmit({
      titles: validTasks,
      scheduledDate,
      priority,
      category
    })

    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-card bulk-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-text">
            <h3 className="modal-title">Bulk Add Tasks</h3>
            <p className="modal-subtitle">
              Paste or type numbered tasks or bullet points to quickly generate a daily checklist
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
          {/* Multiline Input Text Area */}
          <div className="form-group">
            <label htmlFor="bulk-raw-text" className="form-label required-label">
              Enter Tasks (Numbered or Bullets)
            </label>
            <textarea
              id="bulk-raw-text"
              className="form-textarea bulk-textarea"
              rows={5}
              placeholder={`1. Complete Java Collections.\n2. Work on DisasterGuard dashboard.\n3. Pay electricity bill.\n4. Revise aptitude.\n5. Purchase college materials.`}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value)
                if (errorMessage) setErrorMessage('')
              }}
              autoFocus
            />
            <span className="form-hint">
              Supported formats: <code>1. Task</code>, <code>1) Task</code>, <code>- Task</code>, <code>• Task</code>, <code>* Task</code>
            </span>
          </div>

          {/* Common Settings Row: Date, Priority, Category */}
          <div className="form-row-3">
            <div className="form-group">
              <label htmlFor="bulk-date" className="form-label required-label">
                Scheduled Date
              </label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <input
                  id="bulk-date"
                  type="date"
                  className="form-input with-icon-padding"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bulk-priority" className="form-label">
                Priority
              </label>
              <select
                id="bulk-priority"
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
              <label htmlFor="bulk-category" className="form-label">
                Category
              </label>
              <select
                id="bulk-category"
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

          {/* Extracted Tasks Preview List */}
          <div className="extracted-section">
            <div className="extracted-header">
              <span className="extracted-title">
                Extracted Tasks Preview
              </span>
              <span className="extracted-count-badge">
                {extractedTasks.length} {extractedTasks.length === 1 ? 'task' : 'tasks'} identified
              </span>
            </div>

            {extractedTasks.length > 0 ? (
              <div className="extracted-list">
                {extractedTasks.map((item, idx) => (
                  <div key={idx} className="extracted-item-row">
                    <span className="item-number">{idx + 1}.</span>
                    <input
                      type="text"
                      className="extracted-input"
                      value={item}
                      onChange={(e) => handleEditExtracted(idx, e.target.value)}
                      placeholder="Task title"
                    />
                    <button
                      type="button"
                      className="item-delete-btn"
                      onClick={() => handleRemoveExtracted(idx)}
                      title="Remove task"
                      aria-label={`Remove task ${idx + 1}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="extracted-empty">
                <p>No tasks parsed yet. Paste or type task items above.</p>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={extractedTasks.length === 0}
            >
              <ListPlus size={16} />
              <span>Add All Tasks ({extractedTasks.length})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
