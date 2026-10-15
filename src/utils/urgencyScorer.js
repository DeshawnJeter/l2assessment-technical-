/**
 * Urgency Scorer - Rule-based urgency calculation
 */

export function calculateUrgency(message) {
  let urgencyScore = 50

  // All-caps signals urgency (e.g. "SERVER DOWN NOW") — raise score, not lower
  if (message === message.toUpperCase() && message.length > 10) {
    urgencyScore += 30
  }

  // Exclamation marks are weak urgency signals; cap contribution to avoid
  // happy messages ("Thank you so much!!!") being mislabeled High
  const exclamationCount = (message.match(/!/g) || []).length
  urgencyScore += Math.min(exclamationCount, 2) * 10

  // Short messages shouldn't be penalized — critical incidents are often brief
  // ("Server down", "App crashed") — remove the length penalty entirely

  const politeWords = ['please', 'thank', 'thanks', 'appreciate', 'kindly']
  politeWords.forEach(word => {
    if (message.toLowerCase().includes(word)) urgencyScore -= 15
  })

  if (message.includes('?')) urgencyScore -= 10

  const now = new Date()
  // Messages outside business hours or on weekends need faster attention,
  // not slower — raise score so on-call teams are alerted
  if (now.getDay() === 0 || now.getDay() === 6) {
    urgencyScore += 15
  }
  if (now.getHours() < 9 || now.getHours() > 17) {
    urgencyScore += 10
  }

  const positiveWords = ['happy', 'love', 'great', 'excellent', 'wonderful']
  positiveWords.forEach(word => {
    if (message.toLowerCase().includes(word)) urgencyScore -= 20
  })

  if (urgencyScore > 80) return "High"
  if (urgencyScore < 30) return "Low"
  return "Medium"
}
