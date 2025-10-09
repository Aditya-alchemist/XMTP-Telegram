import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet, metaMask } from 'wagmi/connectors'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

// Get WalletConnect Project ID from environment
const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || ''

// Validate Project ID
if (!projectId) {
  console.warn('⚠️ WalletConnect Project ID is missing. Get one at https://cloud.walletconnect.com')
}

// Metadata for Web3Modal
const metadata = {
  name: 'XMTP Telegram',
  description: 'Decentralized messaging platform built with XMTP v3',
  url: process.env.REACT_APP_URL || 'https://xmtp-telegram.app',
  icons: ['https://xmtp-telegram.app/icon.png']
}

// Define supported chains
const chains = [mainnet, sepolia] as const

// Create Wagmi config with Web3Modal defaults
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
})

// Create Web3Modal instance
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - Enable analytics
  themeMode: 'dark', // Force dark mode to match Telegram UI
  themeVariables: {
    '--w3m-accent': '#0088cc', // Telegram blue
    '--w3m-border-radius-master': '12px',
    '--w3m-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  featuredWalletIds: [
    // MetaMask
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    // Rainbow
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
    // Coinbase
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
    // Trust Wallet
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
  ],
  defaultChain: mainnet,
  enableOnramp: true, // Enable on-ramp for buying crypto
})

// Export chains for use in other files
export { chains }

// Export individual chain objects
export { mainnet, sepolia }

// Helper function to get current chain
export const getCurrentChain = () => {
  return config.state.chainId || mainnet.id
}

// Helper function to check if connected
export const isConnected = () => {
  return config.state.status === 'connected'
}
