import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import App from './App'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { config } from './config/wagmi'
import { XMTPProvider } from './contexts/XMTPContext'
import { Toaster } from 'react-hot-toast'

// Suppress WalletConnect warnings in development
if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    if (
      message.includes('WalletConnect') ||
      message.includes('preloaded using link preload') ||
      message.includes('Restore will override')
    ) {
      return
    }
    originalWarn(...args)
  }
}

// Create Query Client
const queryClient = new QueryClient()

// Create Web3Modal
const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'ff049f17-f9f3-4c91-b433-4cec39eb1836'

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#0088cc',
    '--w3m-border-radius-master': '8px',
  },
})

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('Connection interrupted') ||
    event.reason?.message?.includes('WebSocket')
  ) {
    event.preventDefault()
  }
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XMTPProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#2b2f36',
                color: '#e1e3e6',
                border: '1px solid #404449',
              },
              success: {
                iconTheme: {
                  primary: '#64b5f6',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef5350',
                  secondary: '#fff',
                },
              },
            }}
          />
        </XMTPProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
