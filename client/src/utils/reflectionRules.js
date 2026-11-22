/**
 * Daily Planner - Reflection Rules Collection & Deterministic Selection
 *
 * Provides a curated collection of reflection rules, principles, and quotes
 * across 8 productivity categories.
 *
 * Selection is strictly deterministic based on calendar date (YYYY-MM-DD),
 * ensuring consistent historical retrieval, zero external API dependencies,
 * and different rules on consecutive days.
 */

export const REFLECTION_RULES = [
  // 1. Discipline and consistency
  {
    id: 1,
    category: 'Discipline and consistency',
    rule: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Will Durant'
  },
  // 2. Time management
  {
    id: 2,
    category: 'Time management',
    rule: 'Time is what we want most, but what we use worst.',
    author: 'William Penn'
  },
  // 3. Learning and improvement
  {
    id: 3,
    category: 'Learning and improvement',
    rule: 'We do not learn from experience... we learn from reflecting on experience.',
    author: 'John Dewey'
  },
  // 4. Focus and productivity
  {
    id: 4,
    category: 'Focus and productivity',
    rule: 'Simplicity boils down to two steps: Identify the essential. Eliminate the rest.',
    author: 'Leo Babauta'
  },
  // 5. Self-awareness
  {
    id: 5,
    category: 'Self-awareness',
    rule: 'Knowing yourself is the beginning of all wisdom.',
    author: 'Aristotle'
  },
  // 6. Goal setting
  {
    id: 6,
    category: 'Goal setting',
    rule: 'A goal without a plan is just a wish.',
    author: 'Antoine de Saint-Exupéry'
  },
  // 7. Problem-solving
  {
    id: 7,
    category: 'Problem-solving',
    rule: "If I had an hour to solve a problem, I'd spend 55 minutes thinking about the problem and 5 minutes about solutions.",
    author: 'Albert Einstein'
  },
  // 8. Patience and persistence
  {
    id: 8,
    category: 'Patience and persistence',
    rule: 'Patience is not simply the ability to wait—it is how we behave while we are waiting.',
    author: 'Joyce Meyer'
  },
  // 9. Discipline and consistency
  {
    id: 9,
    category: 'Discipline and consistency',
    rule: 'Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.',
    author: 'John C. Maxwell'
  },
  // 10. Time management
  {
    id: 10,
    category: 'Time management',
    rule: 'You do not manage time; you manage your energy, your attention, and your chosen priorities.',
    author: 'Daily Principle'
  },
  // 11. Learning and improvement
  {
    id: 11,
    category: 'Learning and improvement',
    rule: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
    author: 'Mahatma Gandhi'
  },
  // 12. Focus and productivity
  {
    id: 12,
    category: 'Focus and productivity',
    rule: 'The shorter way to do many things is to only do one thing at a time.',
    author: 'Wolfgang Amadeus Mozart'
  },
  // 13. Self-awareness
  {
    id: 13,
    category: 'Self-awareness',
    rule: 'Until you make the unconscious conscious, it will direct your life and you will call it fate.',
    author: 'Carl Jung'
  },
  // 14. Goal setting
  {
    id: 14,
    category: 'Goal setting',
    rule: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: 'Stephen Covey'
  },
  // 15. Problem-solving
  {
    id: 15,
    category: 'Problem-solving',
    rule: 'Focus on solutions rather than dwelling on obstacles. Every roadblock is actionable data.',
    author: 'Daily Principle'
  },
  // 16. Patience and persistence
  {
    id: 16,
    category: 'Patience and persistence',
    rule: 'Energy and persistence conquer all things.',
    author: 'Benjamin Franklin'
  },
  // 17. Discipline and consistency
  {
    id: 17,
    category: 'Discipline and consistency',
    rule: 'Discipline is choosing between what you want now and what you want most.',
    author: 'Abraham Lincoln'
  },
  // 18. Time management
  {
    id: 18,
    category: 'Time management',
    rule: 'Guard your time ruthlessly; it is the single non-renewable asset of your life.',
    author: 'Daily Principle'
  },
  // 19. Learning and improvement
  {
    id: 19,
    category: 'Learning and improvement',
    rule: 'Anyone who stops learning is old, whether at twenty or eighty. Anyone who keeps learning stays young.',
    author: 'Henry Ford'
  },
  // 20. Focus and productivity
  {
    id: 20,
    category: 'Focus and productivity',
    rule: 'Do not confuse movement with progress. A rocking horse keeps moving but never makes any progress.',
    author: 'Alfred A. Montapert'
  },
  // 21. Self-awareness
  {
    id: 21,
    category: 'Self-awareness',
    rule: 'Between stimulus and response there is a space. In that space is our power to choose our response.',
    author: 'Viktor E. Frankl'
  },
  // 22. Goal setting
  {
    id: 22,
    category: 'Goal setting',
    rule: 'Set your goals high enough to inspire you and clear enough that your next step is obvious.',
    author: 'Daily Principle'
  },
  // 23. Problem-solving
  {
    id: 23,
    category: 'Problem-solving',
    rule: 'It always seems impossible until it is done.',
    author: 'Nelson Mandela'
  },
  // 24. Patience and persistence
  {
    id: 24,
    category: 'Patience and persistence',
    rule: 'Rivers know this: there is no hurry. We shall get there some day.',
    author: 'A. A. Milne'
  },
  // 25. Discipline and consistency
  {
    id: 25,
    category: 'Discipline and consistency',
    rule: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier'
  },
  // 26. Time management
  {
    id: 26,
    category: 'Time management',
    rule: 'Yesterday is gone. Tomorrow has not yet come. We have only today. Let us begin.',
    author: 'Mother Teresa'
  },
  // 27. Learning and improvement
  {
    id: 27,
    category: 'Learning and improvement',
    rule: 'Mistakes are the portals of discovery. Review them without self-judgment and extract the lesson.',
    author: 'James Joyce'
  },
  // 28. Focus and productivity
  {
    id: 28,
    category: 'Focus and productivity',
    rule: 'Deep work requires protecting uninterrupted blocks of time from shallow distractions.',
    author: 'Daily Principle'
  },
  // 29. Self-awareness
  {
    id: 29,
    category: 'Self-awareness',
    rule: 'Honest self-assessment at the end of each day turns routine activity into personal wisdom.',
    author: 'Daily Principle'
  },
  // 30. Goal setting
  {
    id: 30,
    category: 'Goal setting',
    rule: "If you don't know where you are going, any road will get you there.",
    author: 'Lewis Carroll'
  },
  // 31. Problem-solving
  {
    id: 31,
    category: 'Problem-solving',
    rule: 'Clarify the root bottleneck before putting energy into fixing the symptoms.',
    author: 'Daily Principle'
  },
  // 32. Patience and persistence
  {
    id: 32,
    category: 'Patience and persistence',
    rule: 'A tree that is unshakeable today withstood years of quiet, invisible root growth.',
    author: 'Daily Principle'
  },
  // 33. Discipline and consistency
  {
    id: 33,
    category: 'Discipline and consistency',
    rule: 'Motivation gets you started, but daily habits and discipline keep you growing.',
    author: 'Jim Ryun'
  },
  // 34. Time management
  {
    id: 34,
    category: 'Time management',
    rule: 'It is not that we have a short time to live, but that we waste a lot of it.',
    author: 'Seneca'
  },
  // 35. Learning and improvement
  {
    id: 35,
    category: 'Learning and improvement',
    rule: 'Every master was once a disaster. Continuous small adjustments beat occasional grand efforts.',
    author: 'Daily Principle'
  },
  // 36. Focus and productivity
  {
    id: 36,
    category: 'Focus and productivity',
    rule: "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.",
    author: 'Alexander Graham Bell'
  },
  // 37. Self-awareness
  {
    id: 37,
    category: 'Self-awareness',
    rule: 'You cannot change what you refuse to confront. Observe your habits without rationalization.',
    author: 'Daily Principle'
  },
  // 38. Goal setting
  {
    id: 38,
    category: 'Goal setting',
    rule: 'Break formidable milestones into daily non-negotiables that eliminate hesitation.',
    author: 'Daily Principle'
  },
  // 39. Problem-solving
  {
    id: 39,
    category: 'Problem-solving',
    rule: 'The obstacle in the path becomes the path. Within every difficulty lies an advantage.',
    author: 'Marcus Aurelius'
  },
  // 40. Patience and persistence
  {
    id: 40,
    category: 'Patience and persistence',
    rule: 'Do not despise the day of small beginnings; endurance is the bedrock of mastery.',
    author: 'Daily Principle'
  }
]

