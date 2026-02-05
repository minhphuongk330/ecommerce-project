import { useCallback, useEffect, useRef, useState } from "react";

const fetchCache = new Map<string, Promise<any>>();
const dataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000;

interface UseFetchOptions {
	skip?: boolean;
	cacheDuration?: number;
	onError?: (error: any) => void;
}

export const useFetch = <T = any>(url: string, options: UseFetchOptions = {}) => {
	const { skip = false, cacheDuration = CACHE_DURATION, onError } = options;
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const isMountedRef = useRef(true);

	const fetchData = useCallback(async () => {
		if (skip || !url) {
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			const cached = dataCache.get(url);
			if (cached && Date.now() - cached.timestamp < cacheDuration) {
				if (isMountedRef.current) {
					setData(cached.data);
					setIsLoading(false);
				}
				return;
			}

			let fetchPromise = fetchCache.get(url);
			if (!fetchPromise) {
				fetchPromise = fetch(url).then(res => {
					if (!res.ok) throw new Error(`HTTP ${res.status}`);
					return res.json();
				});
				fetchCache.set(url, fetchPromise);
			}
			const result = await fetchPromise;
			dataCache.set(url, {
				data: result,
				timestamp: Date.now(),
			});

			if (isMountedRef.current) {
				setData(result);
				setError(null);
			}

			fetchCache.delete(url);
		} catch (err) {
			if (isMountedRef.current) {
				setError(err);
				onError?.(err);
			}
			fetchCache.delete(url);
		} finally {
			if (isMountedRef.current) {
				setIsLoading(false);
			}
		}
	}, [url, skip, cacheDuration, onError]);

	useEffect(() => {
		isMountedRef.current = true;
		fetchData();

		return () => {
			isMountedRef.current = false;
		};
	}, [fetchData]);

	return { data, error, isLoading };
};

export const clearFetchCache = () => {
	fetchCache.clear();
	dataCache.clear();
};

export const clearFetchCacheEntry = (url: string) => {
	fetchCache.delete(url);
	dataCache.delete(url);
};
