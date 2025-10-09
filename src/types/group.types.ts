/**
 * Group metadata
 */
export interface GroupMetadata {
  name: string
  description?: string
  imageUrl?: string
  createdAt: Date
  createdBy: string
}

/**
 * Group member
 */
export interface GroupMember {
  inboxId: string
  address?: string
  role: 'admin' | 'member'
  joinedAt: Date
  addedBy?: string
}

/**
 * Group permissions
 */
export interface GroupPermissions {
  canAddMembers: boolean
  canRemoveMembers: boolean
  canUpdateMetadata: boolean
  canSendMessages: boolean
}

/**
 * Group settings
 */
export interface GroupSettings {
  isPublic: boolean
  requireApproval: boolean
  allowMemberInvites: boolean
  maxMembers: number
  permissions: GroupPermissions
}

/**
 * Group info
 */
export interface GroupInfo {
  id: string
  metadata: GroupMetadata
  members: GroupMember[]
  memberCount: number
  settings: GroupSettings
  isActive: boolean
}

/**
 * Group create options
 */
export interface GroupCreateOptions {
  name: string
  description?: string
  imageUrl?: string
  memberAddresses: string[]
  settings?: Partial<GroupSettings>
}

/**
 * Group update options
 */
export interface GroupUpdateOptions {
  name?: string
  description?: string
  imageUrl?: string
  settings?: Partial<GroupSettings>
}

/**
 * Group invite
 */
export interface GroupInvite {
  groupId: string
  invitedBy: string
  invitedAddress: string
  invitedAt: Date
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  expiresAt?: Date
}

/**
 * Group activity
 */
export interface GroupActivity {
  id: string
  groupId: string
  type: 'member_added' | 'member_removed' | 'metadata_updated' | 'settings_updated'
  performedBy: string
  targetMember?: string
  changes?: Record<string, unknown>
  timestamp: Date
}

/**
 * Group stats
 */
export interface GroupStats {
  groupId: string
  totalMessages: number
  totalMembers: number
  activeMembers: number
  lastActivity: Date
  createdAt: Date
}

/**
 * Group role
 */
export type GroupRole = 'admin' | 'member'

/**
 * Group member status
 */
export type GroupMemberStatus = 'active' | 'inactive' | 'removed' | 'banned'

/**
 * Group visibility
 */
export type GroupVisibility = 'public' | 'private' | 'secret'
