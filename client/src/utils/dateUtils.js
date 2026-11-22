/**
 * Date utility functions for timezone-safe date management
 */

// Format current local date as YYYY-MM-DD
export function getTodayDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Convert YYYY-MM-DD to a human-friendly format (e.g. "Sunday, Nov 22, 2026")
export function formatDateForDisplay(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

// Short format for headers and badges (e.g. "Sun, Nov 22")
export function formatShortDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Check if a YYYY-MM-DD string is today
export function isToday(dateStr) {
  return dateStr === getTodayDateString()
}

// Check if a date is strictly earlier than a reference date (default: today)
export function isPastDate(dateStr, referenceDate = getTodayDateString()) {
  if (!dateStr || !referenceDate) return false
  return dateStr < referenceDate
}

// Calculate the difference in calendar days between two YYYY-MM-DD dates
export function calculateDaysOverdue(originalDateStr, currentDateStr = getTodayDateString()) {
  if (!originalDateStr || !currentDateStr) return 0
  const [oy, om, od] = originalDateStr.split('-').map(Number)
  const [cy, cm, cd] = currentDateStr.split('-').map(Number)
  const orig = new Date(oy, om - 1, od)
  const curr = new Date(cy, cm - 1, cd)
  const diffMs = curr.getTime() - orig.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

// Format overdue badge string
export function formatOverdueBadge(days) {
  if (days <= 0) return 'Due today'
  return days === 1 ? '1 day overdue' : `${days} days overdue`
}

// Add or subtract days from a YYYY-MM-DD string
export function shiftDateString(dateStr, days) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Validate YYYY-MM-DD format
export function isValidDateString(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false
  const match = dateStr.match(/^\d{4}-\d{2}-\d{2}$/)
  if (!match) return false
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
}
