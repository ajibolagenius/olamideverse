import { supabase } from '../supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Session ID for the current user session
 * Generated once per page load
 */
const SESSION_ID = uuidv4();

/**
 * Analytics event types
 */
export enum AnalyticsEventType {
    PAGE_VIEW = 'page_view',
    TRACK_PLAY = 'track_play',
    TRACK_PAUSE = 'track_pause',
    TRACK_COMPLETE = 'track_complete',
    ALBUM_VIEW = 'album_view',
    STORY_VIEW = 'story_view',
    SEARCH = 'search',
    SHARE = 'share',
    ERROR = 'error',
}

/**
 * Analytics event data interface
 */
interface AnalyticsEventData {
    [key: string]: unknown;
}

/**
 * Track an analytics event
 * @param eventType Type of event
 * @param eventData Additional event data
 * @param userId Optional user ID for authenticated users
 * @returns Promise resolving to true if successful
 */
export async function trackEvent(
    eventType: AnalyticsEventType | string,
    eventData: AnalyticsEventData = {},
    userId?: string
): Promise<boolean> {
    try {
        // Don't track events if analytics is disabled
        if (typeof window !== 'undefined' && localStorage.getItem('analytics-opt-out') === 'true') {
            return false;
        }

        // Get the current page URL
        const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

        // Prepare the event data
        const analyticsEvent = {
            user_id: userId || null,
            event_type: eventType,
            event_data: eventData,
            session_id: SESSION_ID,
            page_url: pageUrl,
        };

        // Insert the event into the analytics_events table
        const { error } = await supabase
            .from('analytics_events')
            .insert(analyticsEvent);

        if (error) {
            console.error('Failed to track analytics event:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error tracking analytics event:', error);
        return false;
    }
}

/**
 * Track a page view event
 * @param path Page path
 * @param title Page title
 * @param userId Optional user ID for authenticated users
 * @returns Promise resolving to true if successful
 */
export async function trackPageView(path: string, title: string, userId?: string): Promise<boolean> {
    return trackEvent(AnalyticsEventType.PAGE_VIEW, { path, title }, userId);
}

/**
 * Track a track play event
 * @param trackId Track ID
 * @param trackTitle Track title
 * @param albumId Album ID
 * @param albumTitle Album title
 * @param userId Optional user ID for authenticated users
 * @returns Promise resolving to true if successful
 */
export async function trackTrackPlay(
    trackId: string,
    trackTitle: string,
    albumId: string,
    albumTitle: string,
    userId?: string
): Promise<boolean> {
    return trackEvent(
        AnalyticsEventType.TRACK_PLAY,
        { trackId, trackTitle, albumId, albumTitle },
        userId
    );
}

/**
 * Enable or disable analytics tracking
 * @param enabled Whether analytics should be enabled
 */
export function setAnalyticsEnabled(enabled: boolean): void {
    if (typeof window !== 'undefined') {
        if (enabled) {
            localStorage.removeItem('analytics-opt-out');
        } else {
            localStorage.setItem('analytics-opt-out', 'true');
        }
    }
}

/**
 * Check if analytics tracking is enabled
 * @returns True if analytics is enabled, false otherwise
 */
export function isAnalyticsEnabled(): boolean {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('analytics-opt-out') !== 'true';
    }
    return true;
}
