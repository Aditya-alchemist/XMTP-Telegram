import React from 'react'
import { ArrowLeft, MoreVertical, Phone, Video, Users } from 'lucide-react'
import type { Conversation } from '@xmtp/browser-sdk'
import { motion } from 'framer-motion'

interface ChatContainerProps {
  conversation: Conversation | null
  onBack: () => void
}

/**
 * Chat container - Shows messages for selected conversation
 * Empty state when no conversation selected
 */
const ChatContainer: React.FC<ChatContainerProps> = ({ conversation, onBack }) => {
  // Empty state - no conversation selected
  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center bg-telegram-chat">
        <div className="text-center space-y-4 px-4">
          <div className="w-32 h-32 rounded-full bg-telegram-sidebar mx-auto flex items-center justify-center">
            <svg
              className="w-16 h-16 text-telegram-gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-telegram-text">
              Select a chat
            </h2>
            <p className="text-telegram-gray">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      </div>
    )
  }

  // FIXED: Check if conversation is a group and cast appropriately
  const isGroupChat = 'members' in conversation
  
  // FIXED: Access id as any to bypass TypeScript union type issue
  const conversationId = (conversation as any).id || 'unknown'
  
  // Get conversation name/identifier
  const getConversationName = () => {
    if (isGroupChat) {
      return 'Group Chat'
    }
    return `Chat ${conversationId.slice(0, 8)}`
  }

  // Get avatar initials
  const getInitials = () => {
    if (isGroupChat) return 'GR'
    return conversationId.slice(0, 2).toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-telegram-chat"
    >
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-telegram-header border-b border-telegram-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* Back button for mobile */}
            <button
              onClick={onBack}
              className="md:hidden btn-icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div className={`avatar avatar-md ${
              isGroupChat 
                ? 'bg-telegram-accent' 
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
            }`}>
              {isGroupChat ? (
                <Users className="w-5 h-5" />
              ) : (
                getInitials()
              )}
            </div>

            {/* Conversation Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-telegram-text truncate">
                {getConversationName()}
              </h3>
              <p className="text-xs text-telegram-gray">
                {isGroupChat ? 'Group' : 'Online'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="btn-icon hidden md:flex" title="Voice Call">
              <Phone className="w-5 h-5" />
            </button>
            <button className="btn-icon hidden md:flex" title="Video Call">
              <Video className="w-5 h-5" />
            </button>
            <button className="btn-icon" title="More Options">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 scroll-area">
        <div className="text-center py-8">
          <p className="text-telegram-gray text-sm">
            Messages will appear here
          </p>
          <p className="text-telegram-grayDark text-xs mt-1">
            Start the conversation by sending a message
          </p>
        </div>
      </div>

      {/* Message Input Area */}
      <div className="flex-shrink-0 bg-telegram-sidebar border-t border-telegram-border p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="chat-input"
          />
          <button className="btn-primary px-4 py-3">
            Send
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatContainer
