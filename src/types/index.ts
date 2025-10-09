/**
 * Export all types
 */
export * from './xmtp.types'
export * from './message.types'
export * from './group.types'

/**
 * Common utility types
 */

/**
 * Make all properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make all properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * Async function type
 */
export type AsyncFunction<T = void> = () => Promise<T>

/**
 * Callback function type
 */
export type Callback<T = void> = (data: T) => void

/**
 * Error callback type
 */
export type ErrorCallback = (error: Error) => void

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean
  error: Error | null
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * API Response
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Form field
 */
export interface FormField<T = string> {
  value: T
  error?: string
  touched: boolean
  disabled?: boolean
}

/**
 * Select option
 */
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}
