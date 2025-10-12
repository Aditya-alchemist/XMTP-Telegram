import React, { useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useConversations } from '../../hooks/useConversations'
import { MessageSquarePlus, Search, Settings, LogOut, Loader2, Users } from 'lucide-react'
import type { Conversation } from '@xmtp/browser-sdk'
import { motion, AnimatePresence } from 'framer-motion'
import NewDM from '../conversations/NewDM'
import NewGroup from '../conversations/NewGroup'
import ConversationItem from '../conversations/ConversationItem'

interface SidebarProps {
  selectedConversation: Conversation | null
  onSelectConversation: (conversation: Conversation) => void
}

const Sidebar: React.FC<SidebarProps> = ({ selectedConversation, onSelectConversation }) => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useWeb3Modal()
  const { conversations, isLoading, refetch } = useConversations()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)
  const [showNewGroup, setShowNewGroup] = useState(false)

  const filteredConversations = conversations.filter((conv) => {
    return true
  })

  const getInitials = (text: string) => {
    return text.slice(0, 2).toUpperCase()
  }

  return (
    <div className="h-full flex flex-col bg-telegram-sidebar">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-telegram-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="avatar avatar-md bg-gradient-to-br from-telegram-blue to-telegram-lightBlue">
              {getInitials(address?.slice(2, 6) || 'XX')}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-telegram-text truncate">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </h2>
              <p className="text-xs text-telegram-gray">Online</p>
            </div>
          </div>
          
          <button
            onClick={() => open()}
            className="btn-icon"
            title="Wallet Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-telegram-gray" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-telegram-chat rounded-xl pl-10 pr-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-telegram-blue
                     placeholder:text-telegram-gray transition-all"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex-shrink-0 p-4 border-b border-telegram-border space-y-2">
        <button
          onClick={() => setShowNewChat(true)}
          className="w-full flex items-center justify-center gap-2 bg-telegram-blue
                   hover:bg-telegram-darkBlue text-white rounded-xl py-3 px-4
                   transition-all duration-200 transform hover:scale-105"
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span className="font-medium">New Chat</span>
        </button>

        <button
          onClick={() => setShowNewGroup(true)}
          className="w-full flex items-center justify-center gap-2 bg-telegram-accent
                   hover:bg-telegram-accent/80 text-white rounded-xl py-3 px-4
                   transition-all duration-200 transform hover:scale-105"
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">New Group</span>
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto scroll-area">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-telegram-blue animate-spin" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquarePlus className="w-12 h-12 text-telegram-gray mb-3" />
            <p className="text-telegram-gray text-sm">No conversations yet</p>
            <p className="text-telegram-grayDark text-xs mt-1">
              Start a new chat to get started
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredConversations.map((conversation, index) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation?.id === conversation.id}
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex-shrink-0 p-4 border-t border-telegram-border">
        <button
          onClick={() => disconnect()}
          className="w-full flex items-center justify-center gap-2 text-red-400
                   hover:bg-telegram-hover rounded-xl py-2.5 px-4
                   transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Disconnect</span>
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNewChat && (
          <NewDM
            onClose={() => setShowNewChat(false)}
            onSuccess={() => {
              refetch()
              setShowNewChat(false)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewGroup && (
          <NewGroup
            onClose={() => setShowNewGroup(false)}
            onSuccess={() => {
              refetch()
              setShowNewGroup(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Sidebar
