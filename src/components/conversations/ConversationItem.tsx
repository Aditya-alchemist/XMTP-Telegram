import React, { useState, useEffect } from 'react'
import type { Conversation } from '@xmtp/browser-sdk'
import { Users } from 'lucide-react'

interface ConversationItemProps {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const [displayName, setDisplayName] = useState<string>('Loading...')
  const [memberCount, setMemberCount] = useState<number>(0)

  // Determine if it's a group (more than 2 members) or DM (exactly 2 members)
  const isGroupChat = memberCount > 2

  useEffect(() => {
    const loadConversationInfo = async () => {
      try {
        // Sync conversation first
        await conversation.sync()
        
        // Check if it's a group conversation
        if ('members' in conversation) {
          const group = conversation as any
          const members = group.members || []
          setMemberCount(members.length)
          
          // If more than 2 members, it's a group - get the name
          if (members.length > 2) {
            const groupName = group.name || 'Group Chat'
            setDisplayName(groupName)
          } else {
            // It's a DM - show the other person's address
            const myInboxId = group.client?.inboxId
            const otherMember = members.find((m: string) => m !== myInboxId)
            
            if (otherMember) {
              setDisplayName(`${otherMember.slice(0, 8)}...`)
            } else {
              setDisplayName('Direct Message')
            }
          }
        } 
      } catch (err) {
        console.error('Error loading conversation info:', err)
        setDisplayName(conversation.id.slice(0, 8))
      }
    }

    loadConversationInfo()
  }, [conversation])

  const getInitials = () => {
    if (isGroupChat) return 'GR'
    return displayName.slice(0, 2).toUpperCase()
  }

  const getPreview = () => {
    return 'Tap to view messages'
  }

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
        {isGroupChat ? (
          <div className="avatar avatar-md bg-telegram-accent">
            <Users className="w-5 h-5" />
          </div>
        ) : (
          <div className="avatar avatar-md bg-gradient-to-br from-purple-500 to-pink-500">
            {getInitials()}
          </div>
        )}
        <div className="absolute bottom-0 right-0 status-online" />
      </div>

      {/* Conversation Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-telegram-text truncate">
            {displayName}
          </h3>
          <span className="text-xs text-telegram-gray flex-shrink-0 ml-2">
            {getTimeDisplay()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-telegram-gray truncate">
            {getPreview()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConversationItem
