import { useState, useEffect, useCallback } from 'react'
import type { Conversation } from '@xmtp/browser-sdk'
import { useXMTPClient } from './useXMTPClient'
import toast from 'react-hot-toast'
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

  const syncConversations = useCallback(async () => {
    if (!client) return

    try {
      await client.conversations.sync()
    } catch (err) {
      console.error('Error syncing conversations:', err)
    }
  }, [client])

  const fetchConversations = useCallback(async () => {
    if (!client || !isConnected) {
      setConversations([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await syncConversations()
      const allConversations = await client.conversations.list()
      
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
    } catch (err) {
      console.error('Error fetching conversations:', err)
      const error = err instanceof Error ? err : new Error(ERROR_MESSAGES.CONVERSATION_LOAD_ERROR)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [client, isConnected, syncConversations])

  const refetch = useCallback(async () => {
    await fetchConversations()
  }, [fetchConversations])

  useEffect(() => {
    if (isConnected && client) {
      fetchConversations()
    }
  }, [isConnected, client, fetchConversations])

  useEffect(() => {
    const handleMessageSent = () => {
      refetch()
    }

    const handleNewConversation = () => {
      refetch()
    }

    window.addEventListener('xmtp-message-sent', handleMessageSent)
    window.addEventListener('xmtp-new-conversation', handleNewConversation)

    const pollInterval = setInterval(() => {
      if (isConnected && client && !isLoading) {
        refetch()
      }
    }, 10000)

    return () => {
      window.removeEventListener('xmtp-message-sent', handleMessageSent)
      window.removeEventListener('xmtp-new-conversation', handleNewConversation)
      clearInterval(pollInterval)
    }
  }, [refetch, isConnected, client, isLoading])

  return {
    conversations,
    isLoading,
    error,
    refetch,
    syncConversations,
  }
}

export default useConversations
