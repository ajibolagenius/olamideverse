'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType, ChatRoom } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';
import ChatMessage from './ChatMessage';

interface ChatInterfaceProps {
  room: ChatRoom;
  messages: ChatMessageType[];
  onSendMessage: (content: string, replyToId?: string) => void;
  onEditMessage?: (messageId: string, content: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  room,
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onLoadMore,
  isLoading = false,
  hasMore = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [messageContent, setMessageContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessageType | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when replying
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageContent.trim() || !isAuthenticated) {
      return;
    }

    onSendMessage(messageContent.trim(), replyingTo?.id);
    setMessageContent('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSendMessage(e);
    }
    if (e.key === 'Escape') {
      setReplyingTo(null);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onSendMessage(emoji, replyingTo?.id);
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const handleReply = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setReplyingTo(message);
    }
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current || !hasMore || isLoading) return;
    
    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop === 0) {
      onLoadMore?.();
    }
  };

  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '👏', '🎵', '🎶'];

  return (
    <div className="chat-interface h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="chat-header bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{room.name}</h3>
            {room.description && (
              <p className="text-sm text-gray-600">{room.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {room.participants.length} participants
            </span>
            {!room.isActive && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                Archived
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="messages-container flex-1 overflow-y-auto p-4 space-y-1"
      >
        {/* Load More Button */}
        {hasMore && (
          <div className="text-center py-2">
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load earlier messages'}
            </button>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => {
          const replyToMessage = message.replyToId
            ? messages.find(m => m.id === message.replyToId)
            : undefined;

          return (
            <ChatMessage
              key={message.id}
              message={message}
              replyToMessage={replyToMessage}
              onReply={handleReply}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
            />
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="typing-indicator flex items-center space-x-2 text-gray-500 text-sm">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>Someone is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {isAuthenticated && room.isActive ? (
        <div className="chat-input border-t border-gray-200 p-4">
          {/* Reply Preview */}
          {replyingTo && (
            <div className="reply-preview bg-gray-50 border-l-4 border-blue-500 p-3 mb-3 rounded">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    Replying to {replyingTo.displayName}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {replyingTo.content.length > 100
                      ? `${replyingTo.content.substring(0, 100)}...`
                      : replyingTo.content}
                  </div>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                maxLength={500}
                style={{
                  minHeight: '44px',
                  maxHeight: '120px',
                  height: 'auto',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
            </div>

            {/* Emoji Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                😊
              </button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-5 gap-1">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      className="p-2 hover:bg-gray-100 rounded text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!messageContent.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>

          {/* Input Help */}
          <div className="mt-2 text-xs text-gray-500">
            Press Cmd/Ctrl + Enter to send • {messageContent.length}/500 characters
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="chat-input-disabled border-t border-gray-200 p-4 text-center bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Sign in to join the conversation</p>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
            Sign In
          </button>
        </div>
      ) : (
        <div className="chat-input-disabled border-t border-gray-200 p-4 text-center bg-gray-50">
          <p className="text-sm text-gray-600">This chat room is no longer active</p>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
