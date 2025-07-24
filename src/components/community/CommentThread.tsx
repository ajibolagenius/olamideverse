'use client';

import React, { useState } from 'react';
import { Comment, CommentThread as CommentThreadType } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';
import CommentForm from './CommentForm';

interface CommentThreadProps {
  thread: CommentThreadType;
  entityType: 'track' | 'album' | 'story' | 'playlist';
  entityId: string;
  onReply?: (commentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
  onDislike?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  maxDepth?: number;
  currentDepth?: number;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  thread,
  entityType,
  entityId,
  onReply,
  onLike,
  onDislike,
  onDelete,
  onEdit,
  maxDepth = 3,
  currentDepth = 0,
}) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(thread.comment.content);

  const handleReply = (content: string) => {
    if (onReply) {
      onReply(thread.comment.id, content);
    }
    setShowReplyForm(false);
  };

  const handleEdit = () => {
    if (onEdit && editContent.trim() !== thread.comment.content) {
      onEdit(thread.comment.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const canEdit = user?.id === thread.comment.userId;
  const canDelete = user?.id === thread.comment.userId; // TODO: Add moderator role check

  return (
    <div className={`comment-thread ${currentDepth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="comment-item mb-4">
        {/* Comment Header */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {thread.comment.avatarUrl ? (
              <img
                src={thread.comment.avatarUrl}
                alt={thread.comment.displayName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {thread.comment.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-gray-900">
                {thread.comment.displayName}
              </h4>
              {thread.comment.isVerified && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="text-xs text-gray-500">@{thread.comment.username}</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{formatTimeAgo(thread.comment.createdAt)}</span>
              {thread.comment.isEdited && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
              {thread.comment.isPinned && (
                <span className="text-xs text-yellow-600 font-medium">📌 Pinned</span>
              )}
            </div>

            {/* Comment Content */}
            <div className="mt-1">
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md resize-none"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEdit}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(thread.comment.content);
                      }}
                      className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {thread.comment.isDeleted ? (
                    <span className="italic text-gray-500">[Comment deleted]</span>
                  ) : (
                    thread.comment.content
                  )}
                </p>
              )}
            </div>

            {/* Comment Actions */}
            {!thread.comment.isDeleted && (
              <div className="mt-2 flex items-center space-x-4">
                <button
                  onClick={() => onLike?.(thread.comment.id)}
                  className={`flex items-center space-x-1 text-xs ${
                    thread.comment.isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span>{thread.comment.likes}</span>
                </button>

                <button
                  onClick={() => onDislike?.(thread.comment.id)}
                  className={`flex items-center space-x-1 text-xs ${
                    thread.comment.isDisliked ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span>{thread.comment.dislikes}</span>
                </button>

                {user && currentDepth < maxDepth && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Reply
                  </button>
                )}

                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Edit
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={() => onDelete?.(thread.comment.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}

            {/* Reply Form */}
            {showReplyForm && user && (
              <div className="mt-3">
                <CommentForm
                  entityType={entityType}
                  entityId={entityId}
                  parentId={thread.comment.id}
                  onSubmit={handleReply}
                  onCancel={() => setShowReplyForm(false)}
                  placeholder="Write a reply..."
                  submitLabel="Reply"
                />
              </div>
            )}

            {/* Replies */}
            {thread.replies.length > 0 && (
              <div className="mt-3">
                {!showReplies && (
                  <button
                    onClick={() => setShowReplies(true)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View {thread.totalReplies} {thread.totalReplies === 1 ? 'reply' : 'replies'}
                  </button>
                )}

                {showReplies && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowReplies(false)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Hide replies
                    </button>
                    
                    {thread.replies.map((reply) => (
                      <CommentThread
                        key={reply.id}
                        thread={{ comment: reply, replies: reply.replies || [], totalReplies: reply.replyCount }}
                        entityType={entityType}
                        entityId={entityId}
                        onReply={onReply}
                        onLike={onLike}
                        onDislike={onDislike}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        maxDepth={maxDepth}
                        currentDepth={currentDepth + 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentThread;
