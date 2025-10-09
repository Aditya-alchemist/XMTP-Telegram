import React from 'react'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
  fullScreen?: boolean
  text?: string
}

/**
 * Loading spinner component
 */
const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'text-telegram-blue',
  className = '',
  fullScreen = false,
  text,
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const spinnerElement = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <Loader2 className={`${sizeClasses[size]} ${color} animate-spin`} />
      {text && (
        <p className="text-telegram-gray text-sm font-medium">{text}</p>
      )}
    </motion.div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-telegram-bg flex items-center justify-center z-50">
        {spinnerElement}
      </div>
    )
  }

  return spinnerElement
}

export default Spinner
