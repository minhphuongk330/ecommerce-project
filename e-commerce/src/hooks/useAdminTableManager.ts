import { useCallback, useEffect, useRef, useState } from "react";
import { useTableFilter } from "~/hooks/useTableFilter";
import { FilterConfig, FilterState } from "~/types/filter";

interface AdminTableManagerConfig<T> {
	filterConfig: FilterConfig;
	predicates: Record<string, (item: T, filters: FilterState) => boolean>;
	fetchFn: () => Promise<T[]>;
	onFetchError?: (error: unknown) => void;
}

export function useAdminTableManager<T extends { id: number }>(config: AdminTableManagerConfig<T>) {
	const [allData, setAllData] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

	const onFetchErrorRef = useRef(config.onFetchError);
	useEffect(() => {
		onFetchErrorRef.current = config.onFetchError;
	}, [config.onFetchError]);

	const { filteredData, filterState, setFilterValue, resetFilters, isFiltered } = useTableFilter({
		data: allData,
		config: config.filterConfig,
		predicates: config.predicates,
	});

	const selectedItems = filteredData.filter(item => selectedIds.has(item.id));
	const selectCount = selectedIds.size;

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			const data = await config.fetchFn();
			setAllData(data);
		} catch (error) {
			console.error("Fetch error:", error);
			onFetchErrorRef.current?.(error);
		} finally {
			setLoading(false);
		}
	}, [config.fetchFn]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSelectChange = useCallback((id: number) => {
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			if (newSet.has(id)) newSet.delete(id);
			else newSet.add(id);
			return newSet;
		});
	}, []);

	const handleSelectAllVisible = useCallback((selected: boolean, visibleIds: number[]) => {
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			if (selected) {
				visibleIds.forEach(id => newSet.add(id));
			} else {
				visibleIds.forEach(id => newSet.delete(id));
			}
			return newSet;
		});
	}, []);

	const clearSelection = useCallback(() => {
		setSelectedIds(new Set());
	}, []);

	const setData = useCallback((data: T[]) => {
		setAllData(data);
	}, []);

	return {
		allData,
		filteredData,
		loading,
		selectedIds,
		selectedItems,
		selectCount,
		filterState,
		isFiltered,
		setFilterValue,
		resetFilters,
		handleSelectChange,
		handleSelectAllVisible,
		clearSelection,
		fetchData,
		setData,
	};
}
