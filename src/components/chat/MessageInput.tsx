import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import type { Conversation } from '@xmtp/browser-sdk'
import { useMessages } from '../../hooks/useMessages'
import { UI_CONFIG } from '../../config/constants'
import toast from 'react-hot-toast'
import { uploadToIPFS, formatFileSize } from '../../utils/ipfs'

interface MessageInputProps {
  conversation: Conversation
}

const MessageInput: React.FC<MessageInputProps> = ({ conversation }) => {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { sendMessage, isSending } = useMessages(conversation)

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File too large. Max 100MB')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSend = async () => {
    const trimmedMessage = message.trim()
    
    if (!trimmedMessage && !selectedFile) return
    if (isSending || isUploading) return

    let messageToSend = trimmedMessage
    let uploadSuccessToastId: string | undefined

    try {
      if (selectedFile) {
        setIsUploading(true)
        const uploadToast = toast.loading('Uploading...')

        try {
          const uploaded = await uploadToIPFS(selectedFile)
          
          // Dismiss loading and show success
          toast.dismiss(uploadToast)
          uploadSuccessToastId = toast.success('Sent', { duration: 1500 })

          messageToSend = JSON.stringify({
            type: 'file',
            file: {
              cid: uploaded.cid,
              url: uploaded.url,
              name: uploaded.name,
              size: uploaded.size,
              mimeType: uploaded.type,
            },
            caption: trimmedMessage,
          })

          setSelectedFile(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        } catch (err) {
          toast.error('Upload failed', { id: uploadToast })
          setIsUploading(false)
          return
        }
        
        setIsUploading(false)
      }

      // Send the message
      await sendMessage(messageToSend)
      
      // Only show "Sent" for text messages (files already showed it)
      if (!selectedFile) {
        toast.success('Sent', { duration: 1500 })
      }
      
      setMessage('')
      inputRef.current?.focus()
    } catch (err: any) {
      console.error('Send failed:', err)
      toast.error('Failed to send')
      setIsUploading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= UI_CONFIG.MAX_MESSAGE_LENGTH) {
      setMessage(value)
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`
    }
  }, [message])

  return (
    <div className="flex-shrink-0 bg-telegram-sidebar border-t border-telegram-border p-4">
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
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            {!isUploading && (
              <button onClick={handleRemoveFile} className="btn-icon flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-icon flex-shrink-0"
          disabled={isSending || isUploading}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="*/*"
          disabled={isSending || isUploading}
        />

        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder={selectedFile ? 'Add caption...' : 'Type a message...'}
            disabled={isSending || isUploading}
            rows={1}
            className="chat-input resize-none max-h-32 min-h-[44px]"
          />
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="btn-icon"
            disabled={isSending || isUploading}
          >
            <Smile className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {showEmojiPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-12 right-0 z-50"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme={Theme.DARK}
                    width={350}
                    height={400}
                    previewConfig={{ showPreview: false }}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={(!message.trim() && !selectedFile) || isSending || isUploading}
          className="btn-primary px-4 py-3 flex-shrink-0 disabled:opacity-50"
        >
          {isSending || isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default MessageInput
