import { Menu, Bell, Sparkles, CalendarDays } from 'lucide-react'
import './Header.css'

export default function Header({ onMenuClick }) {
  const currentDate = new Date()

  // Format today's date dynamically (e.g. Sunday, November 22, 2026)
  const fullDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(currentDate)

  return (
    <header className="dashboard-header">
      <div className="header-left-group">
        <button
          type="button"
          className="mobile-menu-trigger"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-greeting-block">
          <div className="greeting-row">
            <h2 className="greeting-title">Welcome back!</h2>
            <div className="date-pill">
              <CalendarDays size={14} className="date-pill-icon" />
              <span>{fullDateFormatted}</span>
            </div>
          </div>
          <p className="greeting-subtitle">
            Transform your daily intentions into accomplished milestones.
          </p>
        </div>
      </div>

      <div className="header-right-group">
        {/* Notification Icon Placeholder with subtle indicator badge */}
        <div className="notification-wrapper">
          <button
            type="button"
            className="icon-action-btn"
            title="Notifications (2 reminders)"
            aria-label="View notifications"
          >
            <Bell size={19} />
            <span className="notification-badge-dot" />
          </button>
        </div>

        {/* User Identity Avatar */}
        <div className="user-profile-summary">
          <div className="user-avatar" title="Personal Workspace">
            <span>DP</span>
          </div>
          <div className="user-info">
            <span className="user-name">Daily Planner</span>
            <span className="user-role">Phase 2 Dashboard</span>
          </div>
        </div>
      </div>
    </header>
  )
}
