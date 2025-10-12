if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn
  console.warn = (...args) => {
    const message = args[0]?.toString() || ''
    if (
      message.includes('WalletConnect') ||
      message.includes('preloaded using link preload') ||
      message.includes('Restore will override')
    ) {
      return
    }
    originalWarn(...args)
  }
}


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Get root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

// Create root
const root = ReactDOM.createRoot(rootElement)

// Render app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Log app info in development
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 XMTP Telegram Clone')
  console.log('📦 Version:', process.env.REACT_APP_VERSION || '1.0.0')
  console.log('🔧 Environment:', process.env.REACT_APP_XMTP_ENV || 'production')
  console.log('⚡ Built with React + XMTP v3')
}

// Performance monitoring (optional)
if (process.env.NODE_ENV === 'production') {
  // Report web vitals
  const reportWebVitals = (metric: any) => {
    // You can send to analytics here
    console.log(metric)
  }

  // Import and use web-vitals if installed
  // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'
  // getCLS(reportWebVitals)
  // getFID(reportWebVitals)
  // getFCP(reportWebVitals)
  // getLCP(reportWebVitals)
  // getTTFB(reportWebVitals)
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  // You can send to error tracking service here
})

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  // You can send to error tracking service here
})
