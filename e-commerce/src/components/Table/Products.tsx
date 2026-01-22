"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { TablePagination } from "@mui/material";
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
	const [mobilePage, setMobilePage] = useState(0);
	const MOBILE_ROWS_PER_PAGE = 5;
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsDesktop(window.innerWidth >= 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleMobilePageChange = (event: unknown, newPage: number) => {
		setMobilePage(newPage);
	};

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 80, valueGetter: (_, row) => `#${row.id}` },
		{
			field: "mainImageUrl",
			headerName: "Image",
			width: 100,
			sortable: false,
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="relative w-10 h-10 rounded overflow-hidden border border-gray-200">
					<Image
						src={params.value || "/placeholder.png"}
						alt="Product Img"
						fill
						sizes="40px"
						className="object-cover"
					/>
				</div>
			),
		},
		{ field: "name", headerName: "Product name", width: 250, cellClassName: "font-medium text-gray-800" },
		{
			field: "category",
			headerName: "Category",
			width: 150,
			valueGetter: (_, row) => row.category?.name || "Uncategorized",
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center h-full">
					<StatusChip label={params.value} className="text-gray-600" />
				</div>
			),
		},
		{
			field: "price",
			headerName: "Price",
			width: 120,
			valueFormatter: value => formatPrice(value),
			cellClassName: "font-semibold text-gray-900",
		},
		{
			field: "stock",
			headerName: "Stock",
			width: 100,
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center h-full">
					<span className={`font-bold ${params.value < 10 ? "text-red-600" : "text-green-600"}`}>{params.value}</span>
				</div>
			),
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 120,
			sortable: false,
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center gap-2 h-full">
					<UpdateProduct product={params.row} categories={categories} onSuccess={onRefresh} />
					<DeleteProduct id={params.row.id} onSuccess={onRefresh} />
				</div>
			),
		},
	];

	return (
		<>
			{isDesktop && (
				<div className="hidden md:block w-full h-[600px]">
					<DataTable rows={products} columns={columns} rowHeight={70} noRowsLabel="No products available yet." />
				</div>
			)}

			<div className="md:hidden flex flex-col pb-20">
				<div className="flex flex-col gap-4">
					{products.length === 0 ? (
						<div className="text-center text-gray-500 py-10">No products available.</div>
					) : (
						products
							.slice(mobilePage * MOBILE_ROWS_PER_PAGE, mobilePage * MOBILE_ROWS_PER_PAGE + MOBILE_ROWS_PER_PAGE)
							.map(product => (
								<div
									key={product.id}
									className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3"
								>
									<div className="flex gap-4">
										<div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg flex items-center justify-center p-1 border border-gray-100 relative overflow-hidden">
											<Image
												src={product.mainImageUrl || "/placeholder.png"}
												alt={product.name}
												fill
												sizes="80px"
												className="object-contain mix-blend-multiply p-1"
											/>
										</div>
										<div className="flex-1 min-w-0 flex flex-col justify-center">
											<div className="flex justify-between items-start mb-1">
												<span className="text-xs font-bold text-gray-400">#{product.id}</span>
												<span
													className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock < 10 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
												>
													Stock: {product.stock}
												</span>
											</div>
											<h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">
												{product.name}
											</h3>
											<div>
												<span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
													{product.category?.name || "Uncategorized"}
												</span>
											</div>
										</div>
									</div>

									<div className="w-full h-[1px] bg-gray-100"></div>

									<div className="flex items-center justify-between">
										<span className="text-base font-bold text-black">{formatPrice(product.price)}</span>
										<div className="flex gap-2">
											<UpdateProduct product={product} categories={categories} onSuccess={onRefresh} />
											<DeleteProduct id={product.id} onSuccess={onRefresh} />
										</div>
									</div>
								</div>
							))
					)}
				</div>

				{products.length > 0 && (
					<div className="flex justify-center mt-6">
						<div className="bg-white rounded-full shadow-sm border border-gray-200 px-2 py-1">
							<TablePagination
								component="div"
								count={products.length}
								page={mobilePage}
								onPageChange={handleMobilePageChange}
								rowsPerPage={MOBILE_ROWS_PER_PAGE}
								rowsPerPageOptions={[]}
								onRowsPerPageChange={() => {}}
								sx={{
									".MuiToolbar-root": { padding: 0, minHeight: "40px", width: "auto" },
									".MuiTablePagination-spacer": { display: "none" },
									".MuiTablePagination-selectLabel, .MuiInputBase-root": { display: "none" },
									".MuiTablePagination-displayedRows": {
										margin: 0,
										fontSize: "14px",
										fontWeight: 600,
										color: "#111827",
										fontFamily: "inherit",
									},
									".MuiTablePagination-actions": {
										marginLeft: 1,
										marginRight: 0,
										"& button": {
											padding: "6px",
											borderRadius: "50%",
											color: "#4b5563",
											transition: "all 0.2s",
											"&:hover": { backgroundColor: "#f3f4f6", color: "#000" },
											"&.Mui-disabled": { opacity: 0.3 },
										},
									},
								}}
							/>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
