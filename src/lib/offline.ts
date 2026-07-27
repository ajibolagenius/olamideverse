const STORAGE_KEY = "ov-saved-items";
const CACHE_NAME = "ov-saved";
const CHANGE_EVENT = "ov-saved-change";

export type SavedItem = {
  href: string;
  title: string;
  subtitle: string;
  kind: "album" | "era";
  savedAt: number;
};

function readAll(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// useSyncExternalStore requires a stable snapshot reference between calls
// that produce no change — readAll() sorted fresh every time would violate
// that (a new array each call), so cache it and only drop the cache on
// mutation or a cross-tab "storage" event.
let cachedItems: SavedItem[] | null = null;

function writeAll(items: SavedItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  cachedItems = null;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getSavedItems(): SavedItem[] {
  if (!cachedItems) {
    cachedItems = readAll().sort((a, b) => b.savedAt - a.savedAt);
  }
  return cachedItems;
}

export function isSaved(href: string): boolean {
  return readAll().some((item) => item.href === href);
}

/** Subscribe to changes from any tab/component — pairs with useSyncExternalStore. */
export function subscribeSaved(onChange: () => void): () => void {
  const handler = () => {
    cachedItems = null;
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export async function saveOffline(item: Omit<SavedItem, "savedAt">): Promise<void> {
  const items = readAll().filter((existing) => existing.href !== item.href);
  items.push({ ...item, savedAt: Date.now() });
  writeAll(items);

  if (!("caches" in window)) return;
  try {
    const cache = await window.caches.open(CACHE_NAME);
    await cache.add(item.href);
  } catch {
    // Best-effort — the bookmark still exists even if the offline copy failed.
  }
}

export async function removeOffline(href: string): Promise<void> {
  writeAll(readAll().filter((item) => item.href !== href));

  if (!("caches" in window)) return;
  try {
    const cache = await window.caches.open(CACHE_NAME);
    await cache.delete(href);
  } catch {
    // Nothing to clean up — ignore.
  }
}
