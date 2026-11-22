import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react'
import {
  getTodayDateString,
  shiftDateString,
  isPastDate
} from '../utils/dateUtils'
import * as taskStorage from '../services/taskStorage'

const TaskContext = createContext(null)

// Initial demonstration seed tasks (used only when localStorage key is uninitialized)
const createInitialSeedTasks = () => {
  const today = getTodayDateString()
  const yesterday = shiftDateString(today, -1)
  const twoDaysAgo = shiftDateString(today, -2)
  const tomorrow = shiftDateString(today, 1)

  return [
    {
      id: 'task-seed-1',
      title: 'Complete Java Collections',
      description: 'Revise ArrayList, LinkedList, HashMap, and ConcurrentHashMap internal implementations.',
      scheduledDate: today,
      originalScheduledDate: today,
      carryForwardCount: 0,
      lastCarriedForwardDate: null,
      priority: 'High',
      category: 'Study',
      reminderTime: '09:30 AM',
      status: 'Completed',
      remainingWork: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-seed-2',
      title: 'Work on DisasterGuard dashboard',
      description: 'Wire incident stream data and build map preview container.',
      scheduledDate: today,
      originalScheduledDate: today,
      carryForwardCount: 0,
      lastCarriedForwardDate: null,
      priority: 'High',
      category: 'Project',
      reminderTime: '02:00 PM',
      status: 'Partially Completed',
      remainingWork: 'Complete incident stream mapping and test geo-fence triggers.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-seed-3',
      title: 'Pay electricity bill',
      description: 'Check consumer ID balance on payment portal before due date.',
      scheduledDate: today,
      originalScheduledDate: today,
      carryForwardCount: 0,
      lastCarriedForwardDate: null,
      priority: 'Medium',
      category: 'Personal',
      reminderTime: '05:00 PM',
      status: 'Pending',
      remainingWork: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-seed-4',
      title: 'Revise aptitude',
      description: 'Practice quantitative reasoning problems and speed tests.',
      scheduledDate: today,
      originalScheduledDate: today,
      carryForwardCount: 0,
      lastCarriedForwardDate: null,
      priority: 'Low',
      category: 'Career',
      reminderTime: '07:30 PM',
      status: 'Pending',
      remainingWork: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-seed-5',
      title: 'Review System Architecture document',
      description: 'Prepare notes for upcoming milestone review.',
      scheduledDate: tomorrow,
      originalScheduledDate: tomorrow,
      carryForwardCount: 0,
      lastCarriedForwardDate: null,
      priority: 'High',
      category: 'Project',
      reminderTime: '11:00 AM',
      status: 'Pending',
      remainingWork: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // Past unfinished tasks (demonstrating carry-forward on fresh initialization)
    {
      id: 'task-seed-cf-1',
      title: 'Complete Spring Boot Security module',
      description: 'JWT validation filter & role-based route guards left to implement.',
      scheduledDate: twoDaysAgo,
      originalScheduledDate: twoDaysAgo,
      carryForwardCount: 0,
      lastCarriedForwardDate: null,
      priority: 'High',
      category: 'Project',
      reminderTime: '03:30 PM',
      status: 'Partially Completed',
      remainingWork: 'JWT validation filter & role-based route guards left to implement.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-seed-cf-2',
      title: 'Database indexing optimization',
      description: 'Review slow query logs and add composite indexes for task filtering.',
      scheduledDate: yesterday,
      originalScheduledDate: yesterday,
      carryForwardCount: 0,
      lastCarriedForwardDate: null,
      priority: 'Medium',
      category: 'Study',
      reminderTime: '06:00 PM',
      status: 'Pending',
      remainingWork: 'Review slow query logs and add composite indexes for task filtering.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
}

/**
 * Idempotent automatic carry-forward runner.
 * Evaluates tasks against actual current local date.
 */
function processAutomaticCarryForward(existingTasks) {
  const today = getTodayDateString()
  let carriedCount = 0

  const processedTasks = existingTasks.map((task) => {
    // Check if task qualifies for carry forward:
    // 1. Scheduled before today
    // 2. Unfinished (Pending or Partially Completed)
    // 3. Not already carried forward today
    const isPast = isPastDate(task.scheduledDate, today)
    const isUnfinished = task.status === 'Pending' || task.status === 'Partially Completed'
    const notCarriedToday = task.lastCarriedForwardDate !== today

    if (isPast && isUnfinished && notCarriedToday) {
      carriedCount++
      const originalDate = task.originalScheduledDate || task.scheduledDate

      return {
        ...task,
        originalScheduledDate: originalDate,
        scheduledDate: today,
        carryForwardCount: (Number(task.carryForwardCount) || 0) + 1,
        lastCarriedForwardDate: today,
        updatedAt: new Date().toISOString()
      }
    }

    return task
  })

  return { processedTasks, carriedCount }
}

export function TaskProvider({ children }) {
  // Initialize tasks from storage or seed defaults
  const [tasks, setTasks] = useState(() => {
    const saved = taskStorage.getTasks()
    let initialList = []

    if (saved === null) {
      // First initialization: seed with demonstration tasks
      initialList = createInitialSeedTasks()
    } else {
      initialList = saved
    }

    // Run automatic carry forward on initial load
    const { processedTasks } = processAutomaticCarryForward(initialList)
    taskStorage.saveTasks(processedTasks)
    return processedTasks
  })

  const [selectedDate, setSelectedDate] = useState(getTodayDateString)
  const [carryForwardNotice, setCarryForwardNotice] = useState('')

  // Carry-forward notification on mount
  const hasNotifiedRef = useRef(false)
  useEffect(() => {
    if (hasNotifiedRef.current) return
    hasNotifiedRef.current = true

    const today = getTodayDateString()
    const lastNotifiedDate = taskStorage.getLastCarryForwardNotificationDate()

    // Count how many tasks are carried forward to today
    const carriedTodayCount = tasks.filter(
      (t) =>
        t.scheduledDate === today &&
        t.lastCarriedForwardDate === today &&
        t.carryForwardCount > 0 &&
        t.status !== 'Completed'
    ).length

    if (carriedTodayCount > 0 && lastNotifiedDate !== today) {
      setCarryForwardNotice(
        `${carriedTodayCount} unfinished ${carriedTodayCount === 1 ? 'task was' : 'tasks were'} automatically carried forward to today.`
      )
      taskStorage.setLastCarryForwardNotificationDate(today)
    }
  }, [tasks])

  // Sync tasks to localStorage whenever tasks state updates
  useEffect(() => {
    taskStorage.saveTasks(tasks)
  }, [tasks])

  // Add single task
  const addTask = (taskData) => {
    const schedDate = taskData.scheduledDate || selectedDate
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      title: taskData.title.trim(),
      description: (taskData.description || '').trim(),
      scheduledDate: schedDate,
      originalScheduledDate: taskData.originalScheduledDate || schedDate,
      carryForwardCount: 0,
      lastCarriedForwardDate: null,
      priority: taskData.priority || 'Medium',
      category: taskData.category || 'Personal',
      reminderTime: taskData.reminderTime || '',
      status: taskData.status || 'Pending',
      remainingWork: taskData.status === 'Partially Completed' ? (taskData.remainingWork || '').trim() : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTasks((prev) => [newTask, ...prev])
    return newTask
  }

  // Bulk add tasks
  const addBulkTasks = ({ titles, scheduledDate, priority, category }) => {
    const timestamp = new Date().toISOString()
    const targetDate = scheduledDate || selectedDate

    const newTasks = titles.map((title, index) => ({
      id: `task-bulk-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      description: '',
      scheduledDate: targetDate,
      originalScheduledDate: targetDate,
      carryForwardCount: 0,
      lastCarriedForwardDate: null,
      priority: priority || 'Medium',
      category: category || 'Personal',
      reminderTime: '',
      status: 'Pending',
      remainingWork: '',
      createdAt: timestamp,
      updatedAt: timestamp
    }))

    setTasks((prev) => [...newTasks, ...prev])
    return newTasks
  }

  // Edit task
  const updateTask = (taskId, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = updatedFields.status !== undefined ? updatedFields.status : t.status
          return {
            ...t,
            ...updatedFields,
            remainingWork:
              nextStatus === 'Partially Completed'
                ? updatedFields.remainingWork !== undefined
                  ? updatedFields.remainingWork.trim()
                  : t.remainingWork
                : '',
            updatedAt: new Date().toISOString()
          }
        }
        return t
      })
    )
  }

  // Reschedule task to a new target date (resets overdue carry-forward state)
  const rescheduleTask = (taskId, newDate) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            scheduledDate: newDate,
            originalScheduledDate: newDate, // Fresh schedule resets overdue duration
            carryForwardCount: 0,
            lastCarriedForwardDate: null,
            updatedAt: new Date().toISOString()
          }
        }
        return t
      })
    )
  }

  // Delete task
  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  // Explicit status change
  const setTaskStatus = (taskId, newStatus, remainingWork = '') => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            remainingWork: newStatus === 'Partially Completed' ? remainingWork.trim() : '',
            updatedAt: new Date().toISOString()
          }
        }
        return t
      })
    )
  }

  // Tasks for the active inspected date (in dashboard date toolbar)
  const tasksForSelectedDate = useMemo(() => {
    return tasks.filter((t) => t.scheduledDate === selectedDate)
  }, [tasks, selectedDate])

  // Active Carried-Forward (Overdue) Tasks:
  // Must be unfinished and have a recorded carryForwardCount > 0 from an earlier original date
  const carriedForwardTasks = useMemo(() => {
    return tasks.filter(
      (t) =>
        t.status !== 'Completed' &&
        Boolean(
          t.carryForwardCount > 0 &&
          t.originalScheduledDate &&
          t.originalScheduledDate < t.scheduledDate
        )
    )
  }, [tasks])

  // Statistics for selected date
  const statsForSelectedDate = useMemo(() => {
    const dateTasks = tasks.filter((t) => t.scheduledDate === selectedDate)
    const total = dateTasks.length
    const completed = dateTasks.filter((t) => t.status === 'Completed').length
    const partiallyCompleted = dateTasks.filter((t) => t.status === 'Partially Completed').length
    const pending = dateTasks.filter((t) => t.status === 'Pending').length
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      partiallyCompleted,
      pending,
      completionPercentage
    }
  }, [tasks, selectedDate])

  const dismissCarryForwardNotice = () => {
    setCarryForwardNotice('')
  }

  const value = {
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
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}
