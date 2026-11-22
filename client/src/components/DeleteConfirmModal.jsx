import { X, Trash2, AlertTriangle } from 'lucide-react'
import './DeleteConfirmModal.css'

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  taskTitle,
  onConfirm
}) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-card delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-body">
          <div className="delete-warning-icon">
            <AlertTriangle size={28} />
          </div>
          <h3 className="delete-title">Delete Task?</h3>
          <p className="delete-message">
            Are you sure you want to delete <strong>"{taskTitle}"</strong>? This will remove the task from your checklist.
          </p>

          <div className="delete-modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger-action"
              onClick={() => {
                onConfirm()
                onClose()
              }}
            >
              <Trash2 size={16} />
              <span>Delete Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