/**
 * Returns a list of all distinct category names
 */
export function getReflectionCategories() {
  return [...new Set(REFLECTION_RULES.map((r) => r.category))]
}

/**
 * Deterministically retrieves the reflection rule for any given date string (YYYY-MM-DD).
 *
 * Algorithm:
 * Converts the calendar date to days elapsed since UTC epoch (1970-01-01),
 * then calculates index = epochDays % REFLECTION_RULES.length.
 *
 * Guarantees:
 * 1. Determinism: Same dateStr ALWAYS produces the exact same rule forever.
 * 2. Consecutive variety: Day N and Day N+1 always map to different adjacent rules & categories.
 * 3. Offline & Safe: No external network/API needed; handles invalid dateStr gracefully.
 *
 * @param {string} [dateStr] - Calendar date formatted as YYYY-MM-DD
 * @returns {{ id: number, category: string, rule: string, author: string }}
 */
export function getDailyReflectionRule(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    dateStr = `${year}-${month}-${day}`
  }

  const parts = dateStr.trim().split('-')
  let index = 0

  if (parts.length === 3) {
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1 // 0-indexed month
    const day = parseInt(parts[2], 10)

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      // Days since UTC epoch
      const epochDays = Math.floor(Date.UTC(year, month, day) / (1000 * 60 * 60 * 24))
      const len = REFLECTION_RULES.length
      index = ((epochDays % len) + len) % len
    }
  }

  return REFLECTION_RULES[index] || REFLECTION_RULES[0]
}
