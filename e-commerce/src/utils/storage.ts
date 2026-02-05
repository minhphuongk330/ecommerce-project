interface StorageSchema<T> {
	version: number;
	data: T;
}

const STORAGE_VERSION = 1;

export const setStorageItem = <T>(key: string, value: T, version: number = STORAGE_VERSION): void => {
	try {
		const schema: StorageSchema<T> = {
			version,
			data: value,
		};
		localStorage.setItem(key, JSON.stringify(schema));
	} catch (error) {
		console.error(`Failed to set localStorage item "${key}":`, error);
	}
};

export const getStorageItem = <T>(key: string, expectedVersion: number = STORAGE_VERSION): T | null => {
	try {
		const item = localStorage.getItem(key);
		if (!item) return null;
		const schema: StorageSchema<T> = JSON.parse(item);
		if (schema.version !== expectedVersion) {
			console.warn(`Storage schema version mismatch for "${key}". Clearing data.`);
			localStorage.removeItem(key);
			return null;
		}

		return schema.data;
	} catch (error) {
		console.error(`Failed to get localStorage item "${key}":`, error);
		return null;
	}
};

export const removeStorageItem = (key: string): void => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(`Failed to remove localStorage item "${key}":`, error);
	}
};

export const clearAllStorage = (): void => {
	try {
		localStorage.clear();
	} catch (error) {
		console.error("Failed to clear localStorage:", error);
	}
};

export const STORAGE_KEYS = {
	CART: { key: "cart_items", version: 1 },
	USER_PREFERENCES: { key: "user_prefs", version: 1 },
	FILTERS: { key: "filters", version: 1 },
	AUTH_TOKEN: { key: "auth_token", version: 1 },
} as const;
