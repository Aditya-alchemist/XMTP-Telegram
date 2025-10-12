import React from 'react'
import type { DecodedMessage } from '@xmtp/browser-sdk'
import { format } from 'date-fns'
import { CheckCheck, Download, ExternalLink, Image, FileText, File, Video } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatFileSize } from '../../utils/ipfs'
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

  const parseFileMessage = (): any | null => {
    const content = getMessageContent()
    try {
      const parsed = JSON.parse(content)
      if (parsed.type === 'file' && parsed.file) {
        return parsed
      }
    } catch {
      return null
    }
    return null
  }

  const getFormattedTime = (): string => {
    try {
      const timestamp = Number(message.sentAtNs) / 1_000_000
      return format(timestamp, 'HH:mm')
    } catch {
      return ''
    }
  }

  const getSenderInitials = (): string => {
    return message.senderInboxId.slice(0, 2).toUpperCase()
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-5 h-5 text-telegram-blue" />
    if (mimeType.startsWith('video/')) return <Video className="w-5 h-5 text-telegram-blue" />
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-telegram-blue" />
    return <File className="w-5 h-5 text-telegram-blue" />
  }

  const handleDownload = async (cid: string, filename: string) => {
    const downloadToast = toast.loading('Downloading...')
    
    try {
      const gateway = process.env.REACT_APP_PINATA_GATEWAY || 'gateway.pinata.cloud'
      const url = `https://${gateway}/ipfs/${cid}`
      
      // Fetch the file as blob
      const response = await fetch(url, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      
      // Create download link
      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup
      URL.revokeObjectURL(downloadUrl)
      
      toast.success('Downloaded!', { id: downloadToast })
    } catch (err) {
      console.error('Download error:', err)
      toast.error('Download failed', { id: downloadToast })
    }
  }

  const handleView = (cid: string) => {
    const gateway = process.env.REACT_APP_PINATA_GATEWAY || 'gateway.pinata.cloud'
    const url = `https://${gateway}/ipfs/${cid}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const fileMessage = parseFileMessage()
  const textContent = !fileMessage ? getMessageContent() : fileMessage.caption || ''
  const shouldShowText = textContent && !textContent.startsWith('{') && !textContent.startsWith('[')

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
        className={`message-bubble ${isOwnMessage ? 'message-sent' : 'message-received'} max-w-md`}
      >
        {fileMessage && (
          <div className="mb-2 p-3 bg-telegram-bg/30 rounded-lg border border-telegram-blue/20">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-telegram-blue/20 flex items-center justify-center flex-shrink-0">
                {getFileIcon(fileMessage.file.mimeType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-telegram-text">
                  {fileMessage.file.name}
                </p>
                <p className="text-xs text-telegram-gray mb-2">
                  {formatFileSize(fileMessage.file.size)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(fileMessage.file.cid, fileMessage.file.name)}
                    className="text-xs bg-telegram-blue hover:bg-telegram-darkBlue text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                  <button
                    onClick={() => handleView(fileMessage.file.cid)}
                    className="text-xs bg-telegram-chat hover:bg-telegram-hover text-telegram-text px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-telegram-border"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {shouldShowText && (
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
