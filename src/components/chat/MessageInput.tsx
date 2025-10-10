import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import type { Conversation } from '@xmtp/browser-sdk'
import { useMessages } from '../../hooks/useMessages'
import { UI_CONFIG } from '../../config/constants'
import toast from 'react-hot-toast'

interface MessageInputProps {
  conversation: Conversation
}

/**
 * Message input with emoji picker and file attachments
 */
const MessageInput: React.FC<MessageInputProps> = ({ conversation }) => {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { sendMessage, isSending } = useMessages(conversation)

  // Handle emoji selection
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 10MB')
        return
      }

      setSelectedFile(file)
      toast.success(`File selected: ${file.name}`)
    }
  }

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle send message
  const handleSend = async () => {
    const trimmedMessage = message.trim()
    
    // Check if we have a message or file
    if (!trimmedMessage && !selectedFile) return

    if (isSending) return

    if (trimmedMessage.length > UI_CONFIG.MAX_MESSAGE_LENGTH) {
      toast.error(`Message too long. Maximum ${UI_CONFIG.MAX_MESSAGE_LENGTH} characters`)
      return
    }

    try {
      if (selectedFile) {
        // If file is selected, send file info as message
        // Note: XMTP doesn't support native file attachments yet
        // You'd need to upload to IPFS/Arweave and send the link
        const fileMessage = `📎 File: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)\n\n${trimmedMessage}`
        await sendMessage(fileMessage)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        // Send text message
        await sendMessage(trimmedMessage)
      }
      
      setMessage('')
      inputRef.current?.focus()
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= UI_CONFIG.MAX_MESSAGE_LENGTH) {
      setMessage(value)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`
    }
  }, [message])

  return (
    <div className="flex-shrink-0 bg-telegram-sidebar border-t border-telegram-border p-4">
      {/* Selected File Preview */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3 p-3 bg-telegram-chat rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-telegram-blue/20 flex items-center justify-center flex-shrink-0">
                <Paperclip className="w-5 h-5 text-telegram-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-telegram-text text-sm font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-telegram-gray text-xs">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="btn-icon flex-shrink-0"
              disabled={isSending}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-icon flex-shrink-0"
          title="Attach file"
          disabled={isSending}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
          disabled={isSending}
        />

        {/* Input Container */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder={selectedFile ? 'Add a caption...' : 'Type a message...'}
            disabled={isSending}
            rows={1}
            className="chat-input resize-none max-h-32 min-h-[44px] pr-16"
            style={{
              height: 'auto',
            }}
          />

          {/* Character Count */}
          {message.length > UI_CONFIG.MAX_MESSAGE_LENGTH * 0.8 && (
            <div className="absolute bottom-2 right-2 text-xs text-telegram-gray bg-telegram-sidebar px-2 py-1 rounded">
              {message.length} / {UI_CONFIG.MAX_MESSAGE_LENGTH}
            </div>
          )}
        </div>

        {/* Emoji Button */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="btn-icon"
            title="Emoji"
            disabled={isSending}
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowEmojiPicker(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-12 right-0 z-50"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme={Theme.DARK}
                    searchPlaceholder="Search emoji..."
                    width={350}
                    height={400}
                    previewConfig={{
                      showPreview: false,
                    }}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={(!message.trim() && !selectedFile) || isSending}
          className="btn-primary px-4 py-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default MessageInput
