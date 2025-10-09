import { useEffect, useState, useCallback } from 'react'
import type { Conversation, DecodedMessage } from '@xmtp/browser-sdk'
import toast from 'react-hot-toast'

interface UseMessageStreamReturn {
  isStreaming: boolean
  error: Error | null
  startStream: () => Promise<void>
  stopStream: () => void
}

/**
 * Hook to stream real-time messages from a conversation
 * Updates automatically when new messages arrive
 */
export const useMessageStream = (
  conversation: Conversation | null,
  onMessage: (message: DecodedMessage) => void
): UseMessageStreamReturn => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [streamController, setStreamController] = useState<{ stop: () => void } | null>(null)

  // Start streaming messages
  const startStream = useCallback(async () => {
    if (!conversation || isStreaming) return

    try {
      console.log('Starting message stream...')
      setIsStreaming(true)
      setError(null)

      // Create message stream - FIXED: await the stream() method
      const messageStream = await conversation.stream()

      // Create controller for cleanup
      const controller = {
        stop: () => {
          // No-op, stream will be cleaned up by async iterator
        }
      }
      setStreamController(controller)

      // Listen for messages
      ;(async () => {
        try {
          for await (const message of messageStream) {
            console.log('New message received:', message)
            onMessage(message)

            // Show notification if window not focused
            if (document.hidden) {
              const senderInbox = message.senderInboxId.slice(0, 6)
              toast(`New message from ${senderInbox}...`, {
                icon: '💬',
              })
            }
          }
        } catch (err) {
          console.error('Stream error:', err)
          setError(err instanceof Error ? err : new Error('Stream failed'))
          setIsStreaming(false)
        }
      })()

      console.log('Message stream started')
    } catch (err) {
      console.error('Error starting message stream:', err)
      setError(err instanceof Error ? err : new Error('Failed to start stream'))
      setIsStreaming(false)
      toast.error('Failed to start message stream')
    }
  }, [conversation, isStreaming, onMessage])

  // Stop streaming
  const stopStream = useCallback(() => {
    if (streamController) {
      console.log('Stopping message stream...')
      streamController.stop()
      setStreamController(null)
      setIsStreaming(false)
    }
  }, [streamController])

  // Auto-start stream when conversation changes
  useEffect(() => {
    if (conversation) {
      startStream()
    }

    // Cleanup on unmount or conversation change
    return () => {
      stopStream()
    }
  }, [conversation])

  return {
    isStreaming,
    error,
    startStream,
    stopStream,
  }
}

export default useMessageStream
