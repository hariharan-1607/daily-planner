import { useState, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock3,
  CircleDashed,
  ListTodo,
  CalendarDays,
  Sparkles
} from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import {
  getTodayDateString,
  formatDateForDisplay,
  formatShortDate,
  formatMonthYear,
  getCalendarGridForMonth,
  isToday
} from '../utils/dateUtils'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import PartialWorkModal from '../components/PartialWorkModal'
import RescheduleModal from '../components/RescheduleModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import './CalendarPage.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarPage() {
  const {
    tasks,
    addTask,
    updateTask,
    rescheduleTask,
    deleteTask,
    setTaskStatus
  } = useTasks()

  const todayStr = getTodayDateString()
  const [todayYear, todayMonth] = todayStr.split('-').map(Number)

  // Current viewed month and year
  const [currentYear, setCurrentYear] = useState(todayYear)
  const [currentMonth, setCurrentMonth] = useState(todayMonth) // 1-12

  // Currently selected date for the side details panel
  const [selectedDate, setSelectedDate] = useState(todayStr)

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [reschedulingTask, setReschedulingTask] = useState(null)
  const [partialTargetTask, setPartialTargetTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Month Navigation
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const handleJumpToToday = () => {
    setCurrentYear(todayYear)
    setCurrentMonth(todayMonth)
    setSelectedDate(todayStr)
  }

  // Generate calendar grid days for current month
  const calendarDays = useMemo(() => {
    return getCalendarGridForMonth(currentYear, currentMonth)
  }, [currentYear, currentMonth])

  // Map tasks by scheduledDate for fast cell lookup
  const tasksByDate = useMemo(() => {
    const map = {}
    for (const task of tasks) {
      const date = task.scheduledDate
      if (!map[date]) {
        map[date] = {
          total: 0,
          completed: 0,
          partial: 0,
          pending: 0,
          tasks: []
        }
      }
      map[date].total++
      if (task.status === 'Completed') map[date].completed++
      else if (task.status === 'Partially Completed') map[date].partial++
      else map[date].pending++

      map[date].tasks.push(task)
    }
    return map
  }, [tasks])

  // Tasks for the currently selected date
  const selectedDateTasks = useMemo(() => {
    return tasks.filter((t) => t.scheduledDate === selectedDate)
  }, [tasks, selectedDate])

  const selectedDateStats = useMemo(() => {
    const total = selectedDateTasks.length
    const completed = selectedDateTasks.filter((t) => t.status === 'Completed').length
    const partial = selectedDateTasks.filter((t) => t.status === 'Partially Completed').length
    const pending = selectedDateTasks.filter((t) => t.status === 'Pending').length
    return { total, completed, partial, pending }
  }, [selectedDateTasks])

  // Task Actions
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

  const handleStatusChange = (task, newStatus) => {
    if (newStatus === 'Partially Completed') {
      setPartialTargetTask(task)
    } else {
      setTaskStatus(task.id, newStatus)
      showToast(`Marked "${task.title}" as ${newStatus}`)
    }
  }

  const handleSavePartialWork = (taskId, remainingWork) => {
    setTaskStatus(taskId, 'Partially Completed', remainingWork)
    showToast('Saved remaining work')
  }

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
      showToast(`Updated "${taskData.title}"`)
    } else {
      addTask({ ...taskData, scheduledDate: selectedDate })
      showToast(`Created task for ${formatShortDate(selectedDate)}`)
    }
    setEditingTask(null)
  }

  const handleReschedule = (taskId, newDate) => {
    rescheduleTask(taskId, newDate)
    showToast('Task rescheduled to new date')
    setReschedulingTask(null)
  }

  const handleConfirmDelete = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id)
      showToast(`Deleted "${deletingTask.title}"`)
      setDeletingTask(null)
    }
  }

  return (
    <div className="calendar-page-container">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="feedback-toast" role="status">
          <CheckCircle2 size={16} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="calendar-header-banner">
        <div className="calendar-header-info">
          <div className="calendar-badge">
            <CalendarIcon size={15} />
            <span>Schedule &amp; Month Overview</span>
          </div>
          <h2 className="calendar-page-title">Monthly Planner Calendar</h2>
          <p className="calendar-page-subtitle">
            Inspect scheduled deadlines, visual task indicators, and plan tasks for any date.
          </p>
        </div>

        {/* Month Navigation Toolbar */}
        <div className="calendar-month-controls">
          <button
            type="button"
            className="cal-nav-btn"
            onClick={handlePrevMonth}
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="current-month-heading">
            {formatMonthYear(currentYear, currentMonth)}
          </span>

          <button
            type="button"
            className="cal-nav-btn"
            onClick={handleNextMonth}
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRight size={18} />
          </button>

          <button
            type="button"
            className="jump-today-btn"
            onClick={handleJumpToToday}
          >
            Today
          </button>
        </div>
      </div>

      {/* Main 2-Column Content: Calendar Grid + Selected Date Tasks */}
      <div className="calendar-main-layout">
        {/* Left Column: Monthly Grid Card */}
        <div className="calendar-grid-card">
          {/* Weekday Labels Header */}
          <div className="weekday-header-row">
            {WEEKDAYS.map((day) => (
              <div key={day} className="weekday-cell">
                {day}
              </div>
            ))}
          </div>

          {/* 35 or 42 Days Grid */}
          <div className="calendar-cells-grid">
            {calendarDays.map((cell) => {
              const dateInfo = tasksByDate[cell.dateString]
              const hasTasks = Boolean(dateInfo && dateInfo.total > 0)
              const isCellSelected = cell.dateString === selectedDate

              return (
                <button
                  key={cell.dateString}
                  type="button"
                  className={`calendar-day-cell ${
                    !cell.isCurrentMonth ? 'cell-outside-month' : ''
                  } ${cell.isToday ? 'cell-is-today' : ''} ${
                    isCellSelected ? 'cell-is-selected' : ''
                  }`}
                  onClick={() => setSelectedDate(cell.dateString)}
                >
                  <div className="cell-top-row">
                    <span className="cell-day-number">{cell.dayNumber}</span>
                    {cell.isToday && <span className="today-chip">Today</span>}
                    {hasTasks && (
                      <span className="cell-total-badge">
                        {dateInfo.total}
                      </span>
                    )}
                  </div>

                  {/* Task Status Indicator Dots */}
                  {hasTasks ? (
                    <div className="cell-status-indicators">
                      {dateInfo.completed > 0 && (
                        <span
                          className="status-dot dot-completed"
                          title={`${dateInfo.completed} Completed`}
                        />
                      )}
                      {dateInfo.partial > 0 && (
                        <span
                          className="status-dot dot-partial"
                          title={`${dateInfo.partial} Partially Completed`}
                        />
                      )}
                      {dateInfo.pending > 0 && (
                        <span
                          className="status-dot dot-pending"
                          title={`${dateInfo.pending} Pending`}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="cell-empty-spacer" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="calendar-legend-bar">
            <span className="legend-label">Indicators:</span>
            <div className="legend-item">
              <span className="status-dot dot-completed" />
              <span>Completed</span>
            </div>
            <div className="legend-item">
              <span className="status-dot dot-partial" />
              <span>Partial</span>
            </div>
            <div className="legend-item">
              <span className="status-dot dot-pending" />
              <span>Pending</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Date Task Details Panel */}
        <div className="calendar-details-panel">
          <div className="details-header-card">
            <div className="details-date-title-block">
              <div className="date-box-icon">
                <CalendarDays size={20} />
              </div>
              <div>
                <h3 className="details-date-title">
                  {formatDateForDisplay(selectedDate)}
                </h3>
                <span className="details-date-subtitle">
                  {isToday(selectedDate) ? 'Today' : formatShortDate(selectedDate)} &bull;{' '}
                  {selectedDateStats.total} {selectedDateStats.total === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary add-date-task-btn"
              onClick={() => {
                setEditingTask(null)
                setIsTaskModalOpen(true)
              }}
            >
              <Plus size={15} />
              <span>Add Task</span>
            </button>
          </div>

          {/* Mini Status Breakdown for Selected Date */}
          <div className="date-metrics-bar">
            <div className="mini-stat">
              <span className="mini-stat-label">Total</span>
              <span className="mini-stat-val">{selectedDateStats.total}</span>
            </div>
            <div className="mini-stat mini-stat-completed">
              <span className="mini-stat-label">Done</span>
              <span className="mini-stat-val">{selectedDateStats.completed}</span>
            </div>
            <div className="mini-stat mini-stat-partial">
              <span className="mini-stat-label">Partial</span>
              <span className="mini-stat-val">{selectedDateStats.partial}</span>
            </div>
            <div className="mini-stat mini-stat-pending">
              <span className="mini-stat-label">Pending</span>
              <span className="mini-stat-val">{selectedDateStats.pending}</span>
            </div>
          </div>

          {/* Task List for Selected Date */}
          <div className="selected-date-tasks-list">
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onStatusChange={handleStatusChange}
                  onEdit={(t) => {
                    setEditingTask(t)
                    setIsTaskModalOpen(true)
                  }}
                  onDelete={(t) => setDeletingTask(t)}
                />
              ))
            ) : (
              <div className="date-empty-state">
                <div className="empty-date-icon-circle">
                  <ListTodo size={32} />
                </div>
                <h4 className="empty-date-title">No tasks scheduled</h4>
                <p className="empty-date-text">
                  There are no tasks planned for {formatShortDate(selectedDate)}.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary mt-1"
                  onClick={() => {
                    setEditingTask(null)
                    setIsTaskModalOpen(true)
                  }}
                >
                  <Plus size={15} />
                  <span>Create Task for this Day</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal (Create / Edit) */}
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

      {/* Partial Work Description Modal */}
      <PartialWorkModal
        isOpen={Boolean(partialTargetTask)}
        onClose={() => setPartialTargetTask(null)}
        task={partialTargetTask}
        onSave={handleSavePartialWork}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={Boolean(reschedulingTask)}
        onClose={() => setReschedulingTask(null)}
        task={reschedulingTask}
        onReschedule={handleReschedule}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        taskTitle={deletingTask?.title}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
