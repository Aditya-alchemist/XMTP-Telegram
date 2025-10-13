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
  const [displayName, setDisplayName] = useState<string>('')
  const [memberCount, setMemberCount] = useState<number>(0)
  const [preview, setPreview] = useState<string>('Tap to view messages')
  const [isLoaded, setIsLoaded] = useState(false)

  const isGroupChat = memberCount > 2

  useEffect(() => {
    let isMounted = true

    const loadConversationInfo = async () => {
      try {
        await conversation.sync()
        
        if (!isMounted) return

        const convId = (conversation as any).id || 'unknown'
        const storedName = localStorage.getItem(`dm_name_${convId}`)
        const storedAddress = localStorage.getItem(`dm_address_${convId}`)
        
        if ('members' in conversation) {
          const group = conversation as any
          const members = group.members || []
          setMemberCount(members.length)
          
          if (members.length > 2) {
            // Real group (3+ members)
            const groupName = group.name || group.groupName || 'Group Chat'
            setDisplayName(groupName)
          } else if (members.length === 2) {
            // DM (exactly 2 members)
            if (storedName) {
              // Use custom name from NewDM modal
              setDisplayName(storedName)
            } else if (storedAddress) {
              // Use formatted address
              setDisplayName(`${storedAddress.slice(0, 6)}...${storedAddress.slice(-4)}`)
            } else {
              // Fallback to inbox ID
              const myInboxId = client?.inboxId
              const otherInboxId = members.find((m: string) => m !== myInboxId)
              
              if (otherInboxId) {
                setDisplayName(`${otherInboxId.slice(0, 6)}...${otherInboxId.slice(-4)}`)
              } else {
                setDisplayName('Direct Message')
              }
            }
          } else {
            // Single member (shouldn't happen)
            setDisplayName(storedName || 'Chat')
          }
        } else {
          setDisplayName(storedName || convId.slice(0, 8))
        }

        // Get last message preview
        try {
          const lastMsg = await conversation.lastMessage()
          if (lastMsg && isMounted) {
            let content = typeof lastMsg.content === 'string' ? lastMsg.content : ''
            
            // Check if it's a file message
            try {
              const parsed = JSON.parse(content)
              if (parsed.type === 'file') {
                content = `📎 ${parsed.file.name}`
              }
            } catch {
              // Not JSON, use as is
            }
            
            const preview = content.slice(0, 30) || 'New message'
            setPreview(preview)
          }
        } catch (err) {
          // Ignore preview errors
        }

        setIsLoaded(true)
      } catch (err) {
        console.error('Error loading conversation info:', err)
        if (isMounted) {
          const convId = (conversation as any).id || 'unknown'
          setDisplayName(convId.slice(0, 8))
          setIsLoaded(true)
        }
      }
    }

    loadConversationInfo()

    return () => {
      isMounted = false
    }
  }, [conversation, client])

  const getInitials = () => {
    if (isGroupChat) return 'GR'
    if (!displayName) return '??'
    
    // If it looks like an address (0x...), use first 2 chars after 0x
    if (displayName.startsWith('0x')) {
      return displayName.slice(2, 4).toUpperCase()
    }
    
    // Otherwise use first 2 chars of name
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
            {isLoaded ? (displayName || 'Loading...') : 'Loading...'}
          </h3>
          <span className="text-xs text-telegram-gray flex-shrink-0 ml-2">
            Recently
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-telegram-gray truncate">
            {preview}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConversationItem