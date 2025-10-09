import React, { useState, useRef, useEffect } from 'react'
import { Smile } from 'lucide-react'
import { motion } from 'framer-motion'
import EmojiPicker from './EmojiPicker'

interface EmojiButtonProps {
  onEmojiSelect: (emoji: string) => void
  disabled?: boolean
  position?: 'top' | 'bottom'
  className?: string
}

/**
 * Button to trigger emoji picker
 */
const EmojiButton: React.FC<EmojiButtonProps> = ({
  onEmojiSelect,
  disabled = false,
  position = 'bottom',
  className = '',
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false)
      }
    }

    if (isPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPickerOpen])

  // Toggle picker
  const togglePicker = () => {
    if (!disabled) {
      setIsPickerOpen(!isPickerOpen)
    }
  }

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji)
    setIsPickerOpen(false)
  }

  return (
    <div ref={buttonRef} className={`relative ${className}`}>
      <motion.button
        type="button"
        onClick={togglePicker}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={`btn-icon ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Add emoji"
        aria-label="Add emoji"
      >
        <Smile
          className={`w-5 h-5 transition-colors ${
            isPickerOpen ? 'text-telegram-blue' : 'text-telegram-gray'
          }`}
        />
      </motion.button>

      <EmojiPicker
        isOpen={isPickerOpen}
        onEmojiSelect={handleEmojiSelect}
        onClose={() => setIsPickerOpen(false)}
        position={position}
      />
    </div>
  )
}

export default EmojiButton
