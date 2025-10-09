import { useState, useCallback } from 'react'

interface UseEmojiReturn {
  showPicker: boolean
  selectedEmoji: string | null
  openPicker: () => void
  closePicker: () => void
  togglePicker: () => void
  selectEmoji: (emoji: string) => void
  clearEmoji: () => void
}

/**
 * Hook to manage emoji picker state
 * Handles opening/closing picker and emoji selection
 */
export const useEmoji = (): UseEmojiReturn => {
  const [showPicker, setShowPicker] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)

  const openPicker = useCallback(() => {
    setShowPicker(true)
  }, [])

  const closePicker = useCallback(() => {
    setShowPicker(false)
  }, [])

  const togglePicker = useCallback(() => {
    setShowPicker(prev => !prev)
  }, [])

  const selectEmoji = useCallback((emoji: string) => {
    setSelectedEmoji(emoji)
    closePicker()
  }, [closePicker])

  const clearEmoji = useCallback(() => {
    setSelectedEmoji(null)
  }, [])

  return {
    showPicker,
    selectedEmoji,
    openPicker,
    closePicker,
    togglePicker,
    selectEmoji,
    clearEmoji,
  }
}

export default useEmoji
