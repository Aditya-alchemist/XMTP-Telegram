import React, { useState, useRef } from 'react'
import { Send, Paperclip, Smile } from 'lucide-react'
import { motion } from 'framer-motion'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import type { Conversation } from '@xmtp/browser-sdk'
import { useMessages } from '../../hooks/useMessages'
import { UI_CONFIG } from '../../config/constants'

interface MessageInputProps {
  conversation: Conversation
}

/**
 * Message input with emoji picker
 */
const MessageInput: React.FC<MessageInputProps> = ({ conversation }) => {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage, isSending } = useMessages(conversation)

  // Handle emoji selection
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  // Handle send message
  const handleSend = async () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isSending) return

    if (trimmedMessage.length > UI_CONFIG.MAX_MESSAGE_LENGTH) {
      return
    }

    try {
      await sendMessage(trimmedMessage)
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

  return (
    <div className="flex-shrink-0 bg-telegram-sidebar border-t border-telegram-border p-4">
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <button
          className="btn-icon flex-shrink-0"
          title="Attach file"
          disabled={isSending}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input Container */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isSending}
            rows={1}
            className="chat-input resize-none max-h-32 min-h-[44px]"
            style={{
              height: 'auto',
            }}
          />

          {/* Character Count */}
          {message.length > UI_CONFIG.MAX_MESSAGE_LENGTH * 0.8 && (
            <div className="absolute bottom-2 right-2 text-xs text-telegram-gray">
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
                />
              </motion.div>
            </>
          )}
        </div>

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className="btn-primary px-4 py-3 flex-shrink-0"
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
