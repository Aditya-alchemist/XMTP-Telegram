import React, { useState, useEffect } from 'react'
import { ArrowLeft, MoreVertical, Phone, Video, Users } from 'lucide-react'
import type { Conversation } from '@xmtp/browser-sdk'
import { motion } from 'framer-motion'
import { useXMTPClient } from '../../hooks/useXMTPClient'

interface ChatHeaderProps {
  conversation: Conversation
  onBack: () => void
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onBack }) => {
  const { client } = useXMTPClient()
  const [displayName, setDisplayName] = useState<string>('Loading...')
  const [memberCount, setMemberCount] = useState<number>(0)
  const [status, setStatus] = useState<string>('Online')

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
            setStatus(`${members.length} members`)
          } else if (members.length === 2) {
            // It's a DM
            const myInboxId = client?.inboxId
            const otherInboxId = members.find((m: string) => m !== myInboxId)
            
            if (otherInboxId && client) {
              try {
                // Try to get more info about the inbox
                const inboxInfo = await client.findInboxIdByIdentifier({
                  identifier: otherInboxId,
                  identifierKind: 'InboxId' as any,
                })
                
                // Use inbox ID as display name (formatted)
                setDisplayName(`${otherInboxId.slice(0, 6)}...${otherInboxId.slice(-4)}`)
              } catch {
                setDisplayName(`${otherInboxId.slice(0, 6)}...${otherInboxId.slice(-4)}`)
              }
              setStatus('Online')
            } else {
              setDisplayName('Direct Message')
            }
          } else {
            setDisplayName('Empty Chat')
          }
        } else {
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 bg-telegram-header border-b border-telegram-border"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={onBack} className="md:hidden btn-icon flex-shrink-0" aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative flex-shrink-0">
            <div className={`avatar avatar-md ${isGroupChat ? 'bg-telegram-accent' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
              {isGroupChat ? <Users className="w-5 h-5" /> : getInitials()}
            </div>
            {!isGroupChat && <div className="absolute bottom-0 right-0 status-online" />}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-telegram-text truncate">{displayName}</h3>
            <p className="text-xs text-telegram-gray">{status}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="btn-icon hidden md:flex" title="Voice Call" aria-label="Voice call">
            <Phone className="w-5 h-5" />
          </button>
          <button className="btn-icon hidden md:flex" title="Video Call" aria-label="Video call">
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
