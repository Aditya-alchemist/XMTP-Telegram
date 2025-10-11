import React from 'react'
import type { DecodedMessage } from '@xmtp/browser-sdk'
import { format } from 'date-fns'
import { CheckCheck, Download, Paperclip } from 'lucide-react'
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
  const getMessageContent = (): string => {
    const content = message.content
    if (typeof content === 'string') {
      return content
    }
    return JSON.stringify(content)
  }

  const isFileMessage = (): boolean => {
    const content = getMessageContent()
    return content.startsWith('📎 File:')
  }

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

  const getTextContent = (): string => {
    const content = getMessageContent()
    
    if (isFileMessage()) {
      const parts = content.split('\n\n')
      return parts.length > 1 ? parts.slice(1).join('\n\n') : ''
    }
    
    return content
  }

  const getFormattedTime = (): string => {
    try {
      const timestamp = Number(message.sentAtNs) / 1_000_000
      return format(timestamp, 'HH:mm')
    } catch (err) {
      return ''
    }
  }

  const getSenderInitials = (): string => {
    return message.senderInboxId.slice(0, 2).toUpperCase()
  }

  const handleDownload = () => {
    const fileInfo = parseFileInfo()
    if (fileInfo) {
      // Create a text file as placeholder
      const placeholderContent = `File: ${fileInfo.name}\nSize: ${fileInfo.size}\n\nNote: This is a placeholder file. In production, integrate with IPFS/Arweave for real file storage.`
      
      const blob = new Blob([placeholderContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = fileInfo.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success(`Downloaded: ${fileInfo.name}`)
    }
  }

  const fileInfo = parseFileInfo()
  const textContent = getTextContent()

  return (
    <div className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwnMessage && showAvatar && (
        <div className="avatar avatar-sm bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
          {getSenderInitials()}
        </div>
      )}
      {!isOwnMessage && !showAvatar && <div className="w-8" />}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`message-bubble ${isOwnMessage ? 'message-sent' : 'message-received'}`}
      >
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
              className="p-2 rounded-lg hover:bg-telegram-blue/20 transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}

        {textContent && (
          <p className="text-sm whitespace-pre-wrap break-words">
            {textContent}
          </p>
        )}

        <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          <span className="message-time">{getFormattedTime()}</span>
          {isOwnMessage && (
            <CheckCheck className="w-3 h-3 text-telegram-textSecondary" />
          )}
        </div>
      </motion.div>

      {isOwnMessage && <div className="w-8" />}
    </div>
  )
}

export default MessageBubble
