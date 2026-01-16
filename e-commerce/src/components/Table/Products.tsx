"use client";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { AdminProduct, AdminCategory } from "~/types/admin";
import { formatPrice } from "~/utils/format";
import DataTable from "~/components/Table/Data";
import StatusChip from "~/components/atoms/StatusChip";
import UpdateProduct from "../Admin/Products/Modal/Update";
import DeleteProduct from "../Admin/Products/Modal/Delete";

interface Props {
	products: AdminProduct[];
	categories: AdminCategory[];
	onRefresh: () => void;
}

export default function ProductsTable({ products, categories, onRefresh }: Props) {
	const columns: GridColDef[] = [
		{
			field: "id",
			headerName: "ID",
			width: 100,
			valueGetter: (_, row) => `#${row.id}`,
		},
		{
			field: "mainImageUrl",
			headerName: "Image",
			width: 150,
			sortable: false,
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center h-full">
					<img
						src={params.value || "/placeholder.png"}
						alt="Product Img"
						className="w-10 h-10 object-cover rounded border border-gray-200"
					/>
				</div>
			),
		},
		{
			field: "name",
			headerName: "Product name",
			width: 250,
			cellClassName: "font-medium text-gray-800",
		},
		{
			field: "category",
			headerName: "Category",
			width: 200,
			valueGetter: (_, row) => row.category?.name || "Uncategorized",
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center h-full">
					<StatusChip label={params.value} className="text-gray-600" />
				</div>
			),
		},
		{
			field: "price",
			headerName: "Price ($)",
			width: 180,
			valueFormatter: value => formatPrice(value),
			cellClassName: "font-semibold text-gray-900",
		},
		{
			field: "stock",
			headerName: "Stock",
			width: 150,
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center h-full">
					<span className={`font-bold ${params.value < 10 ? "text-red-600" : "text-green-600"}`}>{params.value}</span>
				</div>
			),
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 150,
			sortable: false,
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center gap-2 h-full">
					<UpdateProduct product={params.row} categories={categories} onSuccess={onRefresh} />
					<DeleteProduct id={params.row.id} onSuccess={onRefresh} />
				</div>
			),
		},
	];

	return <DataTable rows={products} columns={columns} rowHeight={70} noRowsLabel="No products available yet." />;
}
