"use client";
import { useEffect, useMemo, useState } from "react";
import Checkbox from "~/components/atoms/Checkbox";
import { useMobileFilter } from "~/contexts/MobileFilterContext";
import { AttributeDef, attributeService } from "~/services/attribute";
import { productService } from "~/services/product";
import { FilterCategory, FilterOption, FiltersProps } from "~/types/catalog";
import SearchField from "../../atoms/SearchField";
import FiltersAccordion from "./Accordion";
import CategoryList from "./CategoryList";
import FilterDrawer from "./Drawer";
import PriceRangeFilter from "./PriceRangeFilter";

interface ExtendedFiltersProps extends FiltersProps {
	categoryId?: number;
}

const specLabels: Record<string, string> = {
	os: 'Hệ điều hành',
	cpu: 'Chip xử lý (CPU)',
	ram: 'RAM',
	storage: 'Dung lượng lưu trữ',
	screenSize: 'Màn hình rộng',
	screenTech: 'Công nghệ màn hình',
	rearCamera: 'Độ phân giải camera sau',
	frontCamera: 'Độ phân giải camera trước',
	battery: 'Dung lượng pin',
	charging: 'Hỗ trợ sạc tối đa',
	network: 'Mạng di động',
	sim: 'SIM',
	utilities: 'Tiện ích & Bảo mật',
	material: 'Chất liệu',
	dimensions: 'Kích thước, khối lượng',
	screen: 'Màn hình',
	chip: 'Chip xử lý',
	gpu: 'Đồ họa',
	weight: 'Trọng lượng',
	ports: 'Cổng kết nối',
	connectivity: 'Kết nối',
	design: 'Thiết kế',
	health: 'Sức khỏe',
	sports: 'Thể thao',
	waterproof: 'Chống nước',
	compatibility: 'Tương thích',
	chargingPort: 'Cổng sạc',
	audioTech: 'Công nghệ âm thanh',
	micro: 'Micro',
	resolution: 'Độ phân giải',
	viewAngle: 'Góc nhìn',
	nightVision: 'Tầm nhìn đêm',
	power: 'Nguồn điện',
	wifi: 'WiFi',
	bluetooth: 'Bluetooth',
	brand: 'Thương hiệu',
	vision: 'Tầm nhìn ban đêm',
};

const formatSpecLabel = (key: string): string => {
	if (specLabels[key]) return specLabels[key];
	return key
		.replace(/_/g, ' ')
		.replace(/([A-Z])/g, ' $1')
		.trim()
		.replace(/^\w/, (c) => c.toUpperCase());
};

const transformAttributeToFilter = (attr: AttributeDef): FilterCategory => {
	const options: FilterOption[] = attr.value
		? attr.value.split(",").map((val, index) => ({
			id: `${attr.id}-${index}`,
			name: val.trim(),
		}))
		: [];

	return {
		id: attr.name,
		title: formatSpecLabel(attr.name),
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
					allAttributes.filter(attr => Number(attr.categoryId) === Number(categoryId)).map(transformAttributeToFilter),
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
		productService
			.getPriceRange(categoryId)
			.then(setPriceRange)
			.catch(() => {
				setPriceRange({ minPrice: 0, maxPrice: 100000000 });
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
				<FiltersAccordion title="Tất cả danh mục" defaultOpen={false}>
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
