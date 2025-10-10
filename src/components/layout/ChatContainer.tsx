import React from 'react'
import type { Conversation } from '@xmtp/browser-sdk'
import ChatHeader from '../chat/ChatHeader'
import MessageList from '../chat/MessageList'
import MessageInput from '../chat/MessageInput'

interface ChatContainerProps {
  conversation: Conversation | null
  onBack: () => void
}

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

  // Chat view with messages
  return (
    <div className="h-full flex flex-col bg-telegram-chat">
      {/* Chat Header */}
      <ChatHeader conversation={conversation} onBack={onBack} />

      {/* Messages List */}
      <MessageList conversation={conversation} />

      {/* Message Input (with emoji picker) */}
      <MessageInput conversation={conversation} />
    </div>
  )
}

export default ChatContainer
