import { REGEX } from '../config/constants'

/**
 * Validate Ethereum address format
 */
export const isValidEthereumAddress = (address: string): boolean => {
  return REGEX.ETH_ADDRESS.test(address)
}

/**
 * Validate ENS name format
 */
export const isValidENSName = (name: string): boolean => {
  return REGEX.ENS_NAME.test(name)
}

/**
 * Format Ethereum address for display (shortened)
 */
export const formatAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (!address) return ''
  if (address.length <= startChars + endChars) return address
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Format address with custom separator
 */
export const formatAddressCustom = (
  address: string,
  startChars: number = 6,
  endChars: number = 4,
  separator: string = '...'
): string => {
  if (!address) return ''
  if (address.length <= startChars + endChars) return address
  
  return `${address.slice(0, startChars)}${separator}${address.slice(-endChars)}`
}

/**
 * Get address checksum (basic version)
 */
export const toChecksumAddress = (address: string): string => {
  if (!isValidEthereumAddress(address)) return address
  
  // Simple lowercase for now (can be enhanced with proper checksum algorithm)
  return address.toLowerCase()
}

/**
 * Compare two addresses (case-insensitive)
 */
export const areAddressesEqual = (address1: string, address2: string): boolean => {
  if (!address1 || !address2) return false
  return address1.toLowerCase() === address2.toLowerCase()
}

/**
 * Get address color for avatar (deterministic)
 */
export const getAddressColor = (address: string): string => {
  const colors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-yellow-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-teal-500 to-cyan-500',
  ]
  
  if (!address) return colors[0]
  
  // Use address to pick a color deterministically
  const index = parseInt(address.slice(2, 4), 16) % colors.length
  return colors[index]
}

/**
 * Get initials from address
 */
export const getAddressInitials = (address: string): string => {
  if (!address || address.length < 4) return '??'
  return address.slice(2, 4).toUpperCase()
}

/**
 * Format inbox ID for display
 */
export const formatInboxId = (inboxId: string): string => {
  if (!inboxId) return ''
  if (inboxId.length <= 16) return inboxId
  
  return `${inboxId.slice(0, 8)}...${inboxId.slice(-6)}`
}

/**
 * Sanitize address input (remove spaces, convert to lowercase)
 */
export const sanitizeAddress = (address: string): string => {
  return address.trim().toLowerCase()
}

/**
 * Check if string is an address or ENS name
 */
export const getIdentifierType = (identifier: string): 'address' | 'ens' | 'unknown' => {
  if (isValidEthereumAddress(identifier)) {
    return 'address'
  } else if (isValidENSName(identifier)) {
    return 'ens'
  }
  return 'unknown'
}

/**
 * Create a display name from address or ENS
 */
export const createDisplayName = (identifier: string): string => {
  const type = getIdentifierType(identifier)
  
  if (type === 'ens') {
    return identifier
  } else if (type === 'address') {
    return formatAddress(identifier)
  }
  return identifier
}
