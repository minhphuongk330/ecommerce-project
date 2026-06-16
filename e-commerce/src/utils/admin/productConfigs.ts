import { AdminCategory, AdminProduct } from "~/types/admin";
import { FilterConfig } from "~/types/filter";
import { ExportColumn } from "~/utils/export";
import { formatPrice } from "~/utils/format";

export const getProductFilterConfig = (categories: AdminCategory[]): FilterConfig => ({
	fields: [
		{
			name: "name",
			label: "Tên sản phẩm",
			type: "text",
			placeholder: "Tìm kiếm theo tên sản phẩm...",
		},
		{
			name: "category.name",
			label: "Danh mục",
			type: "select",
			options: categories.map(cat => ({
				label: cat.name,
				value: cat.name,
			})),
		},
		{
			name: "priceRange",
			label: "Giá",
			type: "numberrange",
			placeholder: "Ví dụ: 100k - 500k",
		},
		{
			name: "createdAt",
			label: "Ngày tạo",
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
	{ key: "name" as const, label: "Tên sản phẩm" },
	{ key: "category.name" as any, label: "Danh mục" },
	{
		key: "price" as const,
		label: "Giá",
		formatter: (value: any) => (value != null && !isNaN(value) ? formatPrice(value) : ""),
	},
	{ key: "stock" as const, label: "Tồn kho" },
];
