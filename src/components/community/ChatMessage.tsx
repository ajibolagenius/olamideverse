'use client';

import React, { useState } from 'react';
import { ChatMessage as ChatMessageType } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessageProps {
  message: ChatMessageType;
  onReply?: (messageId: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  replyToMessage?: ChatMessageType;
  showActions?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onReply,
  onEdit,
  onDelete,
  replyToMessage,
  showActions = true,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showFullTimestamp, setShowFullTimestamp] = useState(false);

  const handleEdit = () => {
    if (onEdit && editContent.trim() !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (showFullTimestamp) {
      return date.toLocaleString();
    }

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    
    return date.toLocaleDateString();
  };

  const canEdit = user?.id === message.userId;
  const canDelete = user?.id === message.userId; // TODO: Add moderator role check
  const isOwnMessage = user?.id === message.userId;

  if (message.type === 'system') {
    return (
      <div className="chat-message system-message text-center py-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`chat-message group flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
        {/* Avatar */}
        {!isOwnMessage && (
          <div className="flex-shrink-0">
            {message.avatarUrl ? (
              <img
                src={message.avatarUrl}
                alt={message.displayName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {message.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          {/* Reply Context */}
          {replyToMessage && (
            <div className="text-xs text-gray-500 mb-1 p-2 bg-gray-100 rounded border-l-2 border-gray-300">
              <div className="font-medium">{replyToMessage.displayName}</div>
              <div className="truncate max-w-48">
                {replyToMessage.content.length > 50
                  ? `${replyToMessage.content.substring(0, 50)}...`
                  : replyToMessage.content}
              </div>
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`relative px-3 py-2 rounded-lg ${
              isOwnMessage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {/* User Name (for non-own messages) */}
            {!isOwnMessage && (
              <div className="text-xs font-medium text-gray-600 mb-1">
                {message.displayName}
              </div>
            )}

            {/* Message Content */}
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 text-sm bg-white text-gray-900 border rounded resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsEditing(false);
                      setEditContent(message.content);
                    }
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleEdit();
                    }
                  }}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(message.content);
                    }}
                    className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm whitespace-pre-wrap">
                {message.isDeleted ? (
                  <span className="italic opacity-70">[Message deleted]</span>
                ) : message.type === 'emoji' ? (
                  <span className="text-2xl">{message.content}</span>
                ) : (
                  message.content
                )}
              </div>
            )}

            {/* Message Status */}
            <div
              className={`text-xs mt-1 flex items-center space-x-1 ${
                isOwnMessage ? 'text-blue-200' : 'text-gray-500'
              }`}
            >
              <button
                onClick={() => setShowFullTimestamp(!showFullTimestamp)}
                className="hover:underline"
              >
                {formatTime(message.createdAt)}
              </button>
              {message.isEdited && <span>(edited)</span>}
            </div>
          </div>

          {/* Message Actions */}
          {showActions && !message.isDeleted && (
            <div className={`mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 ${
              isOwnMessage ? 'flex-row-reverse' : 'flex-row'
            }`}>
              {onReply && (
                <button
                  onClick={() => onReply(message.id)}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                  title="Reply"
                >
                  ↩️
                </button>
              )}

              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                  title="Edit"
                >
                  ✏️
                </button>
              )}

              {canDelete && (
                <button
                  onClick={() => onDelete?.(message.id)}
                  className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-gray-100"
                  title="Delete"
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
