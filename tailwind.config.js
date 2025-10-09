/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        telegram: {
          // Primary colors
          blue: '#0088cc',
          darkBlue: '#006699',
          lightBlue: '#00a2e8',
          
          // Background colors
          bg: '#0e1621',
          sidebar: '#17212b',
          chat: '#212d3b',
          header: '#17212b',
          
          // Message colors
          message: '#2b5278',
          messageReceived: '#1e2a38',
          messageSent: '#2b5278',
          
          // Text colors
          text: '#ffffff',
          textSecondary: '#b1b1b1',
          gray: '#8b96a0',
          grayDark: '#6d7883',
          
          // Status colors
          online: '#4cd964',
          typing: '#0088cc',
          
          // Accent colors
          accent: '#0088cc',
          hover: '#1a2632',
          active: '#2c3e50',
          
          // Border colors
          border: '#2c3744',
          divider: '#1a2632',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'xs': '0.75rem',     // 12px
        'sm': '0.875rem',    // 14px
        'base': '1rem',      // 16px
        'lg': '1.125rem',    // 18px
        'xl': '1.25rem',     // 20px
        '2xl': '1.5rem',     // 24px
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'telegram': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'message': '0 1px 3px rgba(0, 0, 0, 0.2)',
        'sidebar': 'inset -1px 0 0 rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'typing': 'typing 1.5s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideInRight: {
          '0%': { 
            transform: 'translateX(100%)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateX(0)', 
            opacity: '1' 
          },
        },
        slideInLeft: {
          '0%': { 
            transform: 'translateX(-100%)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateX(0)', 
            opacity: '1' 
          },
        },
        slideInUp: {
          '0%': { 
            transform: 'translateY(100%)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateY(0)', 
            opacity: '1' 
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { 
            transform: 'scale(0)', 
            opacity: '0' 
          },
          '50%': { 
            transform: 'scale(1.05)' 
          },
          '100%': { 
            transform: 'scale(1)', 
            opacity: '1' 
          },
        },
        typing: {
          '0%, 100%': { 
            opacity: '0.3' 
          },
          '50%': { 
            opacity: '1' 
          },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
