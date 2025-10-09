import React from 'react'
import { motion } from 'framer-motion'

interface BadgeProps {
  count: number
  max?: number
  variant?: 'primary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Badge component for unread counts
 */
const Badge: React.FC<BadgeProps> = ({
  count,
  max = 99,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  // Don't render if count is 0
  if (count <= 0) return null

  // Display count with max limit
  const displayCount = count > max ? `${max}+` : count.toString()

  // Variant styles
  const variantClasses = {
    primary: 'bg-telegram-blue',
    success: 'bg-telegram-online',
    danger: 'bg-red-500',
    warning: 'bg-yellow-500',
  }

  // Size styles
  const sizeClasses = {
    sm: 'min-w-[16px] h-4 text-[10px] px-1',
    md: 'min-w-[20px] h-5 text-xs px-1.5',
    lg: 'min-w-[24px] h-6 text-sm px-2',
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        text-white font-semibold
        shadow-lg
        ${className}
      `}
    >
      {displayCount}
    </motion.div>
  )
}

export default Badge
