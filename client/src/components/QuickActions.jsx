import { PlusCircle, ListPlus, Calendar, ClipboardCheck, FileSpreadsheet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './QuickActions.css'

export default function QuickActions({ onAddTaskClick, onBulkAddClick }) {
  const navigate = useNavigate()

  const actions = [
    {
      id: 'add-task',
      label: 'Add New Task',
      desc: 'Plan an individual task',
      icon: PlusCircle,
      variant: 'purple',
      onClick: onAddTaskClick
    },
    {
      id: 'bulk-add',
      label: 'Bulk Add Tasks',
      desc: 'Import numbered or bulleted list',
      icon: ListPlus,
      variant: 'purple',
      onClick: onBulkAddClick
    },
    {
      id: 'calendar',
      label: 'View Calendar',
      desc: 'Schedule & timeline',
      icon: Calendar,
      variant: 'blue',
      onClick: () => navigate('/calendar')
    },
    {
      id: 'review',
      label: 'Daily Review',
      desc: 'Reflect on progress',
      icon: ClipboardCheck,
      variant: 'amber',
      onClick: () => navigate('/review')
    },
    {
      id: 'checklist',
      label: 'Open My Checklist',
      desc: 'Google Sheets sync view',
      icon: FileSpreadsheet,
      variant: 'green',
      onClick: () => navigate('/checklist')
    }
  ]

  return (
    <div className="quick-actions-card">
      <div className="quick-actions-header">
        <h3 className="quick-actions-title">Quick Actions</h3>
        <span className="quick-actions-subtitle">Shortcuts &amp; Tools</span>
      </div>

      <div className="quick-actions-grid">
        {actions.map((act) => {
          const Icon = act.icon
          return (
            <button
              key={act.id}
              type="button"
              className={`quick-action-item action-variant-${act.variant}`}
              onClick={act.onClick}
              title={act.label}
            >
              <div className="action-icon-circle">
                <Icon size={18} />
              </div>
              <div className="action-text-block">
                <span className="action-label">{act.label}</span>
                <span className="action-desc">{act.desc}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
