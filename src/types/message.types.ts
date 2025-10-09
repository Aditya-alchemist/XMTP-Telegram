/**
 * Message status
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

/**
 * Message type
 */
export type MessageType = 'text' | 'image' | 'file' | 'emoji' | 'reply' | 'reaction'

/**
 * Message interface
 */
export interface Message {
  id: string
  content: string
  senderInboxId: string
  sentAtNs: bigint | string
  status?: MessageStatus
  type?: MessageType
}

/**
 * Message with metadata
 */
export interface MessageWithMetadata extends Message {
  isOwnMessage: boolean
  senderName?: string
  senderAddress?: string
  replyTo?: string
  reactions?: MessageReaction[]
  attachments?: MessageAttachment[]
}

/**
 * Message reaction
 */
export interface MessageReaction {
  emoji: string
  senderInboxId: string
  timestamp: number
}

/**
 * Message attachment
 */
export interface MessageAttachment {
  id: string
  type: 'image' | 'file' | 'video' | 'audio'
  name: string
  size: number
  url: string
  mimeType?: string
}

/**
 * Message draft
 */
export interface MessageDraft {
  conversationId: string
  content: string
  timestamp: number
}

/**
 * Message filter options
 */
export interface MessageFilterOptions {
  limit?: number
  startTime?: Date
  endTime?: Date
  senderInboxId?: string
}

/**
 * Message send options
 */
export interface MessageSendOptions {
  content: string
  type?: MessageType
  replyTo?: string
  attachments?: MessageAttachment[]
}

/**
 * Typing indicator
 */
export interface TypingIndicator {
  conversationId: string
  senderInboxId: string
  isTyping: boolean
  timestamp: number
}

/**
 * Message notification
 */
export interface MessageNotification {
  messageId: string
  conversationId: string
  senderInboxId: string
  content: string
  timestamp: number
  isRead: boolean
}

/**
 * Message search result
 */
export interface MessageSearchResult {
  message: Message
  conversationId: string
  matches: string[]
  score: number
}
