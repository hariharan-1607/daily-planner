/**
 * LocalStorage Persistence Service for Daily Planner Tasks
 * Isolated storage access with graceful error handling and fallbacks.
 */

const STORAGE_KEY = 'dailyPlanner.tasks.v1'
const NOTIFICATION_KEY = 'dailyPlanner.lastCarryForwardNotificationDate.v1'

// In-memory fallback if localStorage is unavailable
let memoryStore = null

function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Retrieve saved tasks from localStorage.
 * Returns null if the storage key is completely uninitialized.
 * Returns Array (even if empty []) if key was explicitly saved.
 */
export function getTasks() {
  if (!isLocalStorageAvailable()) {
    return memoryStore
  }

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY)
    if (rawData === null) {
      return null // Uninitialized storage
    }

    const parsed = JSON.parse(rawData)
    if (Array.isArray(parsed)) {
      return parsed
    }
    console.warn('[taskStorage] Invalid data format in localStorage; resetting to empty array.')
    return []
  } catch (err) {
    console.error('[taskStorage] Failed to read from localStorage:', err)
    return memoryStore !== null ? memoryStore : null
  }
}

/**
 * Save tasks array to localStorage.
 */
export function saveTasks(tasks) {
  if (!Array.isArray(tasks)) {
    console.error('[taskStorage] saveTasks expected an array, got:', typeof tasks)
    return false
  }

  memoryStore = tasks

  if (!isLocalStorageAvailable()) {
    return true
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch (err) {
    console.error('[taskStorage] Failed to save tasks to localStorage:', err)
    return false
  }
}

/**
 * Clear all tasks from storage.
 */
export function clearTasks() {
  memoryStore = null
  if (!isLocalStorageAvailable()) return

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('[taskStorage] Failed to clear localStorage:', err)
  }
}

/**
 * Notification tracking to avoid duplicate notifications on the same day.
 */
export function getLastCarryForwardNotificationDate() {
  if (!isLocalStorageAvailable()) return null
  try {
    return window.localStorage.getItem(NOTIFICATION_KEY)
  } catch (e) {
    return null
  }
}

export function setLastCarryForwardNotificationDate(dateStr) {
  if (!isLocalStorageAvailable()) return
  try {
    window.localStorage.setItem(NOTIFICATION_KEY, dateStr)
  } catch (e) {
    // ignore
  }
}
