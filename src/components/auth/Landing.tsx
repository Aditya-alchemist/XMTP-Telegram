import React from 'react'
import { useAccount } from 'wagmi'
import { useNavigate } from 'react-router-dom'
import WalletConnect from './WalletConnect'
import { motion } from 'framer-motion'
import { Shield, Lock, Users, Zap, Globe, MessageCircle } from 'lucide-react'

/**
 * Landing page - shown before wallet connection
 * Displays app features and wallet connection button
 */
const Landing: React.FC = () => {
  const { isConnected } = useAccount()
  const navigate = useNavigate()

  // Redirect if already connected
  React.useEffect(() => {
    if (isConnected) {
      navigate('/')
    }
  }, [isConnected, navigate])

  const features = [
    {
      icon: Shield,
      title: 'End-to-End Encrypted',
      description: 'Military-grade encryption powered by XMTP protocol',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Lock,
      title: 'Wallet Authentication',
      description: 'No phone numbers, no emails - just your wallet',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Group Chats',
      description: 'Create groups with up to 250 members',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Instant Messaging',
      description: 'Real-time message delivery with WebSockets',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Globe,
      title: 'Decentralized',
      description: 'No central servers, your data stays yours',
      color: 'from-red-500 to-rose-500',
    },
    {
      icon: MessageCircle,
      title: 'Rich Features',
      description: 'Emojis, reactions, file sharing and more',
      color: 'from-indigo-500 to-purple-500',
    },
  ]

  return (
    <div className="min-h-screen w-full bg-telegram-bg overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-telegram-blue to-telegram-lightBlue
                     flex items-center justify-center shadow-2xl"
          >
            <MessageCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            <span className="gradient-text">XMTP Telegram</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-telegram-gray mb-8 max-w-2xl mx-auto"
          >
            Secure, decentralized messaging for the Web3 era
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <WalletConnect />
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-6 mt-8 text-sm text-telegram-gray"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-telegram-online" />
              <span>Audited by NCC Group</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-telegram-online" />
              <span>MLS Encryption</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card p-6 cursor-pointer"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color}
                            flex items-center justify-center mb-4 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-telegram-text mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-telegram-gray text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="card p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-telegram-blue mb-2">
                1M+
              </div>
              <div className="text-telegram-gray">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-telegram-blue mb-2">
                10M+
              </div>
              <div className="text-telegram-gray">Messages Sent</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-telegram-blue mb-2">
                100%
              </div>
              <div className="text-telegram-gray">Private & Secure</div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center mt-12 text-telegram-gray text-sm"
        >
          <p>
            Built with{' '}
            <span className="text-red-500">❤️</span>
            {' '}using XMTP v3
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a href="#" className="hover:text-telegram-blue transition-colors">
              Documentation
            </a>
            <span>•</span>
            <a href="#" className="hover:text-telegram-blue transition-colors">
              GitHub
            </a>
            <span>•</span>
            <a href="#" className="hover:text-telegram-blue transition-colors">
              Community
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Landing
