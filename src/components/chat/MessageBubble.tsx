import React from 'react'
import type { DecodedMessage } from '@xmtp/browser-sdk'
import { format } from 'date-fns'
import { Check, CheckCheck, Download, Paperclip } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface MessageBubbleProps {
  message: DecodedMessage
  isOwnMessage: boolean
  showAvatar?: boolean
}

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
    return JSON.stringify(content)
  }

  // Check if message contains file attachment
  const isFileMessage = (): boolean => {
    const content = getMessageContent()
    return content.startsWith('📎 File:')
  }

  // Parse file info from message
  const parseFileInfo = (): { name: string; size: string } | null => {
    if (!isFileMessage()) return null
    
    const content = getMessageContent()
    const match = content.match(/📎 File: (.+?) \((.+?)\)/)
    
    if (match) {
      return {
        name: match[1],
        size: match[2]
      }
    }
    
    return null
  }

  // Get text content (without file info)
  const getTextContent = (): string => {
    const content = getMessageContent()
    
    if (isFileMessage()) {
      // Extract caption after file info
      const parts = content.split('\n\n')
      return parts.length > 1 ? parts.slice(1).join('\n\n') : ''
    }
    
    return content
  }

  // Format timestamp
  const getFormattedTime = (): string => {
    try {
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

  // Handle file download (simulated - since we don't have actual files)
  const handleDownload = () => {
    const fileInfo = parseFileInfo()
    if (fileInfo) {
      toast.success(`Download feature coming soon for: ${fileInfo.name}`)
      // In a real app, you'd fetch the file from IPFS/CDN here
    }
  }

  const fileInfo = parseFileInfo()
  const textContent = getTextContent()

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
        {/* File Attachment */}
        {fileInfo && (
          <div className="mb-2 p-3 bg-telegram-bg/30 rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-telegram-blue/20 flex items-center justify-center flex-shrink-0">
              <Paperclip className="w-5 h-5 text-telegram-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileInfo.name}</p>
              <p className="text-xs text-telegram-textSecondary">{fileInfo.size}</p>
            </div>
            <button
              onClick={handleDownload}
              className="btn-icon flex-shrink-0 hover:bg-telegram-blue/20"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Message Text */}
        {textContent && (
          <p className="text-sm whitespace-pre-wrap break-words">
            {textContent}
          </p>
        )}

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
