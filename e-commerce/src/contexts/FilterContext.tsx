"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { FiltersProps } from "~/types/catalog";

const FilterContext = createContext<FiltersProps | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
	const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

	const toggleFilter = (categoryId: string, itemValue: string) => {
		setSelectedFilters(prev => {
			const currentList = prev[categoryId] || [];
			const newList = currentList.includes(itemValue)
				? currentList.filter(item => item !== itemValue)
				: [...currentList, itemValue];
			return { ...prev, [categoryId]: newList };
		});
	};
	return <FilterContext.Provider value={{ selectedFilters, toggleFilter }}>{children}</FilterContext.Provider>;
};

export const useFilter = () => {
	const context = useContext(FilterContext);
	if (!context) throw new Error("useFilter must be used within a FilterProvider");
	return context;
};
