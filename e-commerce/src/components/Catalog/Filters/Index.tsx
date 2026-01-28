"use client";
import React, { useState, useMemo, useEffect } from "react";
import FiltersAccordion from "./Accordion";
import SearchField from "../../atoms/SearchField";
import Checkbox from "~/components/atoms/Checkbox";
import { FiltersProps, FilterCategory, FilterOption } from "~/types/catalog";
import { attributeService, AttributeDef } from "~/services/attribute";
import FilterDrawer from "./Drawer";
import { useMobileFilter } from "~/contexts/MobileFilterContext";

interface ExtendedFiltersProps extends FiltersProps {
	categoryId?: number;
}

const transformAttributeToFilter = (attr: AttributeDef): FilterCategory => {
	const options: FilterOption[] = attr.value
		? attr.value.split(",").map((val, index) => ({
				id: `${attr.id}-${index}`,
				name: val.trim(),
			}))
		: [];

	return {
		id: attr.id.toString(),
		title: attr.name,
		hasSearch: options.length > 1,
		defaultOpen: false,
		options,
	};
};

const Filters: React.FC<ExtendedFiltersProps> = ({ selectedFilters, toggleFilter, categoryId }) => {
	const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
	const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const mobileContext = useMobileFilter();
	const isMobileOpen = mobileContext?.isMobileDrawerOpen;

	useEffect(() => {
		if (isMobileOpen && mobileContext) {
			mobileContext.setTempFilters(selectedFilters);
		}
	}, [isMobileOpen]);

	const fetchAttributes = async () => {
		try {
			setLoading(true);
			const allAttributes = await attributeService.getAllAttributes();
			const relevantAttributes = categoryId
				? allAttributes.filter(attr => Number(attr.categoryId) === Number(categoryId))
				: allAttributes;
			const transformedCategories = relevantAttributes.map(transformAttributeToFilter);
			setFilterCategories(transformedCategories);
		} catch (error) {
			console.error("Failed to fetch filter attributes", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAttributes();
	}, [categoryId]);

	const handleSearchChange = (catId: string, value: string) => {
		setSearchTerms(prev => ({ ...prev, [catId]: value }));
	};

	const filteredCategories = useMemo(() => {
		return filterCategories.map(category => {
			const currentSearchTerm = searchTerms[category.id] || "";
			if (!currentSearchTerm) return category;
			const filteredOptions = category.options.filter(option =>
				option.name.toLowerCase().includes(currentSearchTerm.toLowerCase()),
			);
			return { ...category, options: filteredOptions };
		});
	}, [searchTerms, filterCategories]);

	if (loading) return <div className="py-4 text-gray-500 text-sm">Loading filters...</div>;
	if (!loading && filterCategories.length === 0) return null;

	return (
		<FilterDrawer>
			<div className="flex flex-col gap-[24px] w-full">
				{filteredCategories.map(category => (
					<FiltersAccordion key={category.id} title={category.title} defaultOpen={category.defaultOpen}>
						{category.hasSearch && (
							<div className="mb-[16px]">
								<SearchField
									value={searchTerms[category.id] || ""}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(category.id, e.target.value)}
								/>
							</div>
						)}

						<div className="flex flex-col gap-[8px]">
							{category.options.map(option => {
								const isChecked = isMobileOpen
									? mobileContext?.tempFilters[category.id]?.includes(option.name) || false
									: selectedFilters[category.id]?.includes(option.name) || false;

								const handleClick = () => {
									if (isMobileOpen && mobileContext) {
										mobileContext.toggleTempFilter(category.id, option.name);
									} else {
										toggleFilter(category.id, option.name);
									}
								};

								return (
									<Checkbox
										key={option.id}
										id={`${category.id}-${option.id}`}
										label={option.name}
										checked={isChecked}
										onChange={handleClick}
									/>
								);
							})}
						</div>
					</FiltersAccordion>
				))}
			</div>
		</FilterDrawer>
	);
};

export default Filters;
