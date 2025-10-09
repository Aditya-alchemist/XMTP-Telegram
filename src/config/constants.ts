// ============================================
// XMTP Configuration
// ============================================
export const XMTP_CONFIG = {
  ENV: 'dev' as 'dev' | 'production', // Use dev network
  APP_VERSION: 'xmtp-telegram-clone/1.0.0',
} as const

// ============================================
// Wallet Configuration
// ============================================
export const WALLET_CONFIG = {
  PROJECT_ID: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '',
  PROJECT_NAME: 'XMTP Telegram',
  PROJECT_DESCRIPTION: 'Decentralized messaging platform built with XMTP v3',
  PROJECT_URL: process.env.REACT_APP_URL || 'https://xmtp-telegram.app',
  PROJECT_ICON: 'https://xmtp-telegram.app/icon.png',
  
  // Supported wallet types
  SUPPORTED_WALLETS: [
    'MetaMask',
    'Coinbase Wallet',
    'WalletConnect',
    'Rainbow',
    'Trust Wallet',
  ] as const,
} as const

// ============================================
// Network Configuration
// ============================================
export const NETWORK_CONFIG = {
  // Supported chain IDs
  SUPPORTED_CHAINS: [1, 11155111] as const, // Mainnet (1), Sepolia (11155111)
  
  // Default chain
  DEFAULT_CHAIN: 1, // Mainnet
  
  // Chain names mapping
  CHAIN_NAMES: {
    1: 'Ethereum',
    11155111: 'Sepolia',
  } as const,
} as const

// ============================================
// UI Configuration
// ============================================
export const UI_CONFIG = {
  // Message limits
  MAX_MESSAGE_LENGTH: 4000,
  MAX_MESSAGE_DISPLAY_LENGTH: 500,
  
  // Pagination
  MESSAGES_PER_PAGE: 50,
  CONVERSATIONS_PER_PAGE: 30,
  
  // Timing
  TYPING_TIMEOUT: 3000, // 3 seconds
  DEBOUNCE_DELAY: 300, // 300ms
  MESSAGE_SEND_TIMEOUT: 10000, // 10 seconds
  
  // Layout
  SIDEBAR_WIDTH: 320,
  SIDEBAR_WIDTH_COLLAPSED: 80,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  
  // Avatar
  AVATAR_SIZES: {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  } as const,
} as const

// ============================================
// Message Configuration
// ============================================
export const MESSAGE_CONFIG = {
  // Message types
  TYPES: {
    TEXT: 'text',
    IMAGE: 'image',
    FILE: 'file',
    EMOJI: 'emoji',
    REPLY: 'reply',
    REACTION: 'reaction',
  } as const,
  
  // Message status
  STATUS: {
    SENDING: 'sending',
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
    FAILED: 'failed',
  } as const,
  
  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Supported file types
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
  ] as const,
} as const

// ============================================
// Group Chat Configuration
// ============================================
export const GROUP_CONFIG = {
  // Member limits
  MIN_MEMBERS: 2,
  MAX_MEMBERS: 250,
  
  // Name limits
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 50,
  
  // Description limits
  MAX_DESCRIPTION_LENGTH: 200,
  
  // Group settings
  DEFAULT_PERMISSIONS: {
    canAddMembers: true,
    canRemoveMembers: false,
    canUpdateMetadata: false,
  } as const,
} as const

// ============================================
// Conversation Types
// ============================================
export const CONVERSATION_TYPES = {
  DM: 'dm',
  GROUP: 'group',
} as const

// ============================================
// Date Formats
// ============================================
export const DATE_FORMATS = {
  MESSAGE_TIME: 'HH:mm', // 14:30
  MESSAGE_DATE: 'MMM dd', // Jan 15
  MESSAGE_DATE_FULL: 'MMM dd, yyyy', // Jan 15, 2025
  CONVERSATION_TIME: 'HH:mm', // 14:30
  CONVERSATION_DATE: 'MMM dd', // Jan 15
  FULL_DATETIME: 'MMM dd, yyyy HH:mm', // Jan 15, 2025 14:30
  RELATIVE_TIME: {
    today: 'HH:mm',
    yesterday: "'Yesterday'",
    week: 'EEEE', // Monday
    older: 'MMM dd, yyyy',
  },
} as const

// ============================================
// Local Storage Keys
// ============================================
export const STORAGE_KEYS = {
  THEME: 'xmtp-theme',
  WALLET_ADDRESS: 'xmtp-wallet-address',
  CONVERSATIONS: 'xmtp-conversations',
  LAST_ACTIVE: 'xmtp-last-active',
  DRAFT_MESSAGES: 'xmtp-draft-messages',
  SETTINGS: 'xmtp-settings',
  CONSENT_STATE: 'xmtp-consent-state',
} as const

