import { useState, useMemo } from 'react'
import {
  AlertTriangle,
  Clock3,
  CircleDashed,
  Filter,
  CheckCircle2,
  CalendarClock,
  ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import CarriedForwardCard from '../components/CarriedForwardCard'
import TaskModal from '../components/TaskModal'
import RescheduleModal from '../components/RescheduleModal'
import './OverdueTasksPage.css'

export default function OverdueTasksPage() {
  const {
    carriedForwardTasks,
    setTaskStatus,
    updateTask,
    rescheduleTask
  } = useTasks()

  const [activeFilter, setActiveFilter] = useState('All')
  const [editingTask, setEditingTask] = useState(null)
  const [reschedulingTask, setReschedulingTask] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 3500)
  }

  // Summary counts
  const totalOverdue = carriedForwardTasks.length
  const pendingOverdue = carriedForwardTasks.filter((t) => t.status === 'Pending').length
  const partialOverdue = carriedForwardTasks.filter((t) => t.status === 'Partially Completed').length

  // Filtered overdue list
  const filteredTasks = useMemo(() => {
    return carriedForwardTasks.filter((t) => {
      if (activeFilter === 'Pending') return t.status === 'Pending'
      if (activeFilter === 'Partially Completed') return t.status === 'Partially Completed'
      return true
    })
  }, [carriedForwardTasks, activeFilter])

  // Handlers
  const handleComplete = (taskId) => {
    const task = carriedForwardTasks.find((t) => t.id === taskId)
    setTaskStatus(taskId, 'Completed')
    showToast(`Completed overdue task "${task ? task.title : 'Task'}"`)
  }

  const handleEdit = (task) => {
    setEditingTask(task)
  }

  const handleSaveEdit = (updatedData) => {
    if (editingTask) {
      updateTask(editingTask.id, updatedData)
      showToast(`Updated "${updatedData.title}"`)
      setEditingTask(null)
    }
  }

  const handleReschedule = (taskId, newDate) => {
    rescheduleTask(taskId, newDate)
    showToast('Task rescheduled to a new target date!')
    setReschedulingTask(null)
  }

  return (
    <div className="overdue-page-container">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="feedback-toast" role="status">
          <CheckCircle2 size={16} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="overdue-header-banner">
        <div className="overdue-header-content">
          <div className="overdue-badge">
            <AlertTriangle size={15} />
            <span>Overdue Task Management</span>
          </div>
          <h2 className="overdue-page-title">Carried Forward &amp; Overdue Tasks</h2>
          <p className="overdue-page-subtitle">
            Unfinished tasks automatically rolled forward from previous days. Complete or reschedule them to keep your plan clean.
          </p>
        </div>

        <Link to="/" className="back-link-btn">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Overdue Metric Summary Cards */}
      <div className="overdue-metrics-grid">
        <div className="overdue-metric-card metric-card-total">
          <div className="metric-icon-box icon-box-danger">
            <AlertTriangle size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Overdue</span>
            <h3 className="metric-value">{totalOverdue}</h3>
            <span className="metric-subtext">Needs attention</span>
          </div>
        </div>

        <div className="overdue-metric-card metric-card-partial">
          <div className="metric-icon-box icon-box-warning">
            <Clock3 size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Partially Completed</span>
            <h3 className="metric-value">{partialOverdue}</h3>
            <span className="metric-subtext">Work in progress</span>
          </div>
        </div>

        <div className="overdue-metric-card metric-card-pending">
          <div className="metric-icon-box icon-box-pending">
            <CircleDashed size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Pending</span>
            <h3 className="metric-value">{pendingOverdue}</h3>
            <span className="metric-subtext">Awaiting action</span>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="overdue-list-card">
        <div className="overdue-list-header">
          <div className="filter-bar">
            <span className="filter-label">
              <Filter size={13} /> Filter:
            </span>
            {[
              { label: 'All', count: totalOverdue },
              { label: 'Pending', count: pendingOverdue },
              { label: 'Partially Completed', count: partialOverdue }
            ].map(({ label, count }) => (
              <button
                key={label}
                type="button"
                className={`filter-pill ${activeFilter === label ? 'filter-pill-active' : ''}`}
                onClick={() => setActiveFilter(label)}
              >
                {label} <span className="filter-count">({count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="overdue-cards-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <CarriedForwardCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onReschedule={(t) => setReschedulingTask(t)}
              />
            ))
          ) : (
            <div className="overdue-empty-state">
              <div className="empty-celebrate-icon">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="empty-state-title">
                {totalOverdue === 0
                  ? 'All caught up! No overdue tasks.'
                  : `No overdue tasks in "${activeFilter}"`}
              </h4>
              <p className="empty-state-text">
                {totalOverdue === 0
                  ? 'All tasks from previous days have been completed or rescheduled. Great job staying focused!'
                  : 'Try selecting a different filter above.'}
              </p>
              {totalOverdue === 0 && (
                <Link to="/" className="btn btn-primary mt-2">
                  <span>Return to Dashboard</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSubmit={handleSaveEdit}
        task={editingTask}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={Boolean(reschedulingTask)}
        onClose={() => setReschedulingTask(null)}
        task={reschedulingTask}
        onReschedule={handleReschedule}
      />
    </div>
  )
}
