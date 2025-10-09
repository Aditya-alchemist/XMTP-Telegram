import React, { useState } from 'react'
import { Save, Loader2, Image } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Group } from '@xmtp/browser-sdk'
import { useGroupChat } from '../../hooks/useGroupChat'
import toast from 'react-hot-toast'
import { GROUP_CONFIG } from '../../config/constants'

interface GroupSettingsProps {
  group: Group
}

/**
 * Group settings panel
 */
const GroupSettings: React.FC<GroupSettingsProps> = ({ group }) => {
  const { updateGroupName, updateGroupDescription, isLoading } = useGroupChat()
  const [groupName, setGroupName] = useState('Group Chat')
  const [groupDescription, setGroupDescription] = useState('')

  // Handle update group name
  const handleUpdateName = async () => {
    if (!groupName.trim()) {
      toast.error('Group name cannot be empty')
      return
    }

    try {
      await updateGroupName(group, groupName.trim())
    } catch (err) {
      console.error('Failed to update group name:', err)
    }
  }

  // Handle update group description
  const handleUpdateDescription = async () => {
    try {
      await updateGroupDescription(group, groupDescription.trim())
    } catch (err) {
      console.error('Failed to update group description:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Group Name */}
      <div>
        <label htmlFor="groupName" className="block text-sm font-medium text-telegram-text mb-2">
          Group Name
        </label>
        <div className="space-y-2">
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
          <div className="flex justify-between items-center">
            <p className="text-telegram-grayDark text-xs">
              {groupName.length} / {GROUP_CONFIG.MAX_NAME_LENGTH}
            </p>
            <button
              onClick={handleUpdateName}
              disabled={isLoading || !groupName.trim()}
              className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Group Description */}
      <div>
        <label htmlFor="groupDescription" className="block text-sm font-medium text-telegram-text mb-2">
          Description
        </label>
        <div className="space-y-2">
          <textarea
            id="groupDescription"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            placeholder="Enter group description"
            maxLength={GROUP_CONFIG.MAX_DESCRIPTION_LENGTH}
            disabled={isLoading}
            rows={4}
            className="input-field resize-none"
          />
          <div className="flex justify-between items-center">
            <p className="text-telegram-grayDark text-xs">
              {groupDescription.length} / {GROUP_CONFIG.MAX_DESCRIPTION_LENGTH}
            </p>
            <button
              onClick={handleUpdateDescription}
              disabled={isLoading}
              className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="card p-4 space-y-4">
        <h3 className="font-medium text-telegram-text">Group Permissions</h3>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-telegram-text text-sm">All Members Can Add</p>
            <p className="text-telegram-gray text-xs">Allow all members to add new members</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-telegram-chat peer-focus:outline-none rounded-full peer 
                          peer-checked:after:translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                          peer-checked:bg-telegram-blue"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-telegram-text text-sm">Edit Group Info</p>
            <p className="text-telegram-gray text-xs">Allow all members to edit group info</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-telegram-chat peer-focus:outline-none rounded-full peer 
                          peer-checked:after:translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                          peer-checked:bg-telegram-blue"></div>
          </label>
        </div>
      </div>

      {/* Security Info */}
      <div className="card p-4 space-y-2">
        <h3 className="font-medium text-telegram-text flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-telegram-online" />
          Security
        </h3>
        <p className="text-telegram-gray text-sm">
          All messages in this group are end-to-end encrypted using MLS protocol
        </p>
      </div>
    </div>
  )
}

export default GroupSettings
