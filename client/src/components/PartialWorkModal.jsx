import { useState, useEffect } from 'react'
import { X, Clock, AlertCircle } from 'lucide-react'
import './PartialWorkModal.css'

export default function PartialWorkModal({
  isOpen,
  onClose,
  task,
  onSave
}) {
  const [remainingWork, setRemainingWork] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setRemainingWork(task.remainingWork || '')
      setError('')
    }
  }, [task, isOpen])

  if (!isOpen || !task) return null

  const handleSave = (e) => {
    e.preventDefault()
    if (!remainingWork.trim()) {
      setError('Please describe what remains to be completed.')
      return
    }
    onSave(task.id, remainingWork.trim())
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-card partial-work-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-text">
            <h3 className="modal-title">Mark as Partially Completed</h3>
            <p className="modal-subtitle">
              Task: <strong>{task.title}</strong>
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

        <form onSubmit={handleSave} className="task-form">
          <div className="form-group">
            <label htmlFor="partial-remaining-work" className="form-label required-label">
              Remaining Work Description
            </label>
            <textarea
              id="partial-remaining-work"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Complete the notification module, finalize test cases"
              value={remainingWork}
              onChange={(e) => {
                setRemainingWork(e.target.value)
                if (error) setError('')
              }}
              autoFocus
            />
            <span className="form-hint">
              Documenting remaining work helps with accurate daily review and carry-forward tracking.
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
            <button type="submit" className="btn btn-warning-action">
              <Clock size={16} />
              <span>Save Progress</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
