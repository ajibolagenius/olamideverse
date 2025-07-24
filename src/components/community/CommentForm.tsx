'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface CommentFormProps {
  entityType: 'track' | 'album' | 'story' | 'playlist';
  entityId: string;
  parentId?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
  showCancel?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  entityType,
  entityId,
  parentId,
  onSubmit,
  onCancel,
  placeholder = 'Write a comment...',
  submitLabel = 'Comment',
  showCancel = true,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="comment-form-unauthenticated bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Sign in to join the conversation</p>
        <button
          onClick={() => {
            // This would trigger the auth modal
            // You might want to use a global auth context or modal state
          }}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="flex space-x-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              maxLength={1000}
              disabled={isSubmitting}
            />
            
            {/* Character Count */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {content.length}/1000
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Press Cmd/Ctrl + Enter to submit
            </div>
            
            <div className="flex space-x-2">
              {showCancel && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Posting...' : submitLabel}
              </button>
            </div>
          </div>

          {/* Formatting Help */}
          <div className="mt-2 text-xs text-gray-500">
            <details className="inline">
              <summary className="cursor-pointer hover:text-gray-700">
                Formatting help
              </summary>
              <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                <div className="space-y-1">
                  <div><strong>Bold:</strong> **text** or __text__</div>
                  <div><strong>Italic:</strong> *text* or _text_</div>
                  <div><strong>Code:</strong> `code`</div>
                  <div><strong>Link:</strong> [text](url)</div>
                  <div><strong>Mention:</strong> @username</div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
