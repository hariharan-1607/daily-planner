import { useState, useMemo, useEffect } from 'react'
import {
  ListTodo,
  CheckCircle2,
  Clock3,
  CircleDashed,
  Plus,
  ListPlus,
  AlertTriangle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CalendarDays,
  X,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import {
  getTodayDateString,
  formatDateForDisplay,
  formatShortDate,
  shiftDateString,
  isToday
} from '../utils/dateUtils'
import SummaryCard from '../components/SummaryCard'
import TaskCard from '../components/TaskCard'
import CarriedForwardCard from '../components/CarriedForwardCard'
import DailyReviewCard from '../components/DailyReviewCard'
import QuickActions from '../components/QuickActions'
import TaskModal from '../components/TaskModal'
import BulkTaskModal from '../components/BulkTaskModal'
import PartialWorkModal from '../components/PartialWorkModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import RescheduleModal from '../components/RescheduleModal'
import './DashboardPage.css'

export default function DashboardPage() {
  const {
    tasks,
    selectedDate,
    setSelectedDate,
    addTask,
    addBulkTasks,
    updateTask,
    rescheduleTask,
    deleteTask,
    setTaskStatus,
    tasksForSelectedDate,
    carriedForwardTasks,
    statsForSelectedDate,
    carryForwardNotice,
    dismissCarryForwardNotice
  } = useTasks()

  // Local Filter & Modal States
  const [activeFilter, setActiveFilter] = useState('All')
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [reschedulingTask, setReschedulingTask] = useState(null)
  const [partialTargetTask, setPartialTargetTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(null)
  const [feedbackToast, setFeedbackToast] = useState('')

  // Toast auto-clear
  const showToast = (message) => {
    setFeedbackToast(message)
    setTimeout(() => {
      setFeedbackToast('')
    }, 3500)
  }

  // Date Navigation Handlers
  const handlePrevDay = () => {
    setSelectedDate(shiftDateString(selectedDate, -1))
  }

  const handleNextDay = () => {
    setSelectedDate(shiftDateString(selectedDate, 1))
  }

  const handleJumpToToday = () => {
    setSelectedDate(getTodayDateString())
  }

  // Filtered tasks for the selected date
  const filteredTasks = useMemo(() => {
    return tasksForSelectedDate.filter((t) => {
      if (activeFilter === 'Completed') return t.status === 'Completed'
      if (activeFilter === 'Partially Completed') return t.status === 'Partially Completed'
      if (activeFilter === 'Pending') return t.status === 'Pending'
      return true
    })
  }, [tasksForSelectedDate, activeFilter])

  // Single Task Create / Edit Submission
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
      showToast(`Updated "${taskData.title}"`)
    } else {
      addTask(taskData)
      showToast(`Created task "${taskData.title}"`)
    }
    setEditingTask(null)
  }

  // Bulk Task Submission
  const handleSaveBulkTasks = ({ titles, scheduledDate, priority, category }) => {
    const created = addBulkTasks({ titles, scheduledDate, priority, category })
    showToast(`Successfully added ${created.length} tasks!`)
  }

  // Checkbox toggle: Completed <-> Pending
  const handleToggleComplete = (taskId) => {
    const target = tasks.find((t) => t.id === taskId)
    if (!target) return

    if (target.status === 'Completed') {
      setTaskStatus(taskId, 'Pending')
      showToast(`Reopened "${target.title}" as Pending`)
    } else {
      setTaskStatus(taskId, 'Completed')
      showToast(`Completed "${target.title}"!`)
    }
  }

  // Status dropdown change
  const handleStatusChange = (task, newStatus) => {
    if (newStatus === 'Partially Completed') {
      setPartialTargetTask(task)
    } else {
      setTaskStatus(task.id, newStatus)
      showToast(`Marked "${task.title}" as ${newStatus}`)
    }
  }

  // Save remaining work from PartialWorkModal
  const handleSavePartialWork = (taskId, remainingWork) => {
    setTaskStatus(taskId, 'Partially Completed', remainingWork)
    showToast('Saved remaining work details')
  }

  // Reschedule handler
  const handleRescheduleTask = (taskId, newDate) => {
    rescheduleTask(taskId, newDate)
    showToast('Task rescheduled and overdue counter updated!')
    setReschedulingTask(null)
  }

  // Confirm task deletion
  const handleConfirmDelete = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id)
      showToast(`Deleted "${deletingTask.title}"`)
      setDeletingTask(null)
    }
  }

  // Open modal for task creation
  const handleOpenCreateModal = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  // Open modal for task editing
  const handleOpenEditModal = (task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const isTodayActive = isToday(selectedDate)

  return (
    <div className="dashboard-content-wrapper">
      {/* Automatic Carry-Forward Notification Banner */}
      {carryForwardNotice && (
        <div className="carry-forward-alert-banner" role="alert">
          <div className="carry-forward-alert-content">
            <AlertTriangle size={17} className="carry-forward-alert-icon" />
            <div className="carry-forward-alert-text">
              <strong>Automatic Carry-Forward:</strong> {carryForwardNotice}
            </div>
            <Link to="/overdue" className="carry-forward-alert-link">
              <span>View Overdue</span>
              <ArrowRight size={13} />
            </Link>
          </div>
          <button
            type="button"
            className="alert-dismiss-btn"
            onClick={dismissCarryForwardNotice}
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Real-time Feedback Toast */}
      {feedbackToast && (
        <div className="feedback-toast" role="status">
          <CheckCircle2 size={16} className="toast-icon" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Date Navigation & Inspection Bar */}
      <section className="date-nav-toolbar" aria-label="Date selector">
        <div className="date-nav-controls">
          <button
            type="button"
            className="date-nav-btn"
            onClick={handlePrevDay}
            title="Previous Day"
            aria-label="Previous Day"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="date-picker-container">
            <CalendarDays size={18} className="date-picker-icon" />
            <input
              type="date"
              className="date-picker-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Select date"
            />
          </div>

          <button
            type="button"
            className="date-nav-btn"
            onClick={handleNextDay}
            title="Next Day"
            aria-label="Next Day"
          >
            <ChevronRight size={18} />
          </button>

          {!isTodayActive && (
            <button
              type="button"
              className="jump-today-btn"
              onClick={handleJumpToToday}
            >
              Jump to Today
            </button>
          )}
        </div>

        <div className="date-display-info">
          <span className="date-active-label">
            {isTodayActive ? 'Today: ' : 'Inspecting: '}
            <strong>{formatDateForDisplay(selectedDate)}</strong>
          </span>
          <span className="date-task-count-pill">
            {statsForSelectedDate.total} {statsForSelectedDate.total === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </section>

      {/* 1. Dynamic Summary Cards Section */}
      <section className="dashboard-section summary-grid-section" aria-label="Task Summary">
        <SummaryCard
          label="Total Tasks"
          value={statsForSelectedDate.total}
          icon={ListTodo}
          variant="total"
          subtext={`Scheduled for ${formatShortDate(selectedDate)}`}
        />
        <SummaryCard
          label="Completed"
          value={statsForSelectedDate.completed}
          icon={CheckCircle2}
          variant="completed"
          subtext={`${statsForSelectedDate.completionPercentage}% completion rate`}
        />
        <SummaryCard
          label="Partially Completed"
          value={statsForSelectedDate.partiallyCompleted}
          icon={Clock3}
          variant="partial"
          subtext={statsForSelectedDate.partiallyCompleted > 0 ? 'Work in progress' : 'None in progress'}
        />
        <SummaryCard
          label="Pending"
          value={statsForSelectedDate.pending}
          icon={CircleDashed}
          variant="pending"
          subtext={statsForSelectedDate.pending > 0 ? 'Awaiting action' : 'All clear'}
        />
      </section>

      {/* 2. Main Dashboard Layout (Two Columns) */}
      <div className="dashboard-main-grid">
        {/* Left Column: Tasks & Carried Forward */}
        <div className="dashboard-primary-column">
          {/* Today's Tasks Section */}
          <section className="dashboard-card today-tasks-card">
            <div className="card-header-row">
              <div className="card-title-block">
                <div className="card-icon-tag">
                  <ListTodo size={20} />
                </div>
                <div>
                  <h3 className="section-title">
                    {isTodayActive ? "Today's Tasks" : `Tasks for ${formatShortDate(selectedDate)}`}
                  </h3>
                  <p className="section-description">
                    Daily checklist &bull; Check to mark complete &bull; Use menu to change status
                  </p>
                </div>
              </div>

              <div className="card-header-actions">
                <button
                  type="button"
                  className="bulk-action-btn"
                  onClick={() => setIsBulkModalOpen(true)}
                  title="Bulk add tasks from text"
                >
                  <ListPlus size={16} />
                  <span>Bulk Add</span>
                </button>

                <button
                  type="button"
                  className="add-task-btn"
                  onClick={handleOpenCreateModal}
                  title="Add single task"
                >
                  <Plus size={16} />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="filter-bar">
              <span className="filter-label">
                <Filter size={13} /> Filter:
              </span>
              {[
                { label: 'All', count: statsForSelectedDate.total },
                { label: 'Pending', count: statsForSelectedDate.pending },
                { label: 'Partially Completed', count: statsForSelectedDate.partiallyCompleted },
                { label: 'Completed', count: statsForSelectedDate.completed }
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

            {/* Task Cards List */}
            <div className="task-list-container">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onStatusChange={handleStatusChange}
                    onEdit={handleOpenEditModal}
                    onDelete={(t) => setDeletingTask(t)}
                  />
                ))
              ) : (
                <div className="empty-tasks-container">
                  <div className="empty-icon-circle">
                    <ListTodo size={32} />
                  </div>
                  <h4 className="empty-tasks-title">
                    {activeFilter === 'All'
                      ? `No tasks scheduled for ${formatShortDate(selectedDate)}`
                      : `No tasks found in "${activeFilter}"`}
                  </h4>
                  <p className="empty-tasks-desc">
                    {activeFilter === 'All'
                      ? 'Add an individual task or use bulk import to populate this day.'
                      : 'Try selecting a different filter above.'}
                  </p>
                  {activeFilter === 'All' && (
                    <div className="empty-action-buttons">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleOpenCreateModal}
                      >
                        <Plus size={16} />
                        <span>Add Task</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setIsBulkModalOpen(true)}
                      >
                        <ListPlus size={16} />
                        <span>Bulk Import</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Carried Forward Tasks Section (Real Data from TaskContext) */}
          <section className="dashboard-card carried-forward-card-section">
            <div className="card-header-row">
              <div className="card-title-block">
                <div className="card-icon-tag icon-tag-danger">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div className="title-with-badge">
                    <h3 className="section-title">Carried Forward Tasks</h3>
                    {carriedForwardTasks.length > 0 ? (
                      <span className="count-pill pill-danger">
                        {carriedForwardTasks.length} Overdue
                      </span>
                    ) : (
                      <span className="count-pill pill-success">
                        All Clear
                      </span>
                    )}
                  </div>
                  <p className="section-description">
                    Unfinished items from previous days automatically rolled forward to today
                  </p>
                </div>
              </div>

              {carriedForwardTasks.length > 0 && (
                <Link to="/overdue" className="view-all-overdue-link">
                  <span>View All Overdue</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            <div className="carried-list-container">
              {carriedForwardTasks.length > 0 ? (
                carriedForwardTasks.map((task) => (
                  <CarriedForwardCard
                    key={task.id}
                    task={task}
                    onComplete={handleToggleComplete}
                    onEdit={handleOpenEditModal}
                    onReschedule={(t) => setReschedulingTask(t)}
                  />
                ))
              ) : (
                <div className="empty-carried-state">
                  <div className="empty-carried-icon">
                    <CheckCircle2 size={26} />
                  </div>
                  <div className="empty-carried-text">
                    <span className="empty-carried-heading">No carried-forward tasks!</span>
                    <span className="empty-carried-sub">
                      All tasks from previous days have been completed or rescheduled.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Widgets */}
        <aside className="dashboard-secondary-column">
          {/* Quick Actions Widget */}
          <QuickActions
            onAddTaskClick={handleOpenCreateModal}
            onBulkAddClick={() => setIsBulkModalOpen(true)}
          />

          {/* Daily Review Widget */}
          <DailyReviewCard />

          {/* Productivity Focus Widget */}
          <div className="focus-tip-card">
            <div className="tip-header">
              <Sparkles size={16} className="tip-icon" />
              <span className="tip-tag">Phase 4 Active</span>
            </div>
            <p className="tip-body">
              "Tasks left unfinished on past days automatically roll forward to today with full history preservation and local browser persistence."
            </p>
          </div>
        </aside>
      </div>

      {/* Modal Dialogs */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleSaveTask}
        task={editingTask}
        defaultDate={selectedDate}
      />

      <BulkTaskModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSubmit={handleSaveBulkTasks}
        defaultDate={selectedDate}
      />

      <PartialWorkModal
        isOpen={Boolean(partialTargetTask)}
        onClose={() => setPartialTargetTask(null)}
        task={partialTargetTask}
        onSave={handleSavePartialWork}
      />

      <RescheduleModal
        isOpen={Boolean(reschedulingTask)}
        onClose={() => setReschedulingTask(null)}
        task={reschedulingTask}
        onReschedule={handleRescheduleTask}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        taskTitle={deletingTask?.title}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
