import React from 'react'
import { ArrowLeft, MoreVertical, Phone, Video, Users, User } from 'lucide-react'
import type { Conversation } from '@xmtp/browser-sdk'
import { motion } from 'framer-motion'

interface ChatHeaderProps {
  conversation: Conversation
  onBack: () => void
}

/**
 * Chat header with conversation info and actions
 */
const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onBack }) => {
  // Check if conversation is a group
  const isGroup = 'members' in conversation

  // Get conversation ID
  const conversationId = (conversation as any).id || 'unknown'

  // Get display name
  const getDisplayName = () => {
    if (isGroup) {
      return 'Group Chat'
    }
    return `Chat ${conversationId.slice(0, 8)}`
  }

  // Get avatar initials
  const getInitials = () => {
    if (isGroup) return 'GR'
    return conversationId.slice(0, 2).toUpperCase()
  }

  // Get status text
  const getStatusText = () => {
    if (isGroup) {
      return 'Group'
    }
    return 'Online'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 bg-telegram-header border-b border-telegram-border"
    >
      <div className="flex items-center justify-between p-4">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Back Button (Mobile) */}
          <button
            onClick={onBack}
            className="md:hidden btn-icon flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={`avatar avatar-md ${
                isGroup
                  ? 'bg-telegram-accent'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}
            >
              {isGroup ? <Users className="w-5 h-5" /> : getInitials()}
            </div>
            {/* Online Indicator */}
            {!isGroup && (
              <div className="absolute bottom-0 right-0 status-online" />
            )}
          </div>

          {/* Conversation Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-telegram-text truncate">
              {getDisplayName()}
            </h3>
            <p className="text-xs text-telegram-gray">{getStatusText()}</p>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className="btn-icon hidden md:flex"
            title="Voice Call"
            aria-label="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            className="btn-icon hidden md:flex"
            title="Video Call"
            aria-label="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <button className="btn-icon" title="More Options" aria-label="More options">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatHeader
