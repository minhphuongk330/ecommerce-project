"use client";
import { createContext, useContext } from "react";

type FilterRecord = Record<string, string[]>;

interface MobileFilterContextType {
	isMobileDrawerOpen: boolean;
	tempFilters: FilterRecord;
	setTempFilters: React.Dispatch<React.SetStateAction<FilterRecord>>;
	toggleTempFilter: (categoryId: string, optionName: string) => void;
}

export const MobileFilterContext = createContext<MobileFilterContextType | undefined>(undefined);

export const useMobileFilter = () => {
	const context = useContext(MobileFilterContext);
	return context;
};
