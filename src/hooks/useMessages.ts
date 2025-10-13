import { useState, useEffect, useCallback } from 'react'
import type { Conversation, DecodedMessage } from '@xmtp/browser-sdk'
import { ERROR_MESSAGES, UI_CONFIG } from '../config/constants'

interface UseMessagesReturn {
  messages: DecodedMessage[]
  isLoading: boolean
  isSending: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  syncMessages: () => Promise<void>
  refetch: () => Promise<void>
}

export const useMessages = (conversation: Conversation | null): UseMessagesReturn => {
  const [messages, setMessages] = useState<DecodedMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const syncMessages = useCallback(async () => {
    if (!conversation) return

    try {
      await conversation.sync()
    } catch (err) {
      console.error('Error syncing messages:', err)
    }
  }, [conversation])

  const fetchMessages = useCallback(async () => {
    if (!conversation) {
      setMessages([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await syncMessages()
      const conversationMessages = await conversation.messages()
      
      const sortedMessages = conversationMessages.sort((a, b) => {
        const aTime = Number(a.sentAtNs) / 1_000_000
        const bTime = Number(b.sentAtNs) / 1_000_000
        return aTime - bTime
      })

      setMessages(sortedMessages)
    } catch (err) {
      console.error('Error fetching messages:', err)
      const error = err instanceof Error ? err : new Error(ERROR_MESSAGES.MESSAGE_LOAD_ERROR)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [conversation, syncMessages])

  const sendMessage = useCallback(async (content: string) => {
    if (!conversation) {
      throw new Error(ERROR_MESSAGES.XMTP_NOT_INITIALIZED)
    }

    if (!content.trim()) {
      throw new Error(ERROR_MESSAGES.MESSAGE_EMPTY)
    }

    if (content.length > UI_CONFIG.MAX_MESSAGE_LENGTH) {
      throw new Error(ERROR_MESSAGES.MESSAGE_TOO_LONG)
    }

    setIsSending(true)

    try {
      await conversation.send(content)
      await new Promise(resolve => setTimeout(resolve, 500))
      await fetchMessages()
      window.dispatchEvent(new Event('xmtp-message-sent'))
      
      // NO TOAST HERE - MessageInput handles it
    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    } finally {
      setIsSending(false)
    }
  }, [conversation, fetchMessages])

  const refetch = useCallback(async () => {
    await fetchMessages()
  }, [fetchMessages])

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
    syncMessages,
    refetch,
  }
}

export default useMessages
