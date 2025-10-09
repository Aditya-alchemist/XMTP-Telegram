import React, { useEffect, useRef } from 'react'
import { useMessages } from '../../hooks/useMessages'
import { useMessageStream } from '../../hooks/useMessageStream'
import { useXMTPClient } from '../../hooks/useXMTPClient'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import EmptyChat from './EmptyChat'
import { Loader2 } from 'lucide-react'
import type { Conversation, DecodedMessage } from '@xmtp/browser-sdk'
import { AnimatePresence, motion } from 'framer-motion'

interface MessageListProps {
  conversation: Conversation
}

/**
 * Container for displaying all messages in a conversation
 */
const MessageList: React.FC<MessageListProps> = ({ conversation }) => {
  const { client } = useXMTPClient()
  const { messages, isLoading, refetch } = useMessages(conversation)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = React.useState(false)

  // Handle new messages from stream
  const handleNewMessage = (message: DecodedMessage) => {
    console.log('New message received via stream:', message)
    // Refetch to update the list
    refetch()
  }

  // Start message stream
  useMessageStream(conversation, handleNewMessage)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-telegram-chat">
        <Loader2 className="w-8 h-8 text-telegram-blue animate-spin" />
      </div>
    )
  }

  // Empty state
  if (messages.length === 0) {
    return <EmptyChat />
  }

  // Get current user's inbox ID
  const currentUserInboxId = client?.inboxId

  return (
    <div className="flex-1 overflow-y-auto p-4 scroll-area bg-telegram-chat">
      <div className="max-w-4xl mx-auto space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isOwnMessage = message.senderInboxId === currentUserInboxId
            const showAvatar =
              index === messages.length - 1 ||
              messages[index + 1]?.senderInboxId !== message.senderInboxId

            return (
              <motion.div
                key={`${message.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <MessageBubble
                  message={message}
                  isOwnMessage={isOwnMessage}
                  showAvatar={showAvatar}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <TypingIndicator />
          </motion.div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessageList
