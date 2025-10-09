import type { Client, Conversation, DecodedMessage } from '@xmtp/browser-sdk'

/**
 * XMTP Client types
 */
export type XMTPClient = Client

/**
 * XMTP Conversation types
 */
export type XMTPConversation = Conversation

/**
 * XMTP Message types
 */
export type XMTPMessage = DecodedMessage

/**
 * Signer types
 */
export interface XMTPSigner {
  type: 'EOA'
  getIdentifier: () => {
    identifier: string
    identifierKind: 'Ethereum'
  }
  signMessage: (message: string) => Promise<Uint8Array>
}

/**
 * Identifier types
 */
export interface Identifier {
  identifier: string
  identifierKind: 'Ethereum' | 'ENS'
}

/**
 * XMTP Environment
 */
export type XMTPEnvironment = 'dev' | 'production'

/**
 * Consent state
 */
export type ConsentState = 'allowed' | 'denied' | 'unknown'

/**
 * Conversation type
 */
export type ConversationType = 'dm' | 'group'

/**
 * XMTP Client config
 */
export interface XMTPClientConfig {
  env: XMTPEnvironment
  appVersion?: string
  dbPath?: string
  loggingLevel?: 'off' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
  structuredLogging?: boolean
  performanceLogging?: boolean
}

/**
 * Inbox information
 */
export interface InboxInfo {
  inboxId: string
  identifier: string
  identifierKind: 'Ethereum' | 'ENS'
}

/**
 * Message content types
 */
export type MessageContent = string | object

/**
 * Stream message callback
 */
export type MessageCallback = (message: XMTPMessage) => void

/**
 * Conversation metadata
 */
export interface ConversationMetadata {
  conversationId: string
  createdAt: Date
  lastMessageAt?: Date
  peerAddress?: string
}

/**
 * XMTP Error types
 */
export interface XMTPError {
  code: string
  message: string
  details?: unknown
}
