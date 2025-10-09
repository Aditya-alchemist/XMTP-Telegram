import { useState, useCallback } from 'react'
import type { Client, Group } from '@xmtp/browser-sdk'
import { useXMTPClient } from './useXMTPClient'
import toast from 'react-hot-toast'
import { ERROR_MESSAGES, SUCCESS_MESSAGES, GROUP_CONFIG } from '../config/constants'

interface GroupMetadata {
  name?: string
  imageUrl?: string
  description?: string
}

interface UseGroupChatReturn {
  isLoading: boolean
  createGroup: (memberAddresses: string[], metadata?: GroupMetadata) => Promise<Group | undefined>
  addMembers: (group: Group, addresses: string[]) => Promise<void>
  removeMembers: (group: Group, addresses: string[]) => Promise<void>
  updateGroupName: (group: Group, name: string) => Promise<void>
  updateGroupDescription: (group: Group, description: string) => Promise<void>
  removeFromGroup: (group: Group) => Promise<void>
  syncGroup: (group: Group) => Promise<void>
}

/**
 * Hook to manage group chat operations
 * Create, update, and manage group memberships
 */
export const useGroupChat = (): UseGroupChatReturn => {
  const { client } = useXMTPClient()
  const [isLoading, setIsLoading] = useState(false)

  // Create new group
  const createGroup = useCallback(async (
    memberAddresses: string[],
    metadata?: GroupMetadata
  ): Promise<Group | undefined> => {
    if (!client) {
      toast.error(ERROR_MESSAGES.XMTP_NOT_INITIALIZED)
      return
    }

    if (memberAddresses.length < GROUP_CONFIG.MIN_MEMBERS) {
      toast.error(ERROR_MESSAGES.GROUP_MIN_MEMBERS)
      return
    }

    if (memberAddresses.length > GROUP_CONFIG.MAX_MEMBERS) {
      toast.error(ERROR_MESSAGES.GROUP_MAX_MEMBERS)
      return
    }

    setIsLoading(true)

    try {
      console.log('Creating group with members:', memberAddresses)

      // Get inbox IDs for addresses
      const inboxIds: string[] = []
      for (const address of memberAddresses) {
        const inboxId = await client.findInboxIdByIdentifier({
          identifier: address.toLowerCase(),
          identifierKind: 'Ethereum',
        })
        if (inboxId) {
          inboxIds.push(inboxId)
        }
      }

      // Create group with inbox IDs
      const group = await client.conversations.newGroup(inboxIds, {
        name: metadata?.name || 'New Group',
        description: metadata?.description || '',
      })

      console.log('Group created:', group.id)
      toast.success(SUCCESS_MESSAGES.GROUP_CREATED)
      
      return group
    } catch (err) {
      console.error('Error creating group:', err)
      toast.error(ERROR_MESSAGES.GROUP_CREATE_ERROR)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [client])

  // Add members to group
  const addMembers = useCallback(async (group: Group, addresses: string[]) => {
    if (!client) {
      toast.error(ERROR_MESSAGES.XMTP_NOT_INITIALIZED)
      return
    }

    setIsLoading(true)

    try {
      // Get inbox IDs
      const inboxIds: string[] = []
      for (const address of addresses) {
        const inboxId = await client.findInboxIdByIdentifier({
          identifier: address.toLowerCase(),
          identifierKind: 'Ethereum',
        })
        if (inboxId) {
          inboxIds.push(inboxId)
        }
      }

      if (inboxIds.length === 0) {
        toast.error('No valid addresses found')
        return
      }

      await group.addMembers(inboxIds)
      await group.sync()
      
      console.log('Members added to group')
      toast.success(SUCCESS_MESSAGES.MEMBER_ADDED)
    } catch (err) {
      console.error('Error adding members:', err)
      toast.error(ERROR_MESSAGES.GROUP_ADD_MEMBER_ERROR)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [client])

  // Remove members from group
  const removeMembers = useCallback(async (group: Group, addresses: string[]) => {
    if (!client) {
      toast.error(ERROR_MESSAGES.XMTP_NOT_INITIALIZED)
      return
    }

    setIsLoading(true)

    try {
      // Get inbox IDs
      const inboxIds: string[] = []
      for (const address of addresses) {
        const inboxId = await client.findInboxIdByIdentifier({
          identifier: address.toLowerCase(),
          identifierKind: 'Ethereum',
        })
        if (inboxId) {
          inboxIds.push(inboxId)
        }
      }

      if (inboxIds.length === 0) {
        toast.error('No valid addresses found')
        return
      }

      await group.removeMembers(inboxIds)
      await group.sync()
      
      console.log('Members removed from group')
      toast.success(SUCCESS_MESSAGES.MEMBER_REMOVED)
    } catch (err) {
      console.error('Error removing members:', err)
      toast.error(ERROR_MESSAGES.GROUP_REMOVE_MEMBER_ERROR)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [client])

  // Update group name
  const updateGroupName = useCallback(async (group: Group, name: string) => {
    setIsLoading(true)

    try {
      await group.updateName(name)
      await group.sync()
      
      console.log('Group name updated')
      toast.success(SUCCESS_MESSAGES.GROUP_UPDATED)
    } catch (err) {
      console.error('Error updating group name:', err)
      toast.error(ERROR_MESSAGES.GROUP_UPDATE_ERROR)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update group description
  const updateGroupDescription = useCallback(async (group: Group, description: string) => {
    setIsLoading(true)

    try {
      await group.updateDescription(description)
      await group.sync()
      
      console.log('Group description updated')
      toast.success(SUCCESS_MESSAGES.GROUP_UPDATED)
    } catch (err) {
      console.error('Error updating group description:', err)
      toast.error(ERROR_MESSAGES.GROUP_UPDATE_ERROR)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Remove yourself from group - FIXED: Handle optional inboxId
  const removeFromGroup = useCallback(async (group: Group) => {
    if (!client) {
      toast.error(ERROR_MESSAGES.XMTP_NOT_INITIALIZED)
      return
    }

    const inboxId = client.inboxId
    if (!inboxId) {
      toast.error('Unable to determine your inbox ID')
      return
    }

    setIsLoading(true)

    try {
      // Remove yourself by using your own inbox ID
      await group.removeMembers([inboxId])
      console.log('Left group')
      toast.success('Left group successfully')
    } catch (err) {
      console.error('Error leaving group:', err)
      toast.error(ERROR_MESSAGES.GROUP_LEAVE_ERROR)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [client])

  // Sync group
  const syncGroup = useCallback(async (group: Group) => {
    try {
      await group.sync()
      console.log('Group synced')
    } catch (err) {
      console.error('Error syncing group:', err)
      throw err
    }
  }, [])

  return {
    isLoading,
    createGroup,
    addMembers,
    removeMembers,
    updateGroupName,
    updateGroupDescription,
    removeFromGroup,
    syncGroup,
  }
}

export default useGroupChat
