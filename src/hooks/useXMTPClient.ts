import { useXMTP } from '../contexts/XMTPContext'

/**
 * Hook to access XMTP client and connection state
 * This is a convenience hook that wraps the useXMTP context
 */
export const useXMTPClient = () => {
  const {
    client,
    isLoading,
    isInitializing,
    error,
    isConnected,
    inboxId,
    initializeClient,
    disconnectClient,
  } = useXMTP()

  return {
    client,
    isLoading,
    isInitializing,
    error,
    isConnected,
    inboxId,
    initializeClient,
    disconnectClient,
  }
}

// Export for convenience
export default useXMTPClient
