import React, { useState, useEffect } from 'react'
import type { Conversation } from '@xmtp/browser-sdk'
import { Users } from 'lucide-react'
import { useXMTPClient } from '../../hooks/useXMTPClient'

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
  const { client } = useXMTPClient()
  const [displayName, setDisplayName] = useState<string>('Loading...')
  const [memberCount, setMemberCount] = useState<number>(0)

  const isGroupChat = memberCount > 2

  useEffect(() => {
    const loadConversationInfo = async () => {
      try {
        await conversation.sync()
        
        if ('members' in conversation) {
          const group = conversation as any
          const members = group.members || []
          setMemberCount(members.length)
          
          if (members.length > 2) {
            // It's a group
            const groupName = group.name || 'Group Chat'
            setDisplayName(groupName)
          } else if (members.length === 2) {
            // It's a DM - get the other person's inbox ID
            const myInboxId = client?.inboxId
            const otherInboxId = members.find((m: string) => m !== myInboxId)
            
            if (otherInboxId && client) {
              try {
                // Use findInboxIdByIdentifier to get address info
                const addresses = await client.findInboxIdByIdentifier({
                  identifier: otherInboxId,
                  identifierKind: 'InboxId' as any,
                })
                
                if (addresses) {
                  // Format as 0x1234...5678
                  setDisplayName(`${otherInboxId.slice(0, 6)}...${otherInboxId.slice(-4)}`)
                } else {
                  setDisplayName(`${otherInboxId.slice(0, 6)}...${otherInboxId.slice(-4)}`)
                }
              } catch {
                // Fallback to inbox ID
                setDisplayName(`${otherInboxId.slice(0, 6)}...${otherInboxId.slice(-4)}`)
              }
            } else {
              setDisplayName('Direct Message')
            }
          } else {
            setDisplayName('Empty Chat')
          }
        } else {
          // Fallback for non-group conversations
          const convId = (conversation as any).id || 'unknown'
          setDisplayName(convId.slice(0, 8))
        }
      } catch (err) {
        console.error('Error loading conversation info:', err)
        const convId = (conversation as any).id || 'unknown'
        setDisplayName(convId.slice(0, 8))
      }
    }

    loadConversationInfo()
  }, [conversation, client])

  const getInitials = () => {
    if (isGroupChat) return 'GR'
    return displayName.slice(0, 2).toUpperCase()
  }

  return (
    <div
      onClick={onClick}
      className={`sidebar-item cursor-pointer ${isSelected ? 'sidebar-item-active' : ''}`}
    >
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

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-telegram-text truncate">
            {displayName}
          </h3>
          <span className="text-xs text-telegram-gray flex-shrink-0 ml-2">
            Recently
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-telegram-gray truncate">
            Tap to view messages
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConversationItem
