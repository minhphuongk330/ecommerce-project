import { useCallback, useMemo, useState } from "react";
import { FilterConfig, FilterPredicate, FilterState } from "~/types/filter";

interface UseTableFilterOptions<T> {
	data: T[];
	config: FilterConfig;
	predicates?: Record<string, FilterPredicate<T>>;
}

interface UseTableFilterReturn<T> {
	filteredData: T[];
	filterState: FilterState;
	setFilterValue: (fieldName: string, value: any) => void;
	setMultipleFilters: (filters: Partial<FilterState>) => void;
	resetFilters: () => void;
	clearFilter: (fieldName: string) => void;
	isFiltered: boolean;
}

export function useTableFilter<T = any>(options: UseTableFilterOptions<T>): UseTableFilterReturn<T> {
	const { data, config, predicates = {} } = options;
	const [filterState, setFilterState] = useState<FilterState>(config.defaultValues || {});
	const setFilterValue = useCallback((fieldName: string, value: any) => {
		setFilterState(prev => ({
			...prev,
			[fieldName]: value,
		}));
	}, []);
	const setMultipleFilters = useCallback((filters: Partial<FilterState>) => {
		setFilterState(prev => ({
			...prev,
			...filters,
		}));
	}, []);
	const clearFilter = useCallback((fieldName: string) => {
		setFilterState(prev => {
			const newState = { ...prev };
			delete newState[fieldName];
			return newState;
		});
	}, []);
	const resetFilters = useCallback(() => {
		setFilterState(config.defaultValues || {});
	}, [config.defaultValues]);
	const isFiltered = useMemo(() => {
		const defaults = config.defaultValues || {};
		return Object.entries(filterState).some(([key, value]) => {
			const defaultValue = defaults[key];
			if (Array.isArray(value)) {
				return value.length > 0;
			}
			return value !== undefined && value !== null && value !== "" && value !== defaultValue;
		});
	}, [filterState, config.defaultValues]);
	const filteredData = useMemo(() => {
		if (!filterState || Object.keys(filterState).length === 0) {
			return data;
		}
		return data.filter(item => {
			for (const field of config.fields) {
				const filterValue = filterState[field.name];
				if (filterValue === undefined || filterValue === null || filterValue === "") {
					continue;
				}
				if (predicates[field.name]) {
					if (!predicates[field.name](item, filterState)) {
						return false;
					}
					continue;
				}
				switch (field.type) {
					case "text": {
						const searchText = String(filterValue).toLowerCase();
						const textFields = ["name", "title", "fullName", "email", "description"];
						const found = textFields.some(propName => {
							const value = getNestedProperty(item, propName);
							return value && String(value).toLowerCase().includes(searchText);
						});
						if (!found) return false;
						break;
					}
					case "select": {
						const itemValue = getNestedProperty(item, field.name);
						if (itemValue !== filterValue) {
							return false;
						}
						break;
					}
					case "multiselect": {
						const itemValue = getNestedProperty(item, field.name);
						if (Array.isArray(filterValue)) {
							if (!filterValue.includes(itemValue)) {
								return false;
							}
						}
						break;
					}
					case "number": {
						const itemValue = Number(getNestedProperty(item, field.name));
						const numValue = Number(filterValue);
						if (itemValue !== numValue) {
							return false;
						}
						break;
					}
					case "date": {
						const itemValue = getNestedProperty(item, field.name);
						if (itemValue !== filterValue) {
							return false;
						}
						break;
					}
					case "daterange": {
						const itemDateStr = getNestedProperty(item, field.name) as string;
						if (!itemDateStr) return false;

						const itemDate = new Date(itemDateStr);
						const [startDateStr, endDateStr] = filterValue as [string, string];

						if (startDateStr) {
							const startDate = new Date(startDateStr);
							startDate.setHours(0, 0, 0, 0);
							if (itemDate < startDate) {
								return false;
							}
						}

						if (endDateStr) {
							const endDate = new Date(endDateStr);
							endDate.setHours(23, 59, 59, 999);
							if (itemDate > endDate) {
								return false;
							}
						}
						break;
					}
				}
			}
			return true;
		});
	}, [data, filterState, config.fields, predicates]);

	return {
		filteredData,
		filterState,
		setFilterValue,
		setMultipleFilters,
		resetFilters,
		clearFilter,
		isFiltered,
	};
}

function getNestedProperty(obj: any, path: string): any {
	return path.split(".").reduce((current, prop) => current?.[prop], obj);
}
