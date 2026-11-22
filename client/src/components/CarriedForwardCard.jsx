import { AlertTriangle, Calendar, Clock, CheckCircle2, CalendarClock, Edit2, Tag } from 'lucide-react'
import {
  formatDateForDisplay,
  formatShortDate,
  calculateDaysOverdue,
  formatOverdueBadge,
  getTodayDateString
} from '../utils/dateUtils'
import './CarriedForwardCard.css'

export default function CarriedForwardCard({
  task,
  onComplete,
  onEdit,
  onReschedule
}) {
  const {
    id,
    title,
    originalScheduledDate,
    scheduledDate,
    carryForwardCount = 1,
    priority = 'Medium',
    category,
    status,
    remainingWork
  } = task

  const daysOverdue = calculateDaysOverdue(originalScheduledDate || scheduledDate, getTodayDateString())

  // Priority color styling
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

  return (
    <div className="carried-card">
      <div className="carried-header">
        <div className="carried-title-block">
          <div className="carried-warning-dot">
            <AlertTriangle size={16} />
          </div>
          <div>
            <h4 className="carried-title">{title}</h4>
            <div className="carried-subtags-row">
              <span className={`carried-tag ${getPriorityClass(priority)}`}>
                {priority} Priority
              </span>
              {category && (
                <span className="carried-tag carried-category-tag">
                  <Tag size={10} />
                  {category}
                </span>
              )}
              <span className="carried-cycle-tag">
                Carried {carryForwardCount}x
              </span>
            </div>
          </div>
        </div>

        <div className="carried-header-right">
          <span className="overdue-tag">
            {formatOverdueBadge(daysOverdue)}
          </span>
          <span className={`status-pill status-pill-${status.toLowerCase().replace(/\s+/g, '-')}`}>
            {status}
          </span>
        </div>
      </div>

      {remainingWork && (
        <div className="remaining-work-box">
          <span className="remaining-label">Remaining Work:</span>
          <p className="remaining-text">{remainingWork}</p>
        </div>
      )}

      <div className="carried-meta-footer">
        <div className="carried-dates-info">
          <div className="carried-date-badge">
            <Calendar size={13} />
            <span>Original: <strong>{formatShortDate(originalScheduledDate || scheduledDate)}</strong></span>
          </div>
          <span className="date-arrow">&rarr;</span>
          <div className="carried-date-badge date-badge-current">
            <CalendarClock size={13} />
            <span>Scheduled: <strong>{formatShortDate(scheduledDate)}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="carried-actions">
          {onComplete && (
            <button
              type="button"
              className="carried-btn carried-btn-complete"
              onClick={() => onComplete(id)}
              title="Mark task as Completed"
              aria-label={`Mark ${title} as completed`}
            >
              <CheckCircle2 size={14} />
              <span>Complete</span>
            </button>
          )}

          {onReschedule && (
            <button
              type="button"
              className="carried-btn carried-btn-reschedule"
              onClick={() => onReschedule(task)}
              title="Reschedule task to a new date"
              aria-label={`Reschedule ${title}`}
            >
              <CalendarClock size={14} />
              <span>Reschedule</span>
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              className="carried-btn carried-btn-edit"
              onClick={() => onEdit(task)}
              title="Edit task details"
              aria-label={`Edit ${title}`}
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
