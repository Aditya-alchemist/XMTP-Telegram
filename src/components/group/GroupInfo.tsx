import React, { useState } from 'react'
import { X, Users, Edit2, LogOut, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Group } from '@xmtp/browser-sdk'
import GroupMembers from './GroupMembers'
import GroupSettings from './GroupSettings'
import { useGroupChat } from '../../hooks/useGroupChat'

interface GroupInfoProps {
  group: Group
  onClose: () => void
}

/**
 * Group information panel
 */
const GroupInfo: React.FC<GroupInfoProps> = ({ group, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'settings'>('info')
  const { removeFromGroup, isLoading } = useGroupChat()

  // Get group ID
  const groupId = (group as any).id || 'unknown'

  // Get group name
  const getGroupName = () => {
    return 'Group Chat'
  }

  // Get group description
  const getGroupDescription = () => {
    return 'This is a secure XMTP group chat'
  }

  // Handle leave group
  const handleLeaveGroup = async () => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      try {
        await removeFromGroup(group)
        onClose()
      } catch (err) {
        console.error('Failed to leave group:', err)
      }
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
        initial={{ scale: 0.9, opacity: 0, x: '100%' }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        exit={{ scale: 0.9, opacity: 0, x: '100%' }}
        onClick={(e) => e.stopPropagation()}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-telegram-sidebar shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-telegram-header border-b border-telegram-border p-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-telegram-text">Group Info</h2>
            <button onClick={onClose} className="btn-icon">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Group Avatar & Name */}
        <div className="p-6 text-center border-b border-telegram-border">
          <div className="w-24 h-24 rounded-full bg-telegram-accent mx-auto mb-4 flex items-center justify-center">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-telegram-text mb-2">
            {getGroupName()}
          </h3>
          <p className="text-telegram-gray text-sm mb-4">{getGroupDescription()}</p>
          <p className="text-telegram-grayDark text-xs font-mono">
            {groupId.slice(0, 16)}...
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-telegram-border">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'text-telegram-blue border-b-2 border-telegram-blue'
                : 'text-telegram-gray hover:text-telegram-text'
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'members'
                ? 'text-telegram-blue border-b-2 border-telegram-blue'
                : 'text-telegram-gray hover:text-telegram-text'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-telegram-blue border-b-2 border-telegram-blue'
                : 'text-telegram-gray hover:text-telegram-text'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'info' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Group Stats */}
              <div className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-telegram-gray text-sm">Created</span>
                  <span className="text-telegram-text text-sm">Recently</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-telegram-gray text-sm">Type</span>
                  <span className="text-telegram-text text-sm">Group Chat</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-telegram-gray text-sm">Encryption</span>
                  <span className="text-telegram-online text-sm">MLS Enabled</span>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={handleLeaveGroup}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20
                         text-red-400 rounded-xl py-3 px-4 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Leave Group</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GroupMembers group={group} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GroupSettings group={group} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GroupInfo
