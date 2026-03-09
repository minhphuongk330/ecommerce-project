import { useCallback, useMemo, useState } from "react";

interface UseSelectionOptions<T> {
	data: T[];
	getId?: (item: T) => string | number;
}

interface UseSelectionReturn<T> {
	selectedIds: Set<string | number>;
	selectedItems: T[];
	isAllSelected: boolean;
	isIndeterminate: boolean;
	toggleSelect: (id: string | number) => void;
	toggleAll: () => void;
	clearSelection: () => void;
	setSelectedIds: (ids: Set<string | number>) => void;
	selectCount: number;
	totalCount: number;
}

export function useSelection<T = any>(options: UseSelectionOptions<T>): UseSelectionReturn<T> {
	const { data, getId = (item: any) => item.id } = options;
	const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

	const isAllSelected = useMemo(() => {
		return data.length > 0 && selectedIds.size === data.length;
	}, [data.length, selectedIds.size]);

	const isIndeterminate = useMemo(() => {
		return selectedIds.size > 0 && selectedIds.size < data.length;
	}, [selectedIds.size, data.length]);

	const toggleSelect = useCallback((id: string | number) => {
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	}, []);

	const toggleAll = useCallback(() => {
		setSelectedIds(prev => {
			if (prev.size === data.length && data.length > 0) {
				return new Set();
			}

			return new Set(data.map(item => getId(item)));
		});
	}, [data, getId]);

	const clearSelection = useCallback(() => {
		setSelectedIds(new Set());
	}, []);

	const selectedItems = useMemo(() => {
		return data.filter(item => selectedIds.has(getId(item)));
	}, [data, selectedIds, getId]);

	return {
		selectedIds,
		selectedItems,
		isAllSelected,
		isIndeterminate,
		toggleSelect,
		toggleAll,
		clearSelection,
		setSelectedIds,
		selectCount: selectedIds.size,
		totalCount: data.length,
	};
}