// ============================================
// Animation Durations (in ms)
// ============================================
export const ANIMATION = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 800,
  },
  
  EASING: {
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    SPRING: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const

// ============================================
// Error Messages
// ============================================
export const ERROR_MESSAGES = {
  // Wallet errors
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
  WALLET_CONNECTION_FAILED: 'Failed to connect wallet. Please try again.',
  WALLET_DISCONNECTED: 'Wallet disconnected',
  
  // XMTP errors
  XMTP_CLIENT_ERROR: 'Failed to initialize XMTP client',
  XMTP_NOT_INITIALIZED: 'XMTP client is not initialized',
  
  // Message errors
  MESSAGE_SEND_ERROR: 'Failed to send message',
  MESSAGE_EMPTY: 'Message cannot be empty',
  MESSAGE_TOO_LONG: `Message is too long (max ${UI_CONFIG.MAX_MESSAGE_LENGTH} characters)`,
  MESSAGE_LOAD_ERROR: 'Failed to load messages',
  
  // Conversation errors
  CONVERSATION_LOAD_ERROR: 'Failed to load conversations',
  CONVERSATION_CREATE_ERROR: 'Failed to create conversation',
  CONVERSATION_NOT_FOUND: 'Conversation not found',
  
  // Group errors
  GROUP_CREATE_ERROR: 'Failed to create group',
  GROUP_UPDATE_ERROR: 'Failed to update group',
  GROUP_ADD_MEMBER_ERROR: 'Failed to add member',
  GROUP_REMOVE_MEMBER_ERROR: 'Failed to remove member',
  GROUP_LEAVE_ERROR: 'Failed to leave group',
  GROUP_MIN_MEMBERS: `Group must have at least ${GROUP_CONFIG.MIN_MEMBERS} members`,
  GROUP_MAX_MEMBERS: `Group cannot have more than ${GROUP_CONFIG.MAX_MEMBERS} members`,
  
  // Address errors
  INVALID_ADDRESS: 'Invalid Ethereum address',
  INVALID_ENS_NAME: 'Invalid ENS name',
  
  // File errors
  FILE_TOO_LARGE: 'File is too large',
  FILE_TYPE_NOT_SUPPORTED: 'File type not supported',
  
  // Network errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  
  // General errors
  UNKNOWN_ERROR: 'An unknown error occurred',
  FEATURE_NOT_AVAILABLE: 'This feature is not available yet',
} as const

// ============================================
// Success Messages
// ============================================
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  MESSAGE_SENT: 'Message sent',
  GROUP_CREATED: 'Group created successfully',
  GROUP_UPDATED: 'Group updated',
  MEMBER_ADDED: 'Member added',
  MEMBER_REMOVED: 'Member removed',
  SETTINGS_SAVED: 'Settings saved',
} as const

// ============================================
// Consent States (XMTP)
// ============================================
export const CONSENT_STATE = {
  ALLOWED: 'allowed',
  DENIED: 'denied',
  UNKNOWN: 'unknown',
} as const

// ============================================
// App Routes
// ============================================
export const ROUTES = {
  HOME: '/',
  CHAT: '/chat/:conversationId',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  GROUP_INFO: '/group/:groupId',
} as const

// ============================================
// Feature Flags
// ============================================
export const FEATURES = {
  ENABLE_REACTIONS: true,
  ENABLE_REPLIES: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_VOICE_MESSAGES: false, // Future feature
  ENABLE_VIDEO_MESSAGES: false, // Future feature
  ENABLE_GROUP_CALLS: false, // Future feature
  ENABLE_READ_RECEIPTS: true,
  ENABLE_TYPING_INDICATORS: true,
} as const

// ============================================
// Regex Patterns
// ============================================
export const REGEX = {
  ETH_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  ENS_NAME: /^[a-z0-9-]+\.eth$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const

// ============================================
// Type Exports
// ============================================
export type ConversationType = typeof CONVERSATION_TYPES[keyof typeof CONVERSATION_TYPES]
export type MessageType = typeof MESSAGE_CONFIG.TYPES[keyof typeof MESSAGE_CONFIG.TYPES]
export type MessageStatus = typeof MESSAGE_CONFIG.STATUS[keyof typeof MESSAGE_CONFIG.STATUS]
export type ConsentState = typeof CONSENT_STATE[keyof typeof CONSENT_STATE]
