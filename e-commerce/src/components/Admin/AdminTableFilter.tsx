"use client";
import React, { useState } from "react";
import Dropdown, { DropdownOption } from "~/components/atoms/Dropdown";
import SearchField from "~/components/atoms/SearchField";

export interface FilterConfig {
	searchPlaceholder: string;
	filterOptions?: {
		[key: string]: DropdownOption[];
	};
}

interface AdminTableFilterProps {
	config: FilterConfig;
	onSearch: (searchTerm: string) => void;
	onFilterChange?: (filterKey: string, filterValue: string) => void;
}

export default function AdminTableFilter({ config, onSearch, onFilterChange }: AdminTableFilterProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [filters, setFilters] = useState<Record<string, string>>({});

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		onSearch(value);
	};

	const handleFilterChange = (filterKey: string, value: string) => {
		const newFilters = { ...filters, [filterKey]: value };
		setFilters(newFilters);
		onFilterChange?.(filterKey, value);
	};

	const handleClear = () => {
		setSearchTerm("");
		setFilters({});
		onSearch("");
		if (config.filterOptions) {
			Object.keys(config.filterOptions).forEach(key => {
				onFilterChange?.(key, "");
			});
		}
	};

	return (
		<div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-3">
			<div className="flex flex-col gap-3 md:flex-row md:gap-3">
				<div className="flex-1 min-w-0">
					<SearchField value={searchTerm} onChange={handleSearchChange} placeholder={config.searchPlaceholder} />
				</div>

				{config.filterOptions &&
					Object.entries(config.filterOptions).map(([filterKey, options]) => (
						<div key={filterKey} className="w-full md:w-48">
							<Dropdown
								value={filters[filterKey] || ""}
								options={[{ value: "", label: `All ${filterKey}` }, ...options]}
								onChange={value => handleFilterChange(filterKey, value)}
								className="!w-full !h-[40px]"
							/>
						</div>
					))}

				{(searchTerm || Object.values(filters).some(v => v)) && (
					<button
						onClick={handleClear}
						className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
					>
						Clear
					</button>
				)}
			</div>
		</div>
	);
}
