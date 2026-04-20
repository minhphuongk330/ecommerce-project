"use client";
import { useState, useMemo, useEffect } from "react";
import FiltersAccordion from "./Accordion";
import CategoryList from "./CategoryList";
import PriceRangeFilter from "./PriceRangeFilter";
import SearchField from "../../atoms/SearchField";
import Checkbox from "~/components/atoms/Checkbox";
import { FiltersProps, FilterCategory, FilterOption } from "~/types/catalog";
import { attributeService, AttributeDef } from "~/services/attribute";
import { productService } from "~/services/product";
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

	const normalizedId = attr.name.toLowerCase().replace(/\s+/g, "_");

	return {
		id: normalizedId,
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
	const [priceRange, setPriceRange] = useState<{ minPrice: number; maxPrice: number } | null>(null);
	const { isMobileDrawerOpen, tempFilters, setTempFilters, toggleTempFilter } = useMobileFilter();

	useEffect(() => {
		if (isMobileDrawerOpen) {
			setTempFilters(selectedFilters);
		}
	}, [isMobileDrawerOpen, selectedFilters, setTempFilters]);

	useEffect(() => {
		if (!categoryId) {
			setLoading(false);
			return;
		}
		const run = async () => {
			try {
				setLoading(true);
				const allAttributes = await attributeService.getAllAttributes();
				setFilterCategories(
					allAttributes
						.filter(attr => Number(attr.categoryId) === Number(categoryId))
						.map(transformAttributeToFilter),
				);
			} catch (error) {
				console.error("Failed to fetch filter attributes", error);
			} finally {
				setLoading(false);
			}
		};
		run();
	}, [categoryId]);

	useEffect(() => {
		if (!categoryId) return;
		productService
			.getPriceRange(categoryId)
			.then(setPriceRange)
			.catch(() => {
				setPriceRange({ minPrice: 0, maxPrice: 10000 });
			});
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

	if (!categoryId) {
		return (
			<FilterDrawer>
				<CategoryList showTitle />
			</FilterDrawer>
		);
	}

	if (filterCategories.length === 0) return null;

	return (
		<FilterDrawer>
			<div className="flex flex-col gap-[24px] w-full">
				<FiltersAccordion title="All Categories" defaultOpen={false}>
					<CategoryList />
				</FiltersAccordion>
				{priceRange && <PriceRangeFilter minPrice={priceRange.minPrice} maxPrice={priceRange.maxPrice} />}
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
								const isChecked = isMobileDrawerOpen
									? tempFilters[category.id]?.includes(option.name) || false
									: selectedFilters[category.id]?.includes(option.name) || false;

								const handleClick = () => {
									if (isMobileDrawerOpen) {
										toggleTempFilter(category.id, option.name);
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
