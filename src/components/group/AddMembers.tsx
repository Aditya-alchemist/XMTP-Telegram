import React, { useState } from 'react'
import { X, Plus, Loader2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Group } from '@xmtp/browser-sdk'
import { useGroupChat } from '../../hooks/useGroupChat'
import toast from 'react-hot-toast'
import { REGEX, GROUP_CONFIG } from '../../config/constants'

interface AddMembersProps {
  group: Group
  onClose: () => void
  onSuccess?: () => void
}

/**
 * Modal to add members to a group
 */
const AddMembers: React.FC<AddMembersProps> = ({ group, onClose, onSuccess }) => {
  const { addMembers, isLoading } = useGroupChat()
  const [memberAddress, setMemberAddress] = useState('')
  const [members, setMembers] = useState<string[]>([])
  const [error, setError] = useState('')

  // Validate address
  const isValidAddress = (addr: string): boolean => {
    return REGEX.ETH_ADDRESS.test(addr)
  }

  // Add member to list
  const handleAddMember = () => {
    const trimmedAddress = memberAddress.trim()

    if (!trimmedAddress) {
      toast.error('Please enter an address')
      return
    }

    if (!isValidAddress(trimmedAddress)) {
      toast.error('Invalid Ethereum address')
      return
    }

    if (members.includes(trimmedAddress)) {
      toast.error('Address already added')
      return
    }

    if (members.length >= GROUP_CONFIG.MAX_MEMBERS) {
      toast.error(`Maximum ${GROUP_CONFIG.MAX_MEMBERS} members allowed`)
      return
    }

    setMembers([...members, trimmedAddress])
    setMemberAddress('')
    setError('')
  }

  // Remove member from list
  const handleRemoveMember = (address: string) => {
    setMembers(members.filter((m) => m !== address))
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setMemberAddress(value)

    if (value && !isValidAddress(value)) {
      setError('Invalid address format')
    } else {
      setError('')
    }
  }

  // Add members to group
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (members.length === 0) {
      toast.error('Please add at least one member')
      return
    }

    try {
      await addMembers(group, members)
      onSuccess?.()
    } catch (err) {
      console.error('Failed to add members:', err)
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
        className="modal-content p-6 max-w-lg w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-telegram-text">Add Members</h2>
          <button onClick={onClose} className="btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Add Member Input */}
          <div>
            <label htmlFor="memberAddress" className="block text-sm font-medium text-telegram-text mb-2">
              Member Address
            </label>
            <div className="flex gap-2">
              <input
                id="memberAddress"
                type="text"
                value={memberAddress}
                onChange={handleInputChange}
                placeholder="0x..."
                disabled={isLoading}
                className={`input-field flex-1 ${error ? 'border-red-500' : ''}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddMember()
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddMember}
                disabled={isLoading || !!error || !memberAddress.trim()}
                className="btn-primary px-4"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            <p className="text-telegram-grayDark text-xs mt-2">
              {members.length} member(s) to add
            </p>
          </div>

          {/* Members to Add List */}
          {members.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto scroll-area">
              <AnimatePresence>
                {members.map((member) => (
                  <motion.div
                    key={member}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between bg-telegram-chat rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="avatar avatar-sm bg-gradient-to-br from-green-500 to-emerald-500">
                        {member.slice(2, 4).toUpperCase()}
                      </div>
                      <span className="text-sm text-telegram-text font-mono truncate">
                        {member.slice(0, 10)}...{member.slice(-8)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member)}
                      disabled={isLoading}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Actions */}
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
              disabled={isLoading || members.length === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add {members.length} Member(s)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default AddMembers
