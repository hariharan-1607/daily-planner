import { CheckSquare, ListPlus, Clock, Bell, AlertCircle } from 'lucide-react'
import './DailyChecklistPlaceholder.css'

export default function DailyChecklistPlaceholder() {
  return (
    <div className="checklist-placeholder-card">
      <div className="card-header">
        <div className="header-left">
          <div className="card-icon">
            <CheckSquare size={20} />
          </div>
          <div>
            <h3 className="card-title">Daily Checklist</h3>
            <p className="card-description">Today's planned tasks, priorities, and action items</p>
          </div>
        </div>
        <div className="header-action">
          <button type="button" className="action-button-disabled" disabled title="Checklist functionality coming in next phase">
            <ListPlus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      <div className="placeholder-body">
        <div className="empty-state-visual">
          <div className="icon-circle">
            <CheckSquare size={36} />
          </div>
          <h4 className="empty-state-title">No tasks added yet</h4>
          <p className="empty-state-text">
            Your interactive daily checklist will be configured here. You'll be able to create tasks, assign priorities, set reminder times, and mark completions.
          </p>
        </div>

        <div className="checklist-preview-grid">
          <div className="preview-item">
            <div className="preview-checkbox"></div>
            <div className="preview-text-block">
              <span className="preview-label">Morning Routine &amp; Daily Goal Setting</span>
              <span className="preview-meta">
                <Clock size={12} /> 09:00 AM &bull; High Priority
              </span>
            </div>
            <span className="preview-tag tag-sample">Sample</span>
          </div>

          <div className="preview-item">
            <div className="preview-checkbox"></div>
            <div className="preview-text-block">
              <span className="preview-label">Review Daily Calendar &amp; Top 3 Priorities</span>
              <span className="preview-meta">
                <Bell size={12} /> 10:30 AM &bull; Medium Priority
              </span>
            </div>
            <span className="preview-tag tag-sample">Sample</span>
          </div>

          <div className="preview-item">
            <div className="preview-checkbox"></div>
            <div className="preview-text-block">
              <span className="preview-label">End-of-day Task Review &amp; Reflections</span>
              <span className="preview-meta">
                <Clock size={12} /> 05:30 PM &bull; Normal Priority
              </span>
            </div>
            <span className="preview-tag tag-sample">Sample</span>
          </div>
        </div>

        <div className="upcoming-note">
          <AlertCircle size={16} />
          <span>Interactive checklist creation, carry-forward logic, and reminders will be added in upcoming phases.</span>
        </div>
      </div>
    </div>
  )
}
