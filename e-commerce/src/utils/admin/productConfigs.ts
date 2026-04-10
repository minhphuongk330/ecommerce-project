import { AdminCategory, AdminProduct } from "~/types/admin";
import { FilterConfig } from "~/types/filter";
import { ExportColumn } from "~/utils/export";
import { formatPrice } from "~/utils/format";

export const getProductFilterConfig = (categories: AdminCategory[]): FilterConfig => ({
	fields: [
		{
			name: "name",
			label: "Product Name",
			type: "text",
			placeholder: "Search by product name...",
		},
		{
			name: "category.name",
			label: "Category",
			type: "select",
			options: categories.map(cat => ({
				label: cat.name,
				value: cat.name,
			})),
		},
		{
			name: "priceRange",
			label: "Price",
			type: "numberrange",
			placeholder: "e.g. 100 - 500",
		},
		{
			name: "createdAt",
			label: "Created Date",
			type: "daterange",
		},
	],
});

export const PRODUCT_FILTER_PREDICATES = {
	name: (item: AdminProduct, filters: any) => {
		const searchTerm = filters.name;
		if (!searchTerm) return true;
		return item.name.toLowerCase().includes(searchTerm.toLowerCase());
	},
	"category.name": (item: AdminProduct, filters: any) => {
		const categoryFilter = filters["category.name"];
		if (!categoryFilter) return true;
		return item.category?.name === categoryFilter;
	},
	priceRange: (item: AdminProduct, filters: any) => {
		const range = filters.priceRange;
		if (!Array.isArray(range)) return true;
		const [min, max] = range;
		const price = Number(item.price);
		if (min !== null && min !== "" && !isNaN(Number(min)) && price < Number(min)) return false;
		if (max !== null && max !== "" && !isNaN(Number(max)) && price > Number(max)) return false;
		return true;
	},
	createdAt: (item: AdminProduct, filters: any) => {
		const range = filters.createdAt;
		if (!Array.isArray(range)) return true;
		const [from, to] = range;
		const itemDateStr = new Date(item.createdAt).toLocaleDateString("en-CA");
		if (from && from > itemDateStr) return false;
		if (to && to < itemDateStr) return false;
		return true;
	},
};

export const PRODUCT_EXPORT_COLUMNS: ExportColumn<AdminProduct>[] = [
	{ key: "name" as const, label: "Product Name" },
	{ key: "category.name" as any, label: "Category" },
	{
		key: "price" as const,
		label: "Price",
		formatter: (value: any) => (value != null && !isNaN(value) ? formatPrice(value) : ""),
	},
	{ key: "stock" as const, label: "Stock" },
];
