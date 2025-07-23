interface CacheItem<T> {
    data: T;
    timestamp: number;
}

class ApiCache {
    private cache: Map<string, CacheItem<any>> = new Map();
    private defaultTTL: number = 1000 * 60 * 5; // 5 minutes

    /**
     * Get an item from the cache
     * @param key Cache key
     * @returns The cached data or undefined if not found or expired
     */
    public get<T>(key: string): T | undefined {
        const item = this.cache.get(key);

        if (!item) {
            return undefined;
        }

        const now = Date.now();
        const isExpired = now - item.timestamp > this.defaultTTL;

        if (isExpired) {
            this.cache.delete(key);
            return undefined;
        }

        return item.data as T;
    }

    /**
     * Set an item in the cache
     * @param key Cache key
     * @param data Data to cache
     * @param ttl Time to live in milliseconds (optional, defaults to 5 minutes)
     */
    public set<T>(key: string, data: T, ttl?: number): void {
        const timestamp = Date.now();
        this.cache.set(key, { data, timestamp });

        // Set expiration
        if (ttl !== undefined) {
            setTimeout(() => {
                this.cache.delete(key);
            }, ttl);
        } else {
            setTimeout(() => {
                this.cache.delete(key);
            }, this.defaultTTL);
        }
    }

    /**
     * Check if an item exists in the cache and is not expired
     * @param key Cache key
     * @returns True if the item exists and is not expired
     */
    public has(key: string): boolean {
        const item = this.cache.get(key);

        if (!item) {
            return false;
        }

        const now = Date.now();
        const isExpired = now - item.timestamp > this.defaultTTL;

        if (isExpired) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Remove an item from the cache
     * @param key Cache key
     */
    public delete(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Clear all items from the cache
     */
    public clear(): void {
        this.cache.clear();
    }

    /**
     * Get or set an item in the cache
     * @param key Cache key
     * @param fetchFn Function to fetch data if not in cache
     * @param ttl Time to live in milliseconds (optional)
     * @returns The cached or fetched data
     */
    public async getOrSet<T>(
        key: string,
        fetchFn: () => Promise<T>,
        ttl?: number
    ): Promise<T> {
        const cachedData = this.get<T>(key);

        if (cachedData !== undefined) {
            return cachedData;
        }

        const data = await fetchFn();
        this.set(key, data, ttl);
        return data;
    }
}

// Export a singleton instance
export const apiCache = new ApiCache();
