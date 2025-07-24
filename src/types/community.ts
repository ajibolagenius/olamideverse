/**
 * Community and social interaction types
 */

export interface Comment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  isVerified: boolean;
  content: string;
  parentId?: string; // For replies
  entityType: 'track' | 'album' | 'story' | 'playlist';
  entityId: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  isPinned: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  replyCount: number;
}

export interface CommentThread {
  comment: Comment;
  replies: Comment[];
  totalReplies: number;
}

export interface Poll {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  title: string;
  description?: string;
  options: PollOption[];
  entityType?: 'track' | 'album' | 'story' | 'general';
  entityId?: string;
  totalVotes: number;
  userVote?: string; // option ID user voted for
  isActive: boolean;
  allowMultipleChoice: boolean;
  showResults: boolean;
  endsAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  voters: string[]; // user IDs
}

export interface Reaction {
  id: string;
  userId: string;
  entityType: 'track' | 'album' | 'story' | 'comment' | 'poll';
  entityId: string;
  type: 'like' | 'love' | 'fire' | 'laugh' | 'sad' | 'angry';
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  entityType: 'comment' | 'poll' | 'user';
  entityId: string;
  reason: 'spam' | 'inappropriate' | 'harassment' | 'misinformation' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  moderatorId?: string;
  moderatorNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  color: string;
  badge?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'moderation' | 'administration';
}

export interface ModerationAction {
  id: string;
  moderatorId: string;
  targetType: 'user' | 'comment' | 'poll';
  targetId: string;
  action: 'warn' | 'timeout' | 'ban' | 'delete' | 'pin' | 'unpin';
  reason: string;
  duration?: number; // in hours for timeouts
  createdAt: string;
}

export interface UserBan {
  id: string;
  userId: string;
  moderatorId: string;
  reason: string;
  type: 'temporary' | 'permanent';
  endsAt?: string;
  createdAt: string;
}

export interface CommunityStats {
  totalComments: number;
  totalPolls: number;
  totalUsers: number;
  activeUsers: number; // users active in last 24h
  topContributors: {
    userId: string;
    username: string;
    commentCount: number;
    likesReceived: number;
  }[];
  popularContent: {
    type: 'track' | 'album' | 'story';
    id: string;
    title: string;
    commentCount: number;
    engagementScore: number;
  }[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  content: string;
  type: 'text' | 'emoji' | 'sticker' | 'system';
  roomId: string;
  replyToId?: string;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  entityType?: 'track' | 'album' | 'story';
  entityId?: string;
  participants: string[]; // user IDs
  moderators: string[]; // user IDs
  isActive: boolean;
  messageCount: number;
  lastMessageAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'comment_reply' | 'comment_like' | 'poll_vote' | 'mention' | 'moderation';
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}
