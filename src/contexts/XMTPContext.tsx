import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { Client, type Signer } from '@xmtp/browser-sdk'
import { useAccount, useWalletClient } from 'wagmi'
import toast from 'react-hot-toast'
import { XMTP_CONFIG, ERROR_MESSAGES } from '../config/constants'

// ============================================
// Types
// ============================================

interface XMTPContextType {
  client: Client | null
  isLoading: boolean
  isInitializing: boolean
  error: Error | null
  isConnected: boolean
  inboxId: string | null
  initializeClient: () => Promise<void>
  disconnectClient: () => void
}

interface XMTPProviderProps {
  children: ReactNode
}

// ============================================
// Context Creation
// ============================================
const XMTPContext = createContext<XMTPContextType | undefined>(undefined)

// ============================================
// Provider Component
// ============================================
export const XMTPProvider: React.FC<XMTPProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [inboxId, setInboxId] = useState<string | null>(null)
  const initRef = useRef(false) // Prevent double initialization

  const { address, isConnected: isWalletConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  // ============================================
  // Create XMTP Signer from Wallet
  // ============================================
  const createXMTPSigner = useCallback(async (): Promise<Signer | null> => {
    if (!walletClient || !address) {
      console.error('Wallet client or address not available')
      return null
    }

    try {
      const xmtpSigner: Signer = {
        type: 'EOA' as const,
        
        getIdentifier: () => ({
          identifier: address.toLowerCase(),
          identifierKind: 'Ethereum' as const,
        }),

        signMessage: async (message: string): Promise<Uint8Array> => {
          try {
            const signature = await walletClient.signMessage({
              account: address as `0x${string}`,
              message: message,
            })
            
            const signatureBytes = new Uint8Array(
              signature.slice(2).match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
            )
            
            return signatureBytes
          } catch (err) {
            console.error('Error signing message:', err)
            throw new Error('Failed to sign message')
          }
        },
      }

      return xmtpSigner
    } catch (err) {
      console.error('Error creating XMTP signer:', err)
      return null
    }
  }, [walletClient, address])

  // ============================================
  // Initialize XMTP Client
  // ============================================
  const initializeClient = useCallback(async () => {
    if (!isWalletConnected || !address) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    if (client || initRef.current) {
      console.log('XMTP client already initialized or initializing')
      return
    }

    initRef.current = true
    setIsInitializing(true)
    setIsLoading(true)
    setError(null)

    try {
      const signer = await createXMTPSigner()
      
      if (!signer) {
        throw new Error('Failed to create XMTP signer')
      }

      console.log('🔄 Creating XMTP v3 client...')
      
      // Use address-based encryption key for persistence
      const dbKey = `xmtp-${address.toLowerCase()}`
      const encryptionKey = new TextEncoder().encode(dbKey).slice(0, 32)
      
      const xmtpClient = await Client.create(signer, {
        env: XMTP_CONFIG.ENV,
        appVersion: XMTP_CONFIG.APP_VERSION,
        dbEncryptionKey: encryptionKey,
      })

      console.log('✅ XMTP client created successfully!')
      
      const userInboxId = xmtpClient.inboxId
      console.log('📬 Inbox ID:', userInboxId)

      setClient(xmtpClient)
      setInboxId(userInboxId ?? null)
      
      toast.success('Connected to XMTP!')
    } catch (err: any) {
      console.error('❌ Error initializing XMTP client:', err)
      
      if (err.message?.includes('already registered')) {
        toast.error('Installation limit reached. Please use the same browser.', { duration: 5000 })
      } else {
        toast.error(err.message || ERROR_MESSAGES.XMTP_CLIENT_ERROR)
      }
      
      setError(err instanceof Error ? err : new Error(ERROR_MESSAGES.XMTP_CLIENT_ERROR))
    } finally {
      setIsLoading(false)
      setIsInitializing(false)
      initRef.current = false
    }
  }, [isWalletConnected, address, client, createXMTPSigner])

  // ============================================
  // Disconnect XMTP Client
  // ============================================
  const disconnectClient = useCallback(() => {
    if (client) {
      try {
        setClient(null)
        setInboxId(null)
        setError(null)
        initRef.current = false
        
        console.log('XMTP client disconnected')
      } catch (err) {
        console.error('Error disconnecting XMTP client:', err)
      }
    }
  }, [client])

  // ============================================
  // Auto-initialize on wallet connection
  // ============================================
  useEffect(() => {
    if (isWalletConnected && address && walletClient && !client && !isInitializing) {
      console.log('💼 Wallet connected, initializing XMTP...')
      initializeClient()
    }
  }, [isWalletConnected, address, walletClient, client, isInitializing, initializeClient])

  // ============================================
  // Auto-disconnect on wallet disconnection
  // ============================================
  useEffect(() => {
    if (!isWalletConnected && client) {
      console.log('👋 Wallet disconnected, cleaning up XMTP...')
      disconnectClient()
    }
  }, [isWalletConnected, client, disconnectClient])

  // ============================================
  // Context Value
  // ============================================
  const value: XMTPContextType = {
    client,
    isLoading,
    isInitializing,
    error,
    isConnected: !!client && isWalletConnected,
    inboxId,
    initializeClient,
    disconnectClient,
  }

  return <XMTPContext.Provider value={value}>{children}</XMTPContext.Provider>
}

// ============================================
// Custom Hook to use XMTP Context
// ============================================
export const useXMTP = (): XMTPContextType => {
  const context = useContext(XMTPContext)
  
  if (context === undefined) {
    throw new Error('useXMTP must be used within an XMTPProvider')
  }
  
  return context
}

// ============================================
// Helper Hook - Check if XMTP is ready
// ============================================
export const useXMTPReady = (): boolean => {
  const { client, isConnected } = useXMTP()
  return !!(client && isConnected)
}

// ============================================
// Helper Hook - Get Inbox ID
// ============================================
export const useInboxId = (): string | null => {
  const { inboxId } = useXMTP()
  return inboxId
}

// ============================================
// Helper Hook - Get XMTP Client (Alias)
// ============================================
export const useXMTPClient = () => {
  return useXMTP()
}

// Export types
export type { XMTPContextType, XMTPProviderProps }
