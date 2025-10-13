import React from 'react'
import { motion } from 'framer-motion'

/**
 * Typing indicator animation
 */
const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-2">
      {/* Avatar */}
      <div className="avatar avatar-sm bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
        ...
      </div>

      {/* Typing Bubble */}
      <div className="message-bubble message-received">
        <div className="flex items-center gap-1 py-1">
          <motion.div
            className="w-2 h-2 rounded-full bg-telegram-gray"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0,
            }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-telegram-gray"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-telegram-gray"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
          />
        </div>
      </div>

      <div className="w-8" />
    </div>
  )
}

export default TypingIndicator