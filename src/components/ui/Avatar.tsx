import React from 'react'
import { User, Users } from 'lucide-react'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isGroup?: boolean
  isOnline?: boolean
  className?: string
}

/**
 * Avatar component for users and groups
 */
const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  isGroup = false,
  isOnline = false,
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  }

  // Get initials from name
  const getInitials = (): string => {
    if (!name) return '?'
    
    const words = name.trim().split(' ')
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase()
    }
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  // Generate color based on name
  const getColorClass = (): string => {
    if (isGroup) return 'bg-telegram-accent'
    
    const colors = [
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-green-500 to-emerald-500',
      'bg-gradient-to-br from-orange-500 to-red-500',
      'bg-gradient-to-br from-indigo-500 to-purple-500',
      'bg-gradient-to-br from-yellow-500 to-orange-500',
    ]
    
    const index = name ? name.charCodeAt(0) % colors.length : 0
    return colors[index]
  }

  // Online indicator size
  const indicatorSize = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
  }

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {src ? (
        // Image Avatar
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={`${sizeClasses[size]} rounded-full object-cover shadow-telegram`}
        />
      ) : (
        // Initials/Icon Avatar
        <div
          className={`
            ${sizeClasses[size]}
            ${getColorClass()}
            rounded-full flex items-center justify-center
            font-semibold text-white shadow-telegram
          `}
        >
          {isGroup ? (
            <Users className={size === 'xs' || size === 'sm' ? 'w-3 h-3' : 'w-5 h-5'} />
          ) : name ? (
            getInitials()
          ) : (
            <User className={size === 'xs' || size === 'sm' ? 'w-3 h-3' : 'w-5 h-5'} />
          )}
        </div>
      )}

      {/* Online Indicator */}
      {isOnline && (
        <div
          className={`
            absolute bottom-0 right-0
            ${indicatorSize[size]}
            rounded-full bg-telegram-online
            border-2 border-telegram-sidebar
          `}
        />
      )}
    </div>
  )
}

export default Avatar
