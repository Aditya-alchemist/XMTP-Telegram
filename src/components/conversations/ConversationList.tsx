import React from 'react'
import { useConversations } from '../../hooks/useConversations'
import ConversationItem from './ConversationItem'
import { Loader2, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Conversation } from '@xmtp/browser-sdk'

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void
  selectedConversation: Conversation | null
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedConversation,
}) => {
  const { conversations, isLoading, error, refetch } = useConversations()

  // Auto-refresh every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 5000)

    return () => clearInterval(interval)
  }, [refetch])

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-telegram-blue animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
          <MessageSquare className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-400 text-sm mb-2">Failed to load conversations</p>
        <p className="text-telegram-grayDark text-xs">{error.message}</p>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-telegram-sidebar flex items-center justify-center mb-3">
          <MessageSquare className="w-8 h-8 text-telegram-gray" />
        </div>
        <p className="text-telegram-gray text-sm">No conversations yet</p>
        <p className="text-telegram-grayDark text-xs mt-1">
          Start a new chat to get started
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <AnimatePresence>
        {conversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
          >
            <ConversationItem
              conversation={conversation}
              isSelected={selectedConversation?.id === conversation.id}
              onClick={() => onSelectConversation(conversation)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ConversationList