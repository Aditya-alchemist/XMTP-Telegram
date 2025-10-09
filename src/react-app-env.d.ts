/// <reference types="react-scripts" />

/**
 * Type definitions for environment variables
 */
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    REACT_APP_WALLETCONNECT_PROJECT_ID: string
    REACT_APP_XMTP_ENV: 'dev' | 'production'
    REACT_APP_NAME: string
    REACT_APP_VERSION: string
    REACT_APP_URL: string
    REACT_APP_ENABLE_ANALYTICS?: string
  }
}

/**
 * Module declarations for imports
 */
declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >
  const src: string
  export default src
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { [key: string]: string }
  export default classes
}

/**
 * Window interface extensions
 */
interface Window {
  ethereum?: {
    isMetaMask?: boolean
    request: (args: { method: string; params?: any[] }) => Promise<any>
    on: (event: string, handler: (...args: any[]) => void) => void
    removeListener: (event: string, handler: (...args: any[]) => void) => void
  }
}

/**
 * Vite-specific declarations (if using Vite instead of CRA)
 */
interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_PROJECT_ID: string
  readonly VITE_XMTP_ENV: 'dev' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly hot?: {
    accept: (cb?: () => void) => void
  }
}

/**
 * Global type augmentations
 */
declare global {
  /**
   * XMTP types
   */
  type XMTPEnvironment = 'dev' | 'production'
  
  /**
   * Utility types
   */
  type Nullable<T> = T | null
  type Optional<T> = T | undefined
  type MaybePromise<T> = T | Promise<T>
}

export {}
