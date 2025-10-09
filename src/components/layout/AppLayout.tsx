import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useXMTP } from '../../contexts/XMTPContext'
import Sidebar from './Sidebar'
import ChatContainer from './ChatContainer'
import { Loader2 } from 'lucide-react'
import type { Conversation } from '@xmtp/browser-sdk'

/**
 * Main application layout
 * Two-column design: Sidebar (conversations) + Chat Container (messages)
 */
const AppLayout: React.FC = () => {
  const { isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const { client, isLoading: isXMTPLoading, isConnected: isXMTPConnected } = useXMTP()
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Show wallet connect screen if not connected
  if (!isConnected) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-telegram-bg">
        <div className="text-center space-y-6 max-w-md px-4">
          {/* Logo/Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-text">
              XMTP Telegram
            </h1>
            <p className="text-telegram-gray text-lg">
              Decentralized messaging for Web3
            </p>
          </div>

          {/* Connect Button */}
          <button
            onClick={() => open()}
            className="btn-primary w-full max-w-xs mx-auto"
          >
            Connect Wallet
          </button>

          {/* Features */}
          <div className="space-y-3 pt-8">
            <div className="flex items-center gap-3 text-telegram-textSecondary">
              <div className="w-2 h-2 rounded-full bg-telegram-blue" />
              <span>End-to-end encrypted messaging</span>
            </div>
            <div className="flex items-center gap-3 text-telegram-textSecondary">
              <div className="w-2 h-2 rounded-full bg-telegram-blue" />
              <span>Wallet-based authentication</span>
            </div>
            <div className="flex items-center gap-3 text-telegram-textSecondary">
              <div className="w-2 h-2 rounded-full bg-telegram-blue" />
              <span>Group chats with up to 250 members</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading while XMTP initializes
  if (isXMTPLoading || !isXMTPConnected) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-telegram-bg">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-telegram-blue animate-spin mx-auto" />
          <div className="space-y-1">
            <p className="text-telegram-text font-medium">Initializing XMTP...</p>
            <p className="text-telegram-gray text-sm">Setting up secure messaging</p>
          </div>
        </div>
      </div>
    )
  }

  // Main app layout
  return (
    <div className="h-screen w-screen overflow-hidden bg-telegram-bg flex">
      {/* Sidebar - Conversation List */}
      <div
        className={`
          ${isSidebarOpen ? 'w-full md:w-96' : 'w-0'} 
          md:block
          transition-all duration-300 ease-in-out
          border-r border-telegram-border
          ${selectedConversation ? 'hidden md:block' : 'block'}
        `}
      >
        <Sidebar
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />
      </div>

      {/* Chat Container - Messages */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatContainer
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
        />
      </div>
    </div>
  )
}

export default AppLayout
