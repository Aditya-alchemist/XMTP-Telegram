import React, { useState } from 'react'
import { X, Plus, Users, Loader2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGroupChat } from '../../hooks/useGroupChat'
import toast from 'react-hot-toast'
import { ERROR_MESSAGES, GROUP_CONFIG, REGEX } from '../../config/constants'

interface NewGroupProps {
  onClose: () => void
  onSuccess?: () => void
}

/**
 * Modal to create a new group conversation
 */
const NewGroup: React.FC<NewGroupProps> = ({ onClose, onSuccess }) => {
  const { createGroup, isLoading } = useGroupChat()
  
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [memberAddress, setMemberAddress] = useState('')
  const [members, setMembers] = useState<string[]>([])
  const [error, setError] = useState('')

  // Validate address format
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

  // Handle member input change
  const handleMemberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setMemberAddress(value)
    
    if (value && !isValidAddress(value)) {
      setError('Invalid address format')
    } else {
      setError('')
    }
  }

  // Create group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (members.length < GROUP_CONFIG.MIN_MEMBERS) {
      toast.error(ERROR_MESSAGES.GROUP_MIN_MEMBERS)
      return
    }

    try {
      await createGroup(members, {
        name: groupName.trim() || 'New Group',
        description: groupDescription.trim(),
      })

      toast.success('Group created successfully!')
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('Error creating group:', err)
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-telegram-blue flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-telegram-text">Create Group</h2>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateGroup} className="space-y-4">
          {/* Group Name */}
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-telegram-text mb-2">
              Group Name (Optional)
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              maxLength={GROUP_CONFIG.MAX_NAME_LENGTH}
              disabled={isLoading}
              className="input-field"
            />
          </div>

          {/* Group Description */}
          <div>
            <label htmlFor="groupDescription" className="block text-sm font-medium text-telegram-text mb-2">
              Description (Optional)
            </label>
            <textarea
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Enter group description"
              maxLength={GROUP_CONFIG.MAX_DESCRIPTION_LENGTH}
              disabled={isLoading}
              rows={2}
              className="input-field resize-none"
            />
          </div>

          {/* Add Members */}
          <div>
            <label htmlFor="memberAddress" className="block text-sm font-medium text-telegram-text mb-2">
              Add Members
            </label>
            <div className="flex gap-2">
              <input
                id="memberAddress"
                type="text"
                value={memberAddress}
                onChange={handleMemberInputChange}
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
            {error && (
              <p className="text-red-400 text-xs mt-1">{error}</p>
            )}
            <p className="text-telegram-grayDark text-xs mt-2">
              {members.length} / {GROUP_CONFIG.MAX_MEMBERS} members added
            </p>
          </div>

          {/* Members List */}
          {members.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto scroll-area">
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
                      <div className="avatar avatar-sm bg-gradient-to-br from-purple-500 to-pink-500">
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
              disabled={isLoading || members.length < GROUP_CONFIG.MIN_MEMBERS}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Create Group ({members.length})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default NewGroup