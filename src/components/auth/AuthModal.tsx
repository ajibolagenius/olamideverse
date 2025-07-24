'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import SocialAuth from './SocialAuth';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, signup, requestPasswordReset } = useAuth();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [signupForm, setSignupForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    acceptTerms: false,
    acceptMarketing: false
  });

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(loginForm);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!signupForm.acceptTerms) {
      setError('Please accept the terms of service');
      setIsLoading(false);
      return;
    }

    try {
      await signup(signupForm);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await requestPasswordReset(forgotPasswordForm);
      setMode('login');
      // Show success message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setLoginForm({ email: '', password: '', rememberMe: false });
    setSignupForm({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      acceptTerms: false,
      acceptMarketing: false
    });
    setForgotPasswordForm({ email: '' });
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot-password') => {
    setMode(newMode);
    resetForms();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-secondary-800 p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mode === 'login' && 'Welcome Back'}
                    {mode === 'signup' && 'Join OlamideVerse'}
                    {mode === 'forgot-password' && 'Reset Password'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {/* Login Form */}
                  {mode === 'login' && (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              required
                              value={loginForm.email}
                              onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                          </label>
                          <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={loginForm.password}
                              onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={loginForm.rememberMe}
                              onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                              Remember me
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => switchMode('forgot-password')}
                            className="text-sm text-primary hover:text-primary-600 transition-colors"
                          >
                            Forgot password?
                          </button>
                        </div>

                        {/* Login Button */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                          {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                      </form>

                      {/* Social Auth */}
                      <div className="mt-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-secondary-800 text-gray-500">
                              Or continue with
                            </span>
                          </div>
                        </div>
                        <SocialAuth />
                      </div>

                      {/* Switch to Signup */}
                      <div className="mt-6 text-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Don&apos;t have an account?{' '}
                          <button
                            onClick={() => switchMode('signup')}
                            className="text-primary hover:text-primary-600 font-medium transition-colors"
                          >
                            Sign up
                          </button>
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Signup Form */}
                  {mode === 'signup' && (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <form onSubmit={handleSignup} className="space-y-4">
                        {/* Display Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Display Name
                          </label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              required
                              value={signupForm.displayName}
                              onChange={(e) => setSignupForm(prev => ({ ...prev, displayName: e.target.value }))}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                              placeholder="Your name"
                            />
                          </div>
                        </div>

                        {/* Username */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Username
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                            <input
                              type="text"
                              required
                              value={signupForm.username}
                              onChange={(e) => setSignupForm(prev => ({ ...prev, username: e.target.value }))}
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                              placeholder="username"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              required
                              value={signupForm.email}
                              onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                          </label>
                          <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={signupForm.password}
                              onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              value={signupForm.confirmPassword}
                              onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                              {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Terms & Marketing */}
                        <div className="space-y-3">
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              checked={signupForm.acceptTerms}
                              onChange={(e) => setSignupForm(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 mt-0.5"
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                              I agree to the{' '}
                              <a href="/legal/terms" className="text-primary hover:text-primary-600">
                                Terms of Service
                              </a>{' '}
                              and{' '}
                              <a href="/legal/privacy" className="text-primary hover:text-primary-600">
                                Privacy Policy
                              </a>
                            </span>
                          </label>
                          
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              checked={signupForm.acceptMarketing}
                              onChange={(e) => setSignupForm(prev => ({ ...prev, acceptMarketing: e.target.checked }))}
                              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 mt-0.5"
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                              I&apos;d like to receive updates and special offers via email
                            </span>
                          </label>
                        </div>

                        {/* Signup Button */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                          {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                      </form>

                      {/* Switch to Login */}
                      <div className="mt-6 text-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Already have an account?{' '}
                          <button
                            onClick={() => switchMode('login')}
                            className="text-primary hover:text-primary-600 font-medium transition-colors"
                          >
                            Sign in
                          </button>
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Forgot Password Form */}
                  {mode === 'forgot-password' && (
                    <motion.div
                      key="forgot-password"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          Enter your email address and we&apos;ll send you a link to reset your password.
                        </p>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              required
                              value={forgotPasswordForm.email}
                              onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>

                        {/* Reset Button */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                          {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        {/* Back to Login */}
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => switchMode('login')}
                            className="text-sm text-primary hover:text-primary-600 transition-colors"
                          >
                            ← Back to Sign In
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
