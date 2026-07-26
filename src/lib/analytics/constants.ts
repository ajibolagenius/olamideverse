export const VISITOR_COOKIE = "ov_vid";
export const SESSION_COOKIE = "ov_sid";

/** How long a returning browser counts as the same visitor. */
export const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Rolling session window — refreshes on each hit. */
export const SESSION_COOKIE_MAX_AGE = 60 * 30; // 30 minutes

/** Ignore rapid re-hits of the same path from the same visitor. */
export const DEDUPE_WINDOW_MS = 15_000;

export const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|redditbot|ahrefs|semrush|bytespider|gptbot|claudebot|applebot|yandex|duckduck|baidu|sogou|exabot|facebot|ia_archiver/i;
