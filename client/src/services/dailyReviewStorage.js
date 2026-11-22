/**
 * LocalStorage Persistence Service for Daily Planner Daily Reviews
 * Stores date-keyed reflections with isolated error handling and fallback.
 */

const STORAGE_KEY = 'dailyPlanner.reviews.v1'

// In-memory fallback if localStorage is disabled or unavailable
let memoryReviews = {}

function isLocalStorageAvailable() {
  try {
    const testKey = '__review_storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Retrieve all reviews dictionary from localStorage.
 * Format: { "YYYY-MM-DD": { wentWell, challenges, improve, learned, prioritiesTomorrow, updatedAt } }
 */
export function getAllReviews() {
  if (!isLocalStorageAvailable()) {
    return memoryReviews
  }

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY)
    if (!rawData) {
      return {}
    }
    const parsed = JSON.parse(rawData)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch (err) {
    console.error('[dailyReviewStorage] Failed to read reviews:', err)
    return memoryReviews
  }
}

/**
 * Get reflection for a specific date.
 * Returns null if no review was recorded for this date.
 */
export function getReview(dateStr) {
  if (!dateStr) return null
  const all = getAllReviews()
  return all[dateStr] || null
}

/**
 * Save or update reflection for a specific date.
 */
export function saveReview(dateStr, reviewData) {
  if (!dateStr) return null

  const all = getAllReviews()
  const updatedRecord = {
    wentWell: (reviewData.wentWell || '').trim(),
    challenges: (reviewData.challenges || '').trim(),
    improve: (reviewData.improve || '').trim(),
    learned: (reviewData.learned || '').trim(),
    prioritiesTomorrow: (reviewData.prioritiesTomorrow || '').trim(),
    updatedAt: new Date().toISOString()
  }

  all[dateStr] = updatedRecord
  memoryReviews = all

  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    } catch (err) {
      console.error('[dailyReviewStorage] Failed to save review:', err)
    }
  }

  return updatedRecord
}

/**
 * Delete reflection for a specific date.
 */
export function deleteReview(dateStr) {
  if (!dateStr) return
  const all = getAllReviews()
  delete all[dateStr]
  memoryReviews = all

  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    } catch (err) {
      console.error('[dailyReviewStorage] Failed to delete review:', err)
    }
  }
}
