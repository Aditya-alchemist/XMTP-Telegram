import { useState, useEffect, useCallback } from 'react'
import type { Conversation, DecodedMessage } from '@xmtp/browser-sdk'
import toast from 'react-hot-toast'
import { ERROR_MESSAGES, SUCCESS_MESSAGES, UI_CONFIG } from '../config/constants'

interface UseMessagesReturn {
  messages: DecodedMessage[]
  isLoading: boolean
  isSending: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  sendOptimistic: (content: string) => void
  syncMessages: () => Promise<void>
  refetch: () => Promise<void>
}

/**
 * Hook to manage messages in a conversation
 * Handles sending, receiving, and syncing messages
 */
export const useMessages = (conversation: Conversation | null): UseMessagesReturn => {
  const [messages, setMessages] = useState<DecodedMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Sync messages from network
  const syncMessages = useCallback(async () => {
    if (!conversation) return

    try {
      console.log('Syncing messages...')
      await conversation.sync()
      console.log('Messages synced')
    } catch (err) {
      console.error('Error syncing messages:', err)
      throw err
    }
  }, [conversation])

  // Fetch messages from conversation
  const fetchMessages = useCallback(async () => {
    if (!conversation) {
      setMessages([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Sync first to get latest messages
      await syncMessages()

      // List all messages
      const conversationMessages = await conversation.messages()
      
      console.log(`Loaded ${conversationMessages.length} messages`)
      
      // Sort by sent time (oldest first for chat display)
      // Note: XMTP v3 uses sentAtNs (nanoseconds timestamp)
      const sortedMessages = conversationMessages.sort((a, b) => {
        const aTime = Number(a.sentAtNs) / 1_000_000 // Convert nanoseconds to milliseconds
        const bTime = Number(b.sentAtNs) / 1_000_000
        return aTime - bTime
      })

      setMessages(sortedMessages)
    } catch (err) {
      console.error('Error fetching messages:', err)
      const error = err instanceof Error ? err : new Error(ERROR_MESSAGES.MESSAGE_LOAD_ERROR)
      setError(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [conversation, syncMessages])

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!conversation) {
      toast.error(ERROR_MESSAGES.XMTP_NOT_INITIALIZED)
      return
    }

    if (!content.trim()) {
      toast.error(ERROR_MESSAGES.MESSAGE_EMPTY)
      return
    }

    if (content.length > UI_CONFIG.MAX_MESSAGE_LENGTH) {
      toast.error(ERROR_MESSAGES.MESSAGE_TOO_LONG)
      return
    }

    setIsSending(true)

    try {
      // Send message to network
      await conversation.send(content)
      
      console.log('Message sent successfully')
      
      // Refetch messages to include the new one
      await fetchMessages()
      
      toast.success(SUCCESS_MESSAGES.MESSAGE_SENT)
    } catch (err) {
      console.error('Error sending message:', err)
      toast.error(ERROR_MESSAGES.MESSAGE_SEND_ERROR)
      throw err
    } finally {
      setIsSending(false)
    }
  }, [conversation, fetchMessages])

  // Send optimistic message (immediate UI update)
  const sendOptimistic = useCallback((content: string) => {
    if (!conversation) return

    try {
      // Send to local DB immediately
      conversation.sendOptimistic(content)
      
      // Refetch to show the optimistic message
      fetchMessages()
    } catch (err) {
      console.error('Error sending optimistic message:', err)
      toast.error(ERROR_MESSAGES.MESSAGE_SEND_ERROR)
    }
  }, [conversation, fetchMessages])

  // Refetch messages
  const refetch = useCallback(async () => {
    await fetchMessages()
  }, [fetchMessages])

  // Load messages when conversation changes
  useEffect(() => {
    if (conversation) {
      fetchMessages()
    } else {
      setMessages([])
    }
  }, [conversation, fetchMessages])

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    sendOptimistic,
    syncMessages,
    refetch,
  }
}

export default useMessages
