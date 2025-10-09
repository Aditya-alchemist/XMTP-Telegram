import React, { useState, useEffect } from 'react'
import { UserPlus, Crown, User, MoreVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Group } from '@xmtp/browser-sdk'
import AddMembers from './AddMembers'

interface GroupMembersProps {
  group: Group
}

/**
 * List of group members
 */
const GroupMembers: React.FC<GroupMembersProps> = ({ group }) => {
  const [showAddMembers, setShowAddMembers] = useState(false)
  const [members, setMembers] = useState<string[]>([])

  // Load group members
  useEffect(() => {
    loadMembers()
  }, [group])

  const loadMembers = async () => {
    try {
      // Sync group first
      await group.sync()
      
      // Get members if available
      if ('members' in group) {
        const membersList = (group as any).members || []
        setMembers(membersList)
      }
    } catch (err) {
      console.error('Failed to load members:', err)
    }
  }

  // Get member initials
  const getMemberInitials = (inboxId: string) => {
    return inboxId.slice(0, 2).toUpperCase()
  }

  // Format inbox ID for display
  const formatInboxId = (inboxId: string) => {
    return `${inboxId.slice(0, 8)}...${inboxId.slice(-6)}`
  }

  return (
    <div className="space-y-4">
      {/* Add Members Button */}
      <button
        onClick={() => setShowAddMembers(true)}
        className="w-full flex items-center justify-center gap-2 bg-telegram-blue
                 hover:bg-telegram-darkBlue text-white rounded-xl py-3 px-4
                 transition-all duration-200"
      >
        <UserPlus className="w-5 h-5" />
        <span className="font-medium">Add Members</span>
      </button>

      {/* Members List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-telegram-gray px-2">
          Members ({members.length})
        </h3>

        {members.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-telegram-gray mx-auto mb-2" />
            <p className="text-telegram-gray text-sm">No members found</p>
          </div>
        ) : (
          <AnimatePresence>
            {members.map((memberId, index) => (
              <motion.div
                key={memberId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-telegram-hover
                         transition-all duration-200 cursor-pointer"
              >
                {/* Avatar */}
                <div className="avatar avatar-md bg-gradient-to-br from-blue-500 to-purple-500">
                  {getMemberInitials(memberId)}
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-telegram-text font-medium text-sm truncate">
                    Member {index + 1}
                  </p>
                  <p className="text-telegram-gray text-xs font-mono">
                    {formatInboxId(memberId)}
                  </p>
                </div>

                {/* Admin Badge */}
                {index === 0 && (
                  <div className="flex items-center gap-1 bg-telegram-blue/20 text-telegram-blue
                               px-2 py-1 rounded-lg text-xs">
                    <Crown className="w-3 h-3" />
                    <span>Admin</span>
                  </div>
                )}

                {/* More Options */}
                <button className="btn-icon">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add Members Modal */}
      {showAddMembers && (
        <AddMembers
          group={group}
          onClose={() => setShowAddMembers(false)}
          onSuccess={() => {
            setShowAddMembers(false)
            loadMembers()
          }}
        />
      )}
    </div>
  )
}

export default GroupMembers
