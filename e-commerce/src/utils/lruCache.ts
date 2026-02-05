interface CacheEntry<T> {
	data: T;
	timestamp: number;
}

export class LRUCache<T> {
	private cache: Map<string, CacheEntry<T>> = new Map();
	private ttl: number;
	private maxSize: number;

	constructor(ttl: number = 5 * 60 * 1000, maxSize: number = 50) {
		this.ttl = ttl;
		this.maxSize = maxSize;
	}

	set(key: string, data: T): void {
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;

			if (firstKey !== undefined) {
				this.cache.delete(firstKey);
			}
		}

		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	get(key: string): T | null {
		const entry = this.cache.get(key);

		if (!entry) return null;

		if (Date.now() - entry.timestamp > this.ttl) {
			this.cache.delete(key);
			return null;
		}

		return entry.data;
	}

	has(key: string): boolean {
		return this.get(key) !== null;
	}

	clear(): void {
		this.cache.clear();
	}
}

export const productCache = new LRUCache<any[]>(5 * 60 * 1000);
export const categoryCache = new LRUCache<any[]>(10 * 60 * 1000);
export const bannerCache = new LRUCache<any[]>(10 * 60 * 1000);
