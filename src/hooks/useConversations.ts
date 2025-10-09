import { useState, useEffect, useCallback } from 'react'
import type { Client, Conversation } from '@xmtp/browser-sdk'
import { useXMTPClient } from './useXMTPClient'
import toast from 'react-hot-toast'
import { ERROR_MESSAGES, CONSENT_STATE } from '../config/constants'

interface UseConversationsReturn {
  conversations: Conversation[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  syncConversations: () => Promise<void>
}

/**
 * Hook to manage conversations list
 * Fetches and syncs all conversations (DMs and groups)
 */
export const useConversations = (): UseConversationsReturn => {
  const { client, isConnected } = useXMTPClient()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Sync conversations from network
  const syncConversations = useCallback(async () => {
    if (!client) return

    try {
      console.log('Syncing conversations...')
      await client.conversations.sync()
      console.log('Conversations synced')
    } catch (err) {
      console.error('Error syncing conversations:', err)
      throw err
    }
  }, [client])

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    if (!client || !isConnected) {
      setConversations([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Sync first to get latest conversations
      await syncConversations()

      // List all conversations (groups and DMs)
      const allConversations = await client.conversations.list()
      
      console.log(`Loaded ${allConversations.length} conversations`)
      
      // Sort by last message time (newest first)
      const sortedConversations = await Promise.all(
        allConversations.map(async (conv) => {
          const lastMsg = await conv.lastMessage?.();
          return {
            conv,
            time: lastMsg
              ? Number(BigInt(lastMsg.sentAtNs) / BigInt(1e6))
              : conv.createdAt
                ? conv.createdAt.getTime()
                : 0,
          };
        })
      ).then(convsWithTime =>
        convsWithTime
          .sort((a, b) => b.time - a.time)
          .map(item => item.conv)
      );

      setConversations(sortedConversations)
    } catch (err) {
      console.error('Error fetching conversations:', err)
      const error = err instanceof Error ? err : new Error(ERROR_MESSAGES.CONVERSATION_LOAD_ERROR)
      setError(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [client, isConnected, syncConversations])

  // Refetch conversations
  const refetch = useCallback(async () => {
    await fetchConversations()
  }, [fetchConversations])

  // Load conversations on mount and when client connects
  useEffect(() => {
    if (isConnected && client) {
      fetchConversations()
    }
  }, [isConnected, client, fetchConversations])

  return {
    conversations,
    isLoading,
    error,
    refetch,
    syncConversations,
  }
}

export default useConversations
