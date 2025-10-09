import React from 'react'
import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Wallet, Check, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Wallet connection component
 * Shows connection status and allows connecting/disconnecting
 */
const WalletConnect: React.FC = () => {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { open } = useWeb3Modal()

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Loading state
  if (isConnecting || isReconnecting) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        disabled
        className="btn-primary opacity-50 cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Connecting...</span>
        </div>
      </motion.button>
    )
  }

  // Connected state
  if (isConnected && address) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => open()}
        className="flex items-center gap-3 bg-telegram-sidebar hover:bg-telegram-hover
                 px-4 py-3 rounded-xl border border-telegram-border
                 transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-telegram-online" />
          <Wallet className="w-5 h-5 text-telegram-blue" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-telegram-text">
            {formatAddress(address)}
          </span>
          <span className="text-xs text-telegram-gray">Click to manage</span>
        </div>
        <Check className="w-4 h-4 text-telegram-online ml-auto" />
      </motion.button>
    )
  }

  // Disconnected state
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => open()}
      className="btn-primary"
    >
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
      </div>
    </motion.button>
  )
}

export default WalletConnect
