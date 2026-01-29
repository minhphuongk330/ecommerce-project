"use client";
import React, { createContext, useContext, useState } from "react";

type FilterRecord = Record<string, string[]>;

interface MobileFilterContextType {
	isMobileDrawerOpen: boolean;
	setIsMobileDrawerOpen: (open: boolean) => void;
	tempFilters: FilterRecord;
	setTempFilters: React.Dispatch<React.SetStateAction<FilterRecord>>;
	toggleTempFilter: (categoryId: string, optionName: string) => void;
}

const MobileFilterContext = createContext<MobileFilterContextType | undefined>(undefined);

export const MobileFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
	const [tempFilters, setTempFilters] = useState<FilterRecord>({});

	const toggleTempFilter = (categoryId: string, optionName: string) => {
		setTempFilters(prev => {
			const currentOptions = prev[categoryId] || [];
			const newOptions = currentOptions.includes(optionName)
				? currentOptions.filter(o => o !== optionName)
				: [...currentOptions, optionName];
			return { ...prev, [categoryId]: newOptions };
		});
	};

	return (
		<MobileFilterContext.Provider
			value={{
				isMobileDrawerOpen,
				setIsMobileDrawerOpen,
				tempFilters,
				setTempFilters,
				toggleTempFilter,
			}}
		>
			{children}
		</MobileFilterContext.Provider>
	);
};

export const useMobileFilter = () => {
	const context = useContext(MobileFilterContext);
	if (!context) throw new Error("useMobileFilter must be used within MobileFilterProvider");
	return context;
};
