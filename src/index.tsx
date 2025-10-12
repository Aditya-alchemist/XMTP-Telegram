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

const queryClient = new QueryClient()
const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'ff049f17-f9f3-4c91-b433-4cec39eb1836'

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#0088cc',
  },
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
            position="top-center"
            toastOptions={{
              duration: 1500,
              style: {
                background: '#2b2f36',
                color: '#e1e3e6',
                border: '1px solid #64b5f6',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
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
                style: {
                  border: '1px solid #ef5350',
                },
              },
            }}
          />
        </XMTPProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
