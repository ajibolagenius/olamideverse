'use client';

import { motion } from 'framer-motion';
import { SocialProvider } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';

const socialProviders: SocialProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z',
    color: '#DB4437'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    color: '#1877F2'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
    color: '#1DA1F2'
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: 'M12.017 0C8.396 0 8.002.014 8.002.014v7.37c0 2.116 1.714 3.83 3.83 3.83 2.116 0 3.83-1.714 3.83-3.83V.014S12.638 0 12.017 0zM8.002 24c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8-8-3.589-8-8z',
    color: '#000000'
  }
];

export default function SocialAuth() {
  const { socialLogin } = useAuth();

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      await socialLogin(provider.id);
    } catch (error) {
      console.error(`${provider.name} login failed:`, error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {socialProviders.map((provider, index) => (
        <motion.button
          key={provider.id}
          type="button"
          onClick={() => handleSocialLogin(provider)}
          className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill={provider.color}
          >
            <path d={provider.icon} />
          </svg>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {provider.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
