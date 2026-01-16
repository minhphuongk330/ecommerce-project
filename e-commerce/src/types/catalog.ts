import React from "react";
import { Product } from "./product";
export interface AccordionProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}
export interface FilterOption {
	id: string | number;
	name: string;
}
export interface FilterCategory {
	id: string;
	title: string;
	options: FilterOption[];
	hasSearch?: boolean;
	defaultOpen?: boolean;
}

export interface FiltersProps {
	selectedFilters: Record<string, string[]>;
	toggleFilter: (categoryId: string, itemValue: string) => void;
}

export interface ListHeaderProps {
	count: number;
}

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}
export interface CheckboxProps {
	id: string;
	label: string;
	checked: boolean;
	onChange: () => void;
}
