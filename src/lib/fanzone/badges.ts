import type { FanStats } from "@/lib/fanzone/queries";

export type Badge = {
    id: string;
    label: string;
    description: string;
    earned: (stats: FanStats) => boolean;
};

/** Paste-up "stamps" — editorial equivalent of achievement badges. */
export const BADGES: Badge[] = [
    {
        id: "first-favorite",
        label: "First Favorite",
        description: "Favorited an era or album.",
        earned: (s) => s.favoritesCount >= 1,
    },
    {
        id: "crate-digger",
        label: "Crate Digger",
        description: "Stacked 10+ tracks into a playlist.",
        earned: (s) => s.playlistCount >= 10,
    },
    {
        id: "conversationalist",
        label: "Conversationalist",
        description: "Posted 5+ comments.",
        earned: (s) => s.commentsCount >= 5,
    },
    {
        id: "open-book",
        label: "Open Book",
        description: "Made favorites & playlist public.",
        earned: (s) => s.publicProfile,
    },
    {
        id: "three-day-streak",
        label: "3-Day Streak",
        description: "Visited 3 days in a row.",
        earned: (s) => s.longestStreak >= 3,
    },
    {
        id: "week-warrior",
        label: "Week Warrior",
        description: "Visited 7 days in a row.",
        earned: (s) => s.longestStreak >= 7,
    },
    {
        id: "marathon",
        label: "Marathon",
        description: "Visited 30 days in a row.",
        earned: (s) => s.longestStreak >= 30,
    },
];
