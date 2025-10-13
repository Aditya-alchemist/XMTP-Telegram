import React from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { config } from './config/wagmi'
import { XMTPProvider } from './contexts/XMTPContext'
import AppLayout from './components/layout/AppLayout'
import './styles/index.css'
import './styles/telegram.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

/**
 * Root App Component
 */
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XMTPProvider>
          {/* Main Application */}
          <div className="h-screen w-screen overflow-hidden bg-telegram-bg">
            <AppLayout />
          </div>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#17212b',
                color: '#fff',
                border: '1px solid #2b5278',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#0088cc',
                  secondary: '#fff',
                },
                style: {
                  border: '1px solid #0088cc',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  border: '1px solid #ef4444',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#0088cc',
                  secondary: '#fff',
                },
              },
            }}
          />
        </XMTPProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App