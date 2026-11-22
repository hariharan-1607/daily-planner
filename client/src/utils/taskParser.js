/**
 * Parser utility for bulk task input
 * Supports numbered lines ("1. Task", "1) Task", "[1] Task", "(1) Task")
 * and bullet points ("- Task", "* Task", "• Task", "+ Task")
 */
export function parseBulkTasks(rawText) {
  if (!rawText || typeof rawText !== 'string') return []

  const lines = rawText.split(/\r?\n/)
  const extracted = []

  // Regex matches:
  // - Numbered lists: 1. , 1) , (1) , [1] 
  // - Bullet points: - , * , • , + 
  const prefixPattern = /^(\s*(\d+[\.\)]|\[\d+\]|\(\d+\)|[-*•+])\s*)+/

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Remove leading list markers and trim
    const cleaned = trimmed.replace(prefixPattern, '').trim()

    if (cleaned.length > 0) {
      extracted.push(cleaned)
    }
  }

  return extracted
}
