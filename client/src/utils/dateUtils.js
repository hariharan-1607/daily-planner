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

// Month & Year header format (e.g. "November 2026")
export function formatMonthYear(year, month) {
  const date = new Date(year, month - 1, 1)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
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

/**
 * Generate calendar grid cells for a given month (1-based, 1 = Jan, 12 = Dec).
 * Returns an array of day objects for a 7-column grid with padding days from
 * previous and next months.
 */
export function getCalendarGridForMonth(year, month) {
  const todayStr = getTodayDateString()

  // First day of current month
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const firstDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 6 = Saturday

  // Total days in current month
  const daysInCurrentMonth = new Date(year, month, 0).getDate()

  // Total days in previous month
  const prevMonthDate = new Date(year, month - 1, 0)
  const daysInPrevMonth = prevMonthDate.getDate()
  const prevMonthYear = prevMonthDate.getFullYear()
  const prevMonthNum = prevMonthDate.getMonth() + 1

  // Next month info
  const nextMonthNum = month === 12 ? 1 : month + 1
  const nextMonthYear = month === 12 ? year + 1 : year

  const days = []

  // 1. Pad days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i
    const mm = String(prevMonthNum).padStart(2, '0')
    const dd = String(dayNum).padStart(2, '0')
    const dateStr = `${prevMonthYear}-${mm}-${dd}`
    days.push({
      dateString: dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr
    })
  }

  // 2. Days of current month
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const mm = String(month).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    const dateStr = `${year}-${mm}-${dd}`
    days.push({
      dateString: dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr
    })
  }

  // 3. Pad days from next month to complete the row / grid (multiples of 7, 35 or 42 cells)
  const remainingCells = (7 - (days.length % 7)) % 7
  const totalTargetCells = days.length + remainingCells < 35 ? 35 : days.length + remainingCells

  let nextDayCounter = 1
  while (days.length < totalTargetCells) {
    const mm = String(nextMonthNum).padStart(2, '0')
    const dd = String(nextDayCounter).padStart(2, '0')
    const dateStr = `${nextMonthYear}-${mm}-${dd}`
    days.push({
      dateString: dateStr,
      dayNumber: nextDayCounter,
      isCurrentMonth: false,
      isToday: dateStr === todayStr
    })
    nextDayCounter++
  }

  return days
}
