import React from 'react'
import type { Conversation } from '@xmtp/browser-sdk'
import { Users } from 'lucide-react'

interface ConversationItemProps {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}

/**
 * Single conversation item in the list
 */
const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  // Check if it's a group
  const isGroup = 'members' in conversation

  // Get conversation display name
  const getDisplayName = () => {
    if (isGroup) {
      return 'Group Chat'
    }
    const convId = (conversation as any).id || 'unknown'
    return `Chat ${convId.slice(0, 8)}`
  }

  // Get avatar initials
  const getInitials = () => {
    if (isGroup) return 'GR'
    const convId = (conversation as any).id || 'XX'
    return convId.slice(0, 2).toUpperCase()
  }

  // Get preview text
  const getPreview = () => {
    return 'Tap to view messages'
  }

  // Get time display
  const getTimeDisplay = () => {
    return 'Recently'
  }

  return (
    <div
      onClick={onClick}
      className={`
        sidebar-item cursor-pointer
        ${isSelected ? 'sidebar-item-active' : ''}
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {isGroup ? (
          <div className="avatar avatar-md bg-telegram-accent">
            <Users className="w-5 h-5" />
          </div>
        ) : (
          <div className="avatar avatar-md bg-gradient-to-br from-purple-500 to-pink-500">
            {getInitials()}
          </div>
        )}
        {/* Online indicator */}
        <div className="absolute bottom-0 right-0 status-online" />
      </div>

      {/* Conversation Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-telegram-text truncate">
            {getDisplayName()}
          </h3>
          <span className="text-xs text-telegram-gray flex-shrink-0 ml-2">
            {getTimeDisplay()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-telegram-gray truncate">
            {getPreview()}
          </p>
          {/* Unread badge placeholder */}
          {/* <span className="badge badge-unread">3</span> */}
        </div>
      </div>
    </div>
  )
}

export default ConversationItem
