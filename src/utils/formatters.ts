import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns'

/**
 * Format timestamp from nanoseconds to readable date/time
 */
export const formatMessageTime = (sentAtNs: bigint | string): string => {
  try {
    // Convert nanoseconds to milliseconds
    const timestamp = Number(sentAtNs) / 1_000_000
    return format(timestamp, 'HH:mm')
  } catch (err) {
    return ''
  }
}

/**
 * Format timestamp for conversation list
 */
export const formatConversationTime = (sentAtNs: bigint | string): string => {
  try {
    const timestamp = Number(sentAtNs) / 1_000_000
    const date = new Date(timestamp)

    if (isToday(date)) {
      return format(date, 'HH:mm')
    } else if (isYesterday(date)) {
      return 'Yesterday'
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE') // Day name
    } else if (isThisYear(date)) {
      return format(date, 'MMM dd') // Jan 15
    } else {
      return format(date, 'MM/dd/yy') // 01/15/25
    }
  } catch (err) {
    return 'Recently'
  }
}

/**
 * Format timestamp to full date and time
 */
export const formatFullDateTime = (sentAtNs: bigint | string): string => {
  try {
    const timestamp = Number(sentAtNs) / 1_000_000
    return format(timestamp, 'MMM dd, yyyy HH:mm')
  } catch (err) {
    return ''
  }
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (sentAtNs: bigint | string): string => {
  try {
    const timestamp = Number(sentAtNs) / 1_000_000
    return formatDistanceToNow(timestamp, { addSuffix: true })
  } catch (err) {
    return 'Recently'
  }
}

/**
 * Format date for message grouping
 */
export const formatMessageDate = (sentAtNs: bigint | string): string => {
  try {
    const timestamp = Number(sentAtNs) / 1_000_000
    const date = new Date(timestamp)

    if (isToday(date)) {
      return 'Today'
    } else if (isYesterday(date)) {
      return 'Yesterday'
    } else if (isThisYear(date)) {
      return format(date, 'MMMM dd') // January 15
    } else {
      return format(date, 'MMMM dd, yyyy') // January 15, 2025
    }
  } catch (err) {
    return ''
  }
}

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Format message preview (remove newlines, truncate)
 */
export const formatMessagePreview = (content: string, maxLength: number = 50): string => {
  // Remove newlines and extra spaces
  const cleaned = content.replace(/\s+/g, ' ').trim()
  return truncateText(cleaned, maxLength)
}
