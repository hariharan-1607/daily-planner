import { useState, useEffect, useMemo } from 'react'
import {
  ClipboardCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  CircleDashed,
  ListTodo,
  Save,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import {
  getTodayDateString,
  formatDateForDisplay,
  formatShortDate,
  shiftDateString,
  isToday
} from '../utils/dateUtils'
import * as dailyReviewStorage from '../services/dailyReviewStorage'
import { getDailyReflectionRule } from '../utils/reflectionRules'
import './DailyReviewPage.css'

export default function DailyReviewPage() {
  const { tasks } = useTasks()
  const todayStr = getTodayDateString()

  // Selected date for review
  const [selectedDate, setSelectedDate] = useState(todayStr)

  // Dynamic daily reflection rule for selected date
  const dailyRule = useMemo(() => getDailyReflectionRule(selectedDate), [selectedDate])

  // Reflection form state
  const [wentWell, setWentWell] = useState('')
  const [challenges, setChallenges] = useState('')
  const [improve, setImprove] = useState('')
  const [learned, setLearned] = useState('')
  const [prioritiesTomorrow, setPrioritiesTomorrow] = useState('')

  const [lastSavedTime, setLastSavedTime] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Load reflection whenever selectedDate changes
  useEffect(() => {
    const existing = dailyReviewStorage.getReview(selectedDate)
    if (existing) {
      setWentWell(existing.wentWell || '')
      setChallenges(existing.challenges || '')
      setImprove(existing.improve || '')
      setLearned(existing.learned || '')
      setPrioritiesTomorrow(existing.prioritiesTomorrow || '')
      setLastSavedTime(existing.updatedAt ? new Date(existing.updatedAt).toLocaleTimeString() : null)
    } else {
      setWentWell('')
      setChallenges('')
      setImprove('')
      setLearned('')
      setPrioritiesTomorrow('')
      setLastSavedTime(null)
    }
  }, [selectedDate])

  // Date Navigation Handlers
  const handlePrevDay = () => {
    setSelectedDate(shiftDateString(selectedDate, -1))
  }

  const handleNextDay = () => {
    setSelectedDate(shiftDateString(selectedDate, 1))
  }

  const handleJumpToToday = () => {
    setSelectedDate(todayStr)
  }

  // Calculate actual task performance statistics for selectedDate from TaskContext
  const dateTasks = useMemo(() => {
    return tasks.filter((t) => t.scheduledDate === selectedDate)
  }, [tasks, selectedDate])

  const stats = useMemo(() => {
    const total = dateTasks.length
    const completed = dateTasks.filter((t) => t.status === 'Completed').length
    const partial = dateTasks.filter((t) => t.status === 'Partially Completed').length
    const pending = dateTasks.filter((t) => t.status === 'Pending').length
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, partial, pending, completionPercentage }
  }, [dateTasks])

  // Save Reflection
  const handleSaveReflection = (e) => {
    e.preventDefault()

    const saved = dailyReviewStorage.saveReview(selectedDate, {
      wentWell,
      challenges,
      improve,
      learned,
      prioritiesTomorrow
    })

    if (saved) {
      setLastSavedTime(new Date(saved.updatedAt).toLocaleTimeString())
      showToast(`Daily reflection for ${formatShortDate(selectedDate)} saved!`)
    }
  }

  const isTodayActive = isToday(selectedDate)

  return (
    <div className="daily-review-page-container">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="feedback-toast" role="status">
          <CheckCircle2 size={16} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="review-header-banner">
        <div className="review-header-info">
          <div className="review-badge">
            <ClipboardCheck size={15} />
            <span>Daily Review &amp; Self-Reflection</span>
          </div>
          <h2 className="review-page-title">Daily Performance &amp; Reflection</h2>
          <p className="review-page-subtitle">
            Evaluate your productivity metrics, document key learnings, and set priorities for tomorrow.
          </p>
        </div>

        {/* Date Selector Toolbar */}
        <div className="review-date-toolbar">
          <button
            type="button"
            className="rev-date-btn"
            onClick={handlePrevDay}
            title="Previous Day"
            aria-label="Previous Day"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="rev-date-picker-wrap">
            <CalendarDays size={16} className="rev-date-icon" />
            <input
              type="date"
              className="rev-date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Select review date"
            />
          </div>

          <button
            type="button"
            className="rev-date-btn"
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
              Today
            </button>
          )}
        </div>
      </div>

      {/* Section A: Daily Performance Summary */}
      <div className="performance-summary-card">
        <div className="perf-header">
          <div>
            <h3 className="perf-title">Performance Summary for {formatDateForDisplay(selectedDate)}</h3>
            <span className="perf-subtitle">
              Calculated dynamically from {stats.total} scheduled {stats.total === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <div className="perf-score-badge">
            <TrendingUp size={16} />
            <span>Score: {stats.completionPercentage}%</span>
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="score-progress-container">
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="perf-metrics-grid">
          <div className="perf-stat-box">
            <span className="perf-stat-label">Total Planned</span>
            <span className="perf-stat-value">{stats.total}</span>
            <span className="perf-stat-desc">Scheduled for this date</span>
          </div>

          <div className="perf-stat-box stat-box-completed">
            <span className="perf-stat-label">
              <CheckCircle2 size={13} /> Completed
            </span>
            <span className="perf-stat-value">{stats.completed}</span>
            <span className="perf-stat-desc">
              {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% accomplished` : '0%'}
            </span>
          </div>

          <div className="perf-stat-box stat-box-partial">
            <span className="perf-stat-label">
              <Clock3 size={13} /> Partially Completed
            </span>
            <span className="perf-stat-value">{stats.partial}</span>
            <span className="perf-stat-desc">Work in progress</span>
          </div>

          <div className="perf-stat-box stat-box-pending">
            <span className="perf-stat-label">
              <CircleDashed size={13} /> Pending
            </span>
            <span className="perf-stat-value">{stats.pending}</span>
            <span className="perf-stat-desc">Awaiting completion</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column: Reflection Form (Left) & Task Reference Breakdown (Right) */}
      <div className="review-main-grid">
        {/* Section B: Daily Reflection Form */}
        <div className="reflection-form-card">
          <div className="reflection-card-header">
            <div>
              <h3 className="reflection-section-title">Daily Reflection</h3>
              <p className="reflection-section-desc">
                Record honest observations to strengthen focus and continuous improvement.
              </p>
            </div>

            {lastSavedTime && (
              <span className="last-saved-badge">
                <CheckCircle2 size={13} />
                <span>Saved at {lastSavedTime}</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveReflection} className="reflection-form">
            {/* 1. What went well today? */}
            <div className="form-group">
              <label htmlFor="rev-went-well" className="reflection-field-label">
                <span className="field-num">1</span> What went well today?
              </label>
              <textarea
                id="rev-went-well"
                className="reflection-textarea"
                rows={3}
                placeholder="Key accomplishments, focused work blocks, habits maintained, milestones achieved..."
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value)}
              />
            </div>

            {/* 2. What challenges did I face? */}
            <div className="form-group">
              <label htmlFor="rev-challenges" className="reflection-field-label">
                <span className="field-num">2</span> What challenges did I face?
              </label>
              <textarea
                id="rev-challenges"
                className="reflection-textarea"
                rows={3}
                placeholder="Distractions, unexpected blockers, technical difficulties, energy dips..."
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
              />
            </div>

            {/* 3. What could I improve? */}
            <div className="form-group">
              <label htmlFor="rev-improve" className="reflection-field-label">
                <span className="field-num">3</span> What could I improve?
              </label>
              <textarea
                id="rev-improve"
                className="reflection-textarea"
                rows={3}
                placeholder="Time blocking adjustments, starting high priority items earlier, batching notifications..."
                value={improve}
                onChange={(e) => setImprove(e.target.value)}
              />
            </div>

            {/* 4. What did I learn today? */}
            <div className="form-group">
              <label htmlFor="rev-learned" className="reflection-field-label">
                <span className="field-num">4</span> What did I learn today?
              </label>
              <textarea
                id="rev-learned"
                className="reflection-textarea"
                rows={3}
                placeholder="New technical insights, productivity realizations, problem-solving breakthroughs..."
                value={learned}
                onChange={(e) => setLearned(e.target.value)}
              />
            </div>

            {/* 5. What are my priorities for tomorrow? */}
            <div className="form-group">
              <label htmlFor="rev-priorities" className="reflection-field-label">
                <span className="field-num">5</span> What are my priorities for tomorrow?
              </label>
              <textarea
                id="rev-priorities"
                className="reflection-textarea"
                rows={3}
                placeholder="Top 3 essential focus tasks, follow-ups, appointments to tackle next..."
                value={prioritiesTomorrow}
                onChange={(e) => setPrioritiesTomorrow(e.target.value)}
              />
            </div>

            {/* Save Action */}
            <div className="reflection-actions-bar">
              <span className="reflection-save-hint">
                Reflections are securely saved in browser storage for {formatShortDate(selectedDate)}.
              </span>
              <button type="submit" className="btn btn-primary save-reflection-btn">
                <Save size={16} />
                <span>Save Daily Reflection</span>
              </button>
            </div>
          </form>
        </div>

        {/* Task Reference Sidebar: Shows tasks for this date */}
        <aside className="review-sidebar-panel">
          <div className="review-task-reference-card">
            <div className="task-ref-header">
              <div className="task-ref-title-block">
                <ListTodo size={18} className="text-purple" />
                <h4 className="task-ref-title">Tasks on {formatShortDate(selectedDate)}</h4>
              </div>
              <span className="task-ref-count">{dateTasks.length} total</span>
            </div>

            <div className="task-ref-list">
              {dateTasks.length > 0 ? (
                dateTasks.map((task) => (
                  <div key={task.id} className="task-ref-item">
                    <div className="task-ref-row">
                      <span className={`task-ref-status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {task.status === 'Completed' ? 'Done' : task.status === 'Partially Completed' ? 'Partial' : 'Pending'}
                      </span>
                      <span className={`task-ref-name ${task.status === 'Completed' ? 'ref-name-done' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                    {task.status === 'Partially Completed' && task.remainingWork && (
                      <span className="task-ref-rem">
                        Remaining: {task.remainingWork}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="task-ref-empty">
                  <p>No tasks were scheduled for {formatShortDate(selectedDate)}.</p>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Daily Reflection Rule Card */}
          <div className="mindset-tip-card">
            <div className="tip-header">
              <div className="tip-header-left">
                <Sparkles size={16} className="tip-icon" />
                <span className="tip-tag">Reflection Rule</span>
              </div>
              <span className="tip-category-pill">{dailyRule.category}</span>
            </div>
            <p className="tip-body">
              &ldquo;{dailyRule.rule}&rdquo;
            </p>
            <span className="tip-author">&mdash; {dailyRule.author}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
