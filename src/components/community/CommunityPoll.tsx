'use client';

import React, { useState, useEffect } from 'react';
import { ChartBarIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Poll, PollOption } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';

interface CommunityPollProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
  onVoteChange?: (pollId: string, optionIds: string[]) => void;
  showResults?: boolean;
  compact?: boolean;
}

const CommunityPoll: React.FC<CommunityPollProps> = ({
  poll,
  onVote,
  onVoteChange,
  showResults: forceShowResults = false,
  compact = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(forceShowResults);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    // Check if user has already voted
    if (poll.userVote) {
      setSelectedOptions([poll.userVote]);
      setHasVoted(true);
      setShowResults(true);
    }

    // Update countdown timer
    if (poll.endsAt) {
      const updateTimer = () => {
        const now = new Date();
        const endTime = new Date(poll.endsAt!);
        const diff = endTime.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining('Poll ended');
          setShowResults(true);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

          if (days > 0) {
            setTimeRemaining(`${days}d ${hours}h left`);
          } else if (hours > 0) {
            setTimeRemaining(`${hours}h ${minutes}m left`);
          } else {
            setTimeRemaining(`${minutes}m left`);
          }
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [poll]);

  const handleOptionSelect = (optionId: string) => {
    if (!isAuthenticated || hasVoted || !poll.isActive) {
      return;
    }

    if (poll.allowMultipleChoice) {
      const newSelection = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
      setSelectedOptions(newSelection);
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = async () => {
    if (!isAuthenticated || selectedOptions.length === 0 || hasVoted) {
      return;
    }

    try {
      if (poll.allowMultipleChoice) {
        onVoteChange?.(poll.id, selectedOptions);
      } else {
        onVote?.(poll.id, selectedOptions[0]);
      }
      
      setHasVoted(true);
      setShowResults(true);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleViewResults = () => {
    setShowResults(true);
  };

  const getWinningOption = () => {
    return poll.options.reduce((prev, current) => 
      prev.votes > current.votes ? prev : current
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isPollExpired = poll.endsAt && new Date(poll.endsAt) <= new Date();
  const canVote = isAuthenticated && !hasVoted && poll.isActive && !isPollExpired;

  return (
    <div className={`community-poll bg-white border border-gray-200 rounded-lg ${compact ? 'p-4' : 'p-6'}`}>
      {/* Poll Header */}
      <div className="poll-header mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {!compact && poll.avatarUrl && (
              <img
                src={poll.avatarUrl}
                alt={poll.displayName}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                  {poll.displayName}
                </h3>
                {!compact && (
                  <span className="text-sm text-gray-500">
                    @{poll.username}
                  </span>
                )}
              </div>
              {!compact && (
                <p className="text-sm text-gray-600">
                  {formatDate(poll.createdAt)}
                </p>
              )}
            </div>
          </div>

          {/* Poll Status */}
          <div className="flex items-center space-x-2">
            {poll.isActive && !isPollExpired ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                Ended
              </span>
            )}
          </div>
        </div>

        {/* Poll Title */}
        <h2 className={`font-bold text-gray-900 mt-3 ${compact ? 'text-base' : 'text-lg'}`}>
          {poll.title}
        </h2>

        {/* Poll Description */}
        {poll.description && (
          <p className={`text-gray-700 mt-2 ${compact ? 'text-sm' : 'text-base'}`}>
            {poll.description}
          </p>
        )}

        {/* Timer and Stats */}
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{poll.totalVotes} votes</span>
            {poll.allowMultipleChoice && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Multiple choice
              </span>
            )}
          </div>
          
          {timeRemaining && (
            <div className="flex items-center space-x-1">
              <ClockIcon className="w-4 h-4" />
              <span>{timeRemaining}</span>
            </div>
          )}
        </div>
      </div>

      {/* Poll Options */}
      <div className="poll-options space-y-3">
        {poll.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const userVoted = hasVoted || poll.userVote;
          const isWinning = showResults && option.id === getWinningOption().id && poll.totalVotes > 0;

          return (
            <div
              key={option.id}
              className={`poll-option relative overflow-hidden rounded-lg border transition-all ${
                canVote
                  ? 'cursor-pointer hover:border-blue-300'
                  : 'cursor-default'
              } ${
                isSelected && !showResults
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              } ${
                showResults && isWinning
                  ? 'border-green-500 bg-green-50'
                  : ''
              }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              {/* Progress Bar (Results View) */}
              {showResults && (
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    isWinning ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                  style={{
                    width: `${option.percentage}%`,
                    opacity: 0.3,
                  }}
                />
              )}

              <div className={`relative flex items-center justify-between ${compact ? 'p-3' : 'p-4'}`}>
                <div className="flex items-center space-x-3 flex-1">
                  {/* Selection Indicator */}
                  {!showResults && (
                    <div className={`w-5 h-5 border-2 rounded transition-colors ${
                      poll.allowMultipleChoice ? 'rounded-sm' : 'rounded-full'
                    } ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <CheckCircleIcon className="w-full h-full text-white" />
                      )}
                    </div>
                  )}

                  {/* Results Indicator */}
                  {showResults && (
                    <div className="flex items-center space-x-2">
                      {userVoted && poll.userVote === option.id && (
                        <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                      )}
                      {isWinning && (
                        <span className="text-lg">🏆</span>
                      )}
                    </div>
                  )}

                  {/* Option Text */}
                  <span className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                    {option.text}
                  </span>
                </div>

                {/* Vote Count/Percentage */}
                {showResults && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-semibold text-gray-900">
                      {option.percentage.toFixed(1)}%
                    </span>
                    <span className="text-gray-500">
                      ({option.votes})
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Poll Actions */}
      {!showResults && (
        <div className="poll-actions mt-4 flex items-center justify-between">
          <button
            onClick={handleViewResults}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <ChartBarIcon className="w-4 h-4" />
            <span>View results</span>
          </button>

          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <span className="text-sm text-gray-500">
                Sign in to vote
              </span>
            ) : !canVote ? (
              <span className="text-sm text-gray-500">
                {hasVoted ? 'You voted' : isPollExpired ? 'Poll ended' : 'Voting closed'}
              </span>
            ) : (
              <button
                onClick={handleVote}
                disabled={selectedOptions.length === 0}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Vote{poll.allowMultipleChoice && selectedOptions.length > 1 ? ` (${selectedOptions.length})` : ''}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Poll Footer (Results View) */}
      {showResults && (
        <div className="poll-footer mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Final results</span>
              {poll.totalVotes > 0 && (
                <span>
                  Winner: {getWinningOption().text} ({getWinningOption().percentage.toFixed(1)}%)
                </span>
              )}
            </div>
            
            {poll.endsAt && (
              <span>
                Ended {formatDate(poll.endsAt)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPoll;
