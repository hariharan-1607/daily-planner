import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Sparkles } from 'lucide-react'
import './PlaceholderPage.css'

export default function PlaceholderPage({
  title = 'Module',
  icon: Icon,
  phase = 'Phase 3 / 4',
  description = 'This section will be developed in future phases.'
}) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-container-card">
        <div className="placeholder-icon-circle">
          {Icon ? <Icon size={38} /> : <Clock size={38} />}
        </div>
        <div className="placeholder-badge">
          <Sparkles size={14} />
          <span>Scheduled for {phase}</span>
        </div>
        <h2 className="placeholder-title">{title}</h2>
        <p className="placeholder-description">{description}</p>

        <div className="placeholder-actions">
          <Link to="/" className="back-to-dashboard-btn">
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
