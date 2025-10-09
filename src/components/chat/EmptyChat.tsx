import React from 'react'
import { MessageCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Empty state when no messages in conversation
 */
const EmptyChat: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex items-center justify-center bg-telegram-chat p-4"
    >
      <div className="text-center space-y-4 max-w-md">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative w-24 h-24 mx-auto"
        >
          <div className="w-24 h-24 rounded-full bg-telegram-sidebar flex items-center justify-center">
            <MessageCircle className="w-12 h-12 text-telegram-blue" />
          </div>
          {/* Sparkle Effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-telegram-blue" />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <h3 className="text-xl font-semibold text-telegram-text">
            No messages yet
          </h3>
          <p className="text-telegram-gray text-sm">
            Start the conversation by sending a message below
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-2 pt-4"
        >
          <div className="flex items-center justify-center gap-2 text-telegram-textSecondary text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-telegram-blue" />
            <span>End-to-end encrypted</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-telegram-textSecondary text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-telegram-blue" />
            <span>Messages are private and secure</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default EmptyChat
