import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  AlertCircle,
  History,
  ClipboardCheck,
  FileSpreadsheet,
  BarChart3,
  Settings,
  CalendarCheck2,
  X,
  Sparkles
} from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import './Sidebar.css'

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'My Daily Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Overdue Tasks', path: '/overdue', icon: AlertCircle, isOverdueItem: true },
  { name: 'Task History', path: '/history', icon: History },
  { name: 'Daily Review', path: '/review', icon: ClipboardCheck },
  { name: 'My Checklist (Google Sheets)', path: '/checklist', icon: FileSpreadsheet },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar({ isOpen, onClose }) {
  const { carriedForwardTasks } = useTasks()
  const overdueCount = carriedForwardTasks.length

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar-container ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon-box">
              <CalendarCheck2 size={22} className="brand-svg" />
            </div>
            <div className="brand-info">
              <h1 className="brand-name">Daily Planner</h1>
              <span className="brand-tagline">Focus &amp; Execution</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon
              const badgeValue = item.isOverdueItem
                ? (overdueCount > 0 ? String(overdueCount) : null)
                : item.badge

              return (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                    onClick={onClose}
                  >
                    <Icon size={19} className="nav-icon" />
                    <span className="nav-label">{item.name}</span>
                    {badgeValue && <span className="nav-badge">{badgeValue}</span>}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="workspace-card">
            <div className="workspace-icon">
              <Sparkles size={16} />
            </div>
            <div className="workspace-text">
              <div className="workspace-title">Personal Workspace</div>
              <div className="workspace-desc">Local Storage &bull; Phase 4</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
