import React from 'react'
import type { DecodedMessage } from '@xmtp/browser-sdk'
import { format } from 'date-fns'
import { Check, CheckCheck } from 'lucide-react'
import { motion } from 'framer-motion'

interface MessageBubbleProps {
  message: DecodedMessage
  isOwnMessage: boolean
  showAvatar?: boolean
}

/**
 * Individual message bubble
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showAvatar = true,
}) => {
  // Get message content as string
  const getMessageContent = (): string => {
    const content = message.content
    if (typeof content === 'string') {
      return content
    }
    // Handle other content types
    return JSON.stringify(content)
  }

  // Format timestamp
  const getFormattedTime = (): string => {
    try {
      // Convert nanoseconds to milliseconds
      const timestamp = Number(message.sentAtNs) / 1_000_000
      return format(timestamp, 'HH:mm')
    } catch (err) {
      return ''
    }
  }

  // Get sender initials for avatar
  const getSenderInitials = (): string => {
    return message.senderInboxId.slice(0, 2).toUpperCase()
  }

  return (
    <div
      className={`flex items-end gap-2 ${
        isOwnMessage ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      {!isOwnMessage && showAvatar && (
        <div className="avatar avatar-sm bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
          {getSenderInitials()}
        </div>
      )}
      {!isOwnMessage && !showAvatar && <div className="w-8" />}

      {/* Message Bubble */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`message-bubble ${
          isOwnMessage ? 'message-sent' : 'message-received'
        }`}
      >
        {/* Message Content */}
        <p className="text-sm whitespace-pre-wrap break-words">
          {getMessageContent()}
        </p>

        {/* Timestamp and Status */}
        <div
          className={`flex items-center gap-1 mt-1 ${
            isOwnMessage ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="message-time">{getFormattedTime()}</span>
          {isOwnMessage && (
            <CheckCheck className="w-3 h-3 text-telegram-textSecondary" />
          )}
        </div>
      </motion.div>

      {/* Spacer for own messages */}
      {isOwnMessage && <div className="w-8" />}
    </div>
  )
}

export default MessageBubble
