import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Environment variables for Supabase configuration
 * These should be set in .env.local
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Create a Supabase client instance
 * This client can be used for both authenticated and unauthenticated requests
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Check if Supabase is properly configured
 * @returns True if Supabase is configured, false otherwise
 */
export function isSupabaseConfigured(): boolean {
    return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Handle Supabase errors consistently
 * @param error Error from Supabase
 * @param customMessage Custom error message
 * @returns Formatted error object
 */
export function handleSupabaseError(error: any, customMessage?: string): Error {
    console.error('Supabase error:', error);

    // Create a user-friendly error message
    const message = customMessage || 'An error occurred while accessing the database';

    // Return a new error with the formatted message
    return new Error(`${message}${error.message ? `: ${error.message}` : ''}`);
}
