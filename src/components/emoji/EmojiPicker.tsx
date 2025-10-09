import React from 'react'
import EmojiPickerReact, { EmojiClickData, Theme, EmojiStyle } from 'emoji-picker-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EmojiPickerProps {
  isOpen: boolean
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
  position?: 'top' | 'bottom'
}

/**
 * Emoji picker popup component
 */
const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isOpen,
  onEmojiSelect,
  onClose,
  position = 'bottom',
}) => {
  // Handle emoji click
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Picker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'bottom' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'bottom' ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${
              position === 'bottom' ? 'bottom-12' : 'top-12'
            } right-0 z-50 shadow-2xl rounded-xl overflow-hidden`}
          >
            <EmojiPickerReact
              onEmojiClick={handleEmojiClick}
              theme={Theme.DARK}
              searchPlaceholder="Search emoji..."
              width={350}
              height={400}
              previewConfig={{
                showPreview: false,
              }}
              skinTonesDisabled={false}
              searchDisabled={false}
              emojiStyle={EmojiStyle.NATIVE}
              lazyLoadEmojis={true}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default EmojiPicker
