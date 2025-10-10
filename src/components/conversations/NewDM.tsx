import React, { useState } from 'react'
import { X, Send, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useXMTPClient } from '../../hooks/useXMTPClient'
import toast from 'react-hot-toast'
import { ERROR_MESSAGES, REGEX } from '../../config/constants'

interface NewDMProps {
  onClose: () => void
  onSuccess?: () => void
}

const NewDM: React.FC<NewDMProps> = ({ onClose, onSuccess }) => {
  const { client } = useXMTPClient()
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validateAddress = (addr: string): boolean => {
    if (!addr.trim()) {
      setError('Address is required')
      return false
    }

    if (!REGEX.ETH_ADDRESS.test(addr)) {
      setError('Invalid Ethereum address')
      return false
    }

    setError('')
    return true
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setAddress(value)
    if (value && !REGEX.ETH_ADDRESS.test(value)) {
      setError('Invalid Ethereum address format')
    } else {
      setError('')
    }
  }

  const handleCreateDM = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateAddress(address)) return

    if (!client) {
      toast.error(ERROR_MESSAGES.XMTP_NOT_INITIALIZED)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      console.log('🔄 Creating DM with address:', address)

      // Check if address can receive messages
      const canMessageResult = await client.canMessage([
        {
          identifier: address.toLowerCase(),
          identifierKind: 'Ethereum' as const,
        }
      ])
      
      console.log('Can message result:', canMessageResult)
      
      if (!canMessageResult || canMessageResult.size === 0) {
        toast.error('Could not verify if address is on XMTP')
        setIsLoading(false)
        return
      }

      const isReachable = Array.from(canMessageResult.values())[0]

      if (!isReachable) {
        toast.error('This address is not registered on XMTP. Ask them to connect first!')
        setError('Address not reachable on XMTP network')
        setIsLoading(false)
        return
      }

      // Get inbox ID
      const inboxId = await client.findInboxIdByIdentifier({
        identifier: address.toLowerCase(),
        identifierKind: 'Ethereum' as const,
      })

      if (!inboxId) {
        toast.error('Could not find inbox for this address')
        setIsLoading(false)
        return
      }

      console.log('📬 Found inbox ID:', inboxId)

      // ✅ CORRECT METHOD: Use newDm (not newConversation)
      const dm = await client.conversations.newDm(inboxId)

      console.log('✅ DM created:', {
        id: dm.id,
        createdAt: dm.createdAtNs
      })

      toast.success('Chat started!')

      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('❌ Error creating DM:', err)
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.CONVERSATION_CREATE_ERROR
      toast.error(errorMsg)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="modal-content p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-telegram-text">New Chat</h2>
          <button onClick={onClose} className="btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateDM} className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-telegram-text mb-2">
              Ethereum Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="0x..."
              disabled={isLoading}
              className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs mt-2">{error}</p>
            )}
            <p className="text-telegram-grayDark text-xs mt-2">
              Enter the Ethereum address of the person you want to chat with
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !!error || !address.trim()}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Start Chat</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default NewDM
