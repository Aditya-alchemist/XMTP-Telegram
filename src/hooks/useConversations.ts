import { useState, useEffect, useCallback, useRef } from 'react'
import type { Conversation } from '@xmtp/browser-sdk'
import { useXMTPClient } from './useXMTPClient'
import { ERROR_MESSAGES } from '../config/constants'

interface UseConversationsReturn {
  conversations: Conversation[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  syncConversations: () => Promise<void>
}

export const useConversations = (): UseConversationsReturn => {
  const { client, isConnected } = useXMTPClient()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const isSyncing = useRef(false)
  const hasInitialized = useRef(false)

  const syncConversations = useCallback(async () => {
    if (!client || isSyncing.current) return

    try {
      isSyncing.current = true
      await client.conversations.sync()
    } catch (err) {
      console.error('Error syncing conversations:', err)
    } finally {
      isSyncing.current = false
    }
  }, [client])

  const fetchConversations = useCallback(async (showLoading = true) => {
    if (!client || !isConnected) {
      setConversations([])
      hasInitialized.current = false
      return
    }

    if (showLoading) setIsLoading(true)
    setError(null)

    try {
      await syncConversations()
      const allConversations = await client.conversations.list()
      
      console.log(`✅ Loaded ${allConversations.length} conversations`)
      
      const sortedConversations = await Promise.all(
        allConversations.map(async (conv) => {
          try {
            const lastMsg = await conv.lastMessage()
            return {
              conv,
              time: lastMsg
                ? Number(BigInt(lastMsg.sentAtNs) / BigInt(1e6))
                : conv.createdAtNs
                  ? Number(BigInt(conv.createdAtNs) / BigInt(1e6))
                  : 0,
            }
          } catch {
            return { conv, time: 0 }
          }
        })
      ).then(convsWithTime =>
        convsWithTime
          .sort((a, b) => b.time - a.time)
          .map(item => item.conv)
      )

      setConversations(sortedConversations)
      hasInitialized.current = true
    } catch (err) {
      console.error('Error fetching conversations:', err)
      const error = err instanceof Error ? err : new Error(ERROR_MESSAGES.CONVERSATION_LOAD_ERROR)
      setError(error)
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }, [client, isConnected, syncConversations])

  const refetch = useCallback(async () => {
    await fetchConversations(false) // Silent refresh
  }, [fetchConversations])

  // CRITICAL: Load conversations when client becomes available
  useEffect(() => {
    if (isConnected && client) {
      console.log('🔄 XMTP client connected, loading conversations...')
      fetchConversations(true)
    } else {
      // Clear when disconnected
      console.log('❌ XMTP client disconnected, clearing conversations')
      setConversations([])
      hasInitialized.current = false
    }
  }, [isConnected, client, fetchConversations])

  // Event listeners and polling (only when connected)
  useEffect(() => {
    if (!isConnected || !client) return

    const handleMessageSent = () => {
      console.log('📤 Message sent event, refreshing...')
      refetch()
    }

    const handleNewConversation = () => {
      console.log('🆕 New conversation event, refreshing...')
      refetch()
    }

    window.addEventListener('xmtp-message-sent', handleMessageSent)
    window.addEventListener('xmtp-new-conversation', handleNewConversation)

    // Silent background refresh every 15 seconds
    const pollInterval = setInterval(() => {
      if (isConnected && client && !isSyncing.current && hasInitialized.current) {
        refetch()
      }
    }, 15000)

    return () => {
      window.removeEventListener('xmtp-message-sent', handleMessageSent)
      window.removeEventListener('xmtp-new-conversation', handleNewConversation)
      clearInterval(pollInterval)
    }
  }, [refetch, isConnected, client])

  return {
    conversations,
    isLoading,
    error,
    refetch,
    syncConversations,
  }
}

export default useConversations
