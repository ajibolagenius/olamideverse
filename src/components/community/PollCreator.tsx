'use client';

import React, { useState } from 'react';
import { PlusIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Poll, PollOption } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';

interface PollCreatorProps {
  onPollCreated?: (poll: Poll) => void;
  onCancel?: () => void;
  entityType?: 'track' | 'album' | 'story' | 'general';
  entityId?: string;
  isModal?: boolean;
}

const PollCreator: React.FC<PollCreatorProps> = ({
  onPollCreated,
  onCancel,
  entityType = 'general',
  entityId,
  isModal = false,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    allowMultipleChoice: false,
    showResults: true,
    duration: 1, // days
  });
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);

    // Clear error when user starts typing
    if (errors[`option_${index}`]) {
      setErrors(prev => ({ ...prev, [`option_${index}`]: '' }));
    }
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions(prev => [...prev, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Poll question is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Question must be less than 200 characters';
    }

    // Validate description
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Validate options
    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    options.forEach((option, index) => {
      if (option.trim() && option.length > 100) {
        newErrors[`option_${index}`] = 'Option must be less than 100 characters';
      }
    });

    // Check for duplicate options
    const optionTexts = validOptions.map(opt => opt.toLowerCase().trim());
    const duplicates = optionTexts.filter((item, index) => optionTexts.indexOf(item) !== index);
    if (duplicates.length > 0) {
      newErrors.options = 'Options must be unique';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    setIsSubmitting(true);
    try {
      const validOptions = options.filter(opt => opt.trim());
      
      // Calculate end time
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + formData.duration);

      // Create poll options
      const pollOptions: PollOption[] = validOptions.map((text, index) => ({
        id: `option_${Date.now()}_${index}`,
        text: text.trim(),
        votes: 0,
        percentage: 0,
        voters: [],
      }));

      // Create poll
      const newPoll: Poll = {
        id: `poll_${Date.now()}`,
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        options: pollOptions,
        entityType: entityType !== 'general' ? entityType : undefined,
        entityId: entityType !== 'general' ? entityId : undefined,
        totalVotes: 0,
        userVote: undefined,
        isActive: true,
        allowMultipleChoice: formData.allowMultipleChoice,
        showResults: formData.showResults,
        endsAt: endsAt.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // TODO: Replace with actual API call
      // const response = await fetch('/api/polls', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newPoll),
      // });
      // const poll = await response.json();

      // Mock implementation
      const existingPolls = JSON.parse(localStorage.getItem('communityPolls') || '[]');
      existingPolls.unshift(newPoll);
      localStorage.setItem('communityPolls', JSON.stringify(existingPolls));

      onPollCreated?.(newPoll);

      // Reset form
      setFormData({
        title: '',
        description: '',
        allowMultipleChoice: false,
        showResults: true,
        duration: 1,
      });
      setOptions(['', '']);
    } catch (error) {
      console.error('Error creating poll:', error);
      setErrors({ submit: 'Failed to create poll. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerClass = isModal
    ? 'poll-creator-modal p-6'
    : 'poll-creator bg-white border border-gray-200 rounded-lg p-6';

  return (
    <div className={containerClass}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-lg">📊</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Create Poll</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Poll Question */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Poll Question *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="What's your favorite Olamide album?"
            maxLength={200}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.title ? (
              <p className="text-sm text-red-600">{errors.title}</p>
            ) : (
              <div />
            )}
            <p className="text-xs text-gray-500">
              {formData.title.length}/200
            </p>
          </div>
        </div>

        {/* Description (Optional) */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add more context to your poll..."
            rows={3}
            maxLength={500}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-sm text-red-600">{errors.description}</p>
            ) : (
              <div />
            )}
            <p className="text-xs text-gray-500">
              {formData.description.length}/500
            </p>
          </div>
        </div>

        {/* Poll Options */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Poll Options *
            </label>
            <button
              type="button"
              onClick={addOption}
              disabled={options.length >= 10}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add option</span>
            </button>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    maxLength={100}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`option_${index}`] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors[`option_${index}`] && (
                    <p className="text-sm text-red-600 mt-1">{errors[`option_${index}`]}</p>
                  )}
                </div>
                
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {errors.options && (
            <p className="text-sm text-red-600 mt-2">{errors.options}</p>
          )}

          <p className="text-xs text-gray-500 mt-2">
            {options.length}/10 options • {options.filter(opt => opt.trim()).length} valid
          </p>
        </div>

        {/* Poll Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Poll Settings</h3>
          
          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm text-gray-700 mb-2">
              Poll duration
            </label>
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5 text-gray-400" />
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>1 week</option>
                <option value={14}>2 weeks</option>
                <option value={30}>1 month</option>
              </select>
            </div>
          </div>

          {/* Multiple Choice */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Allow multiple choices
              </p>
              <p className="text-xs text-gray-500">
                Let people select more than one option
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="allowMultipleChoice"
                checked={formData.allowMultipleChoice}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Show Results */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Show results before voting
              </p>
              <p className="text-xs text-gray-500">
                Allow people to see results without voting first
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="showResults"
                checked={formData.showResults}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !formData.title.trim() || options.filter(opt => opt.trim()).length < 2}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Poll'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PollCreator;
