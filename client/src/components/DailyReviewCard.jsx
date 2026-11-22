import { ClipboardCheck, ArrowRight, CheckCircle2, AlertCircle, Clock3, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './DailyReviewCard.css'

export default function DailyReviewCard({
  reviewData = {
    dateLabel: 'Yesterday (Saturday, Nov 21)',
    totalPlanned: 6,
    completed: 4,
    partiallyCompleted: 1,
    pending: 1,
    carriedForward: 2,
    completionRate: 67
  }
}) {
  const navigate = useNavigate()

  return (
    <div className="daily-review-card">
      <div className="review-card-header">
        <div className="review-header-title">
          <div className="review-icon-circle">
            <ClipboardCheck size={18} />
          </div>
          <div>
            <h3 className="review-title">Daily Review</h3>
            <span className="review-date-label">{reviewData.dateLabel}</span>
          </div>
        </div>
      </div>

      <div className="review-score-section">
        <div className="score-info">
          <span className="score-label">Completion Score</span>
          <span className="score-percentage">{reviewData.completionRate}%</span>
        </div>
        <div className="review-progress-track">
          <div
            className="review-progress-fill"
            style={{ width: `${reviewData.completionRate}%` }}
          />
        </div>
      </div>

      <div className="review-stats-grid">
        <div className="review-stat-item">
          <span className="stat-label">Total Planned</span>
          <span className="stat-value">{reviewData.totalPlanned}</span>
        </div>
        <div className="review-stat-item stat-item-completed">
          <span className="stat-label">
            <CheckCircle2 size={12} /> Completed
          </span>
          <span className="stat-value">{reviewData.completed}</span>
        </div>
        <div className="review-stat-item stat-item-partial">
          <span className="stat-label">
            <Clock3 size={12} /> Partial
          </span>
          <span className="stat-value">{reviewData.partiallyCompleted}</span>
        </div>
        <div className="review-stat-item stat-item-pending">
          <span className="stat-label">
            <AlertCircle size={12} /> Pending
          </span>
          <span className="stat-value">{reviewData.pending}</span>
        </div>
      </div>

      <div className="review-carried-notice">
        <RotateCcw size={14} className="carried-icon" />
        <span><strong>{reviewData.carriedForward} tasks</strong> carried forward to today</span>
      </div>

      <div className="review-card-footer">
        <button
          type="button"
          className="view-review-btn"
          onClick={() => navigate('/review')}
        >
          <span>View Daily Review</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
