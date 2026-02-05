import { useCallback, useState } from "react";
import { getStorageItem, removeStorageItem, setStorageItem } from "~/utils/storage";

export const useLocalStorage = <T>(
	key: string,
	initialValue: T,
	version: number = 1,
): [T, (value: T | ((val: T) => T)) => void, () => void] => {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const cached = getStorageItem<T>(key, version);
			return cached !== null ? cached : initialValue;
		} catch {
			return initialValue;
		}
	});

	const setValue = useCallback(
		(value: T | ((val: T) => T)) => {
			try {
				const valueToStore = value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				setStorageItem(key, valueToStore, version);
			} catch (error) {
				console.error(`Error setting storage "${key}":`, error);
			}
		},
		[key, version, storedValue],
	);

	const removeValue = useCallback(() => {
		try {
			setStoredValue(initialValue);
			removeStorageItem(key);
		} catch (error) {
			console.error(`Error removing storage "${key}":`, error);
		}
	}, [key, initialValue]);

	return [storedValue, setValue, removeValue];
};
