"use client";
import { TablePagination } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DataTable from "~/components/Table/Data";
import Checkbox from "~/components/atoms/Checkbox";
import StatusChip from "~/components/atoms/StatusChip";
import { AdminCategory, AdminProduct } from "~/types/admin";
import { formatDate, formatPrice } from "~/utils/format";
import UpdateProduct from "../Admin/Products/Modal/Update";

interface Props {
	products: AdminProduct[];
	categories: AdminCategory[];
	onRefresh: () => void;
	selectedIds?: Set<string | number>;
	onSelectChange?: (id: number) => void;
	onSelectAll?: (selected: boolean, ids: number[]) => void;
	isMobileSelectMode?: boolean;
}

const MOBILE_ROWS_PER_PAGE = 5;
const EMPTY_SET = new Set<string | number>();

export default function ProductsTable({
	products,
	categories,
	onRefresh,
	selectedIds = EMPTY_SET,
	onSelectChange,
	onSelectAll,
	isMobileSelectMode = false,
}: Props) {
	const router = useRouter();
	const pathname = usePathname();
	const [isDesktop, setIsDesktop] = useState(false);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
	const [isInitialized, setIsInitialized] = useState(false);


	useEffect(() => {
		if (typeof window !== "undefined") {
			const params = new URLSearchParams(window.location.search);
			const p = params.get("page");
			if (p) {
				const parsed = parseInt(p, 10);
				if (!isNaN(parsed) && parsed > 0) {
					setPaginationModel(prev => ({ ...prev, page: parsed - 1 }));
				}
			}
			setIsInitialized(true);
		}
	}, []);


	useEffect(() => {
		if (!isInitialized) return;

		if (typeof window !== "undefined") {
			const currentParams = new URLSearchParams(window.location.search);
			const urlPage = currentParams.get("page");
			const targetPageStr = (paginationModel.page + 1).toString();

			if (urlPage !== targetPageStr) {
				currentParams.set("page", targetPageStr);
				router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
			}
		}
	}, [paginationModel.page, pathname, router, isInitialized]);

	useEffect(() => {
		const handleResize = () => setIsDesktop(window.innerWidth >= 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const visibleIds = useMemo(() => {
		const start = paginationModel.page * paginationModel.pageSize;
		return products.slice(start, start + paginationModel.pageSize).map(p => p.id);
	}, [products, paginationModel]);

	const handleMobilePageChange = (_event: unknown, newPage: number) => {
		setPaginationModel(prev => ({ ...prev, page: newPage }));
	};

	const columns: GridColDef[] = [
		{
			field: "checkbox",
			headerName: "",
			width: 50,
			minWidth: 50,
			sortable: false,
			filterable: false,
			align: "center" as const,
			headerAlign: "center" as const,
			renderHeader: () => {
				const isAllVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.has(id));
				const isIndeterminate =
					visibleIds.length > 0 && visibleIds.some(id => selectedIds.has(id)) && !isAllVisibleSelected;

				return (
					<Checkbox
						id="select-all"
						checked={isAllVisibleSelected}
						indeterminate={isIndeterminate}
						onChange={() => onSelectAll?.(!isAllVisibleSelected, visibleIds)}
					/>
				);
			},
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<Checkbox
					id={`select-product-${params.row.id}`}
					checked={selectedIds.has(params.row.id)}
					onChange={() => onSelectChange?.(params.row.id)}
				/>
			),
		},
		{
			field: "mainImageUrl",
			headerName: "Hình ảnh",
			width: 100,
			sortable: false,
			align: "center" as const,
			headerAlign: "center" as const,
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center justify-center h-full w-full">
					<div className="relative w-16 h-16 rounded overflow-hidden border border-gray-200 bg-white">
						<Image
							src={params.value || "/placeholder.png"}
							alt="Product Img"
							fill
							sizes="64px"
							className="object-contain p-1"
						/>
					</div>
				</div>
			),
		},
		{ field: "name", headerName: "Tên sản phẩm", flex: 1.5, minWidth: 180, cellClassName: "font-medium text-gray-800" },
		{
			field: "category",
			headerName: "Danh mục",
			flex: 1,
			minWidth: 120,
			valueGetter: (_, row) => row.category?.name || "Chưa phân loại",
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center h-full">
					<StatusChip label={params.value} className="text-gray-600" />
				</div>
			),
		},
		{
			field: "price",
			headerName: "Giá",
			flex: 0.8,
			minWidth: 100,
			type: "number",
			align: "left",
			headerAlign: "left",
			valueFormatter: value => formatPrice(value),
			cellClassName: "font-semibold text-gray-900",
		},
		{
			field: "stock",
			headerName: "Tồn kho",
			flex: 0.6,
			minWidth: 80,
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center h-full">
					<span className={`font-bold ${params.value < 10 ? "text-red-600" : "text-green-600"}`}>{params.value}</span>
				</div>
			),
		},
		{
			field: "isActive",
			headerName: "Trạng thái",
			flex: 0.7,
			minWidth: 100,
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center h-full">
					<StatusChip label={params.value ? "Hoạt động" : "Ẩn"} color={params.value ? "success" : "default"} />
				</div>
			),
		},
		{
			field: "createdAt",
			headerName: "Ngày tạo",
			flex: 0.8,
			minWidth: 110,
			valueFormatter: value => formatDate(value),
			cellClassName: "text-gray-500 text-sm",
		},
		{
			field: "actions",
			headerName: "Thao tác",
			flex: 0.5,
			minWidth: 80,
			sortable: false,
			renderCell: (params: GridRenderCellParams<AdminProduct>) => (
				<div className="flex items-center gap-2 h-full">
					<UpdateProduct product={params.row} categories={categories} onSuccess={onRefresh} />
				</div>
			),
		},
	];

	return (
		<>
			{isDesktop && (
				<div className="hidden md:block w-full h-[600px]">
					<DataTable
						rows={products}
						columns={columns}
						rowHeight={70}
						noRowsLabel="Chưa có sản phẩm nào."
						paginationModel={paginationModel}
						onPaginationModelChange={setPaginationModel}
					/>
				</div>
			)}

			<div className="md:hidden flex flex-col pb-20">
				<div className="flex flex-col gap-4">
					{products.length === 0 ? (
						<div className="text-center text-gray-500 py-10">Chưa có sản phẩm nào.</div>
					) : (
						products
							.slice(paginationModel.page * MOBILE_ROWS_PER_PAGE, paginationModel.page * MOBILE_ROWS_PER_PAGE + MOBILE_ROWS_PER_PAGE)
							.map(product => (
								<div
									key={product.id}
									className={`bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-3 ${
										selectedIds.has(product.id) ? "border-blue-300 bg-blue-50" : "border-gray-100"
									}`}
									onClick={() => isMobileSelectMode && onSelectChange?.(product.id)}
								>
									<div className="flex gap-4">
										{isMobileSelectMode && (
											<div className="flex items-center flex-shrink-0">
												<Checkbox
													id={`mobile-select-${product.id}`}
													checked={selectedIds.has(product.id)}
													onChange={() => onSelectChange?.(product.id)}
												/>
											</div>
										)}
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
													Tồn kho: {product.stock}
												</span>
											</div>
											<h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">
												{product.name}
											</h3>
											<div>
												<span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
													{product.category?.name || "Chưa phân loại"}
												</span>
											</div>
										</div>
									</div>

									<div className="w-full h-[1px] bg-gray-100"></div>

									<div className="flex items-center justify-between">
										<span className="text-base font-bold text-black">{formatPrice(product.price)}</span>
										<div className="flex items-center gap-3">
											<StatusChip
												label={product.isActive ? "Hoạt động" : "Ẩn"}
												color={product.isActive ? "success" : "default"}
												className="!h-6 !text-xs"
											/>
											<span className="text-xs text-gray-400">{formatDate(product.createdAt)}</span>
											<UpdateProduct product={product} categories={categories} onSuccess={onRefresh} />
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
								page={paginationModel.page}
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
