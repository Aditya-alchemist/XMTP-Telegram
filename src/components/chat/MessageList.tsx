import React, { useEffect, useRef } from 'react'
import { useMessages } from '../../hooks/useMessages'
import { useMessageStream } from '../../hooks/useMessageStream'
import { useXMTPClient } from '../../hooks/useXMTPClient'
import MessageBubble from './MessageBubble'
import EmptyChat from './EmptyChat'
import type { Conversation, DecodedMessage } from '@xmtp/browser-sdk'
import { AnimatePresence, motion } from 'framer-motion'

interface MessageListProps {
  conversation: Conversation
}

const MessageList: React.FC<MessageListProps> = ({ conversation }) => {
  const { client } = useXMTPClient()
  const { messages, isLoading, refetch } = useMessages(conversation)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleNewMessage = (message: DecodedMessage) => {
    console.log('New message received via stream:', message)
    refetch()
  }

  useMessageStream(conversation, handleNewMessage)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Don't show loading if we have messages
  if (messages.length === 0 && !isLoading) {
    return <EmptyChat />
  }

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

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessageList
