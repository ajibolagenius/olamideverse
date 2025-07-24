'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import AudioSnippetSelector from './AudioSnippetSelector';
import AudiogramGenerator from './AudiogramGenerator';
import SocialShare from '@/components/social/SocialShare';

interface AudiogramCreatorProps {
  trackTitle: string;
  artistName: string;
  audioUrl: string;
  onClose?: () => void;
  className?: string;
}

type Step = 'select' | 'generate' | 'share';

export default function AudiogramCreator({
  trackTitle,
  artistName,
  audioUrl,
  onClose,
  className = ''
}: AudiogramCreatorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [audioSnippet, setAudioSnippet] = useState<{
    startTime: number;
    endTime: number;
    audioBlob: Blob;
  } | null>(null);
  const [audiogramBlob, setAudiogramBlob] = useState<Blob | null>(null);

  const handleSnippetSelect = (startTime: number, endTime: number, audioBlob: Blob) => {
    setAudioSnippet({ startTime, endTime, audioBlob });
    setCurrentStep('generate');
  };

  const handleAudiogramGenerate = (blob: Blob) => {
    setAudiogramBlob(blob);
    setCurrentStep('share');
  };

  const goBack = () => {
    switch (currentStep) {
      case 'generate':
        setCurrentStep('select');
        break;
      case 'share':
        setCurrentStep('generate');
        break;
      default:
        if (onClose) onClose();
    }
  };

  const steps = [
    {
      id: 'select',
      title: 'Select Audio',
      description: 'Choose a snippet from your track',
      icon: SpeakerWaveIcon,
      completed: !!audioSnippet
    },
    {
      id: 'generate',
      title: 'Generate',
      description: 'Create your audiogram',
      icon: SparklesIcon,
      completed: !!audiogramBlob
    },
    {
      id: 'share',
      title: 'Share',
      description: 'Share your creation',
      icon: ShareIcon,
      completed: false
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={goBack}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Audiogram
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {trackTitle} by {artistName}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = step.completed;
            const isPast = index < currentStepIndex;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                      isActive
                        ? 'bg-primary text-white'
                        : isCompleted || isPast
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {isCompleted || isPast ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-primary' : 'text-gray-900 dark:text-white'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.description}
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`hidden md:block w-12 h-0.5 mx-4 ${
                    isPast ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <AudioSnippetSelector
              audioUrl={audioUrl}
              onSnippetSelect={handleSnippetSelect}
              maxDuration={30}
            />
          </motion.div>
        )}

        {currentStep === 'generate' && audioSnippet && (
          <motion.div
            key="generate"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <AudiogramGenerator
              audioBlob={audioSnippet.audioBlob}
              trackTitle={trackTitle}
              artistName={artistName}
              startTime={audioSnippet.startTime}
              endTime={audioSnippet.endTime}
              onShare={handleAudiogramGenerate}
            />
          </motion.div>
        )}

        {currentStep === 'share' && audiogramBlob && (
          <motion.div
            key="share"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-8 h-8 text-green-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Audiogram Created!
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Your audiogram is ready to share. Spread the word about this amazing track!
              </p>

              {/* Preview */}
              <div className="mb-8">
                <img
                  src={URL.createObjectURL(audiogramBlob)}
                  alt="Generated audiogram"
                  className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                  style={{ maxHeight: '400px' }}
                />
              </div>

              {/* Social Share */}
              <div className="flex justify-center mb-6">
                <SocialShare
                  url={window.location.href}
                  title={`Check out this snippet from "${trackTitle}" by ${artistName}`}
                  description="Listen to this amazing track on OlamideVerse"
                  hashtags={['OlamideVerse', 'Olamide', 'Afrobeats', 'NaijaMusic']}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => {
                    const url = URL.createObjectURL(audiogramBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${trackTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_audiogram.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  Download Audiogram
                </motion.button>
                
                <motion.button
                  onClick={() => setCurrentStep('select')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Create Another
                </motion.button>
              </div>

              {/* Tips */}
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Sharing Tips
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                  <li>• Post on Instagram Stories with music to increase engagement</li>
                  <li>• Share on Twitter with relevant hashtags</li>
                  <li>• Use in WhatsApp status to reach your contacts</li>
                  <li>• Add to your social media bio links</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
