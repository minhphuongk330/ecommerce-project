"use client";
import CloseIcon from "@mui/icons-material/Close";
import TablePagination from "@mui/material/TablePagination";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Checkbox from "~/components/atoms/Checkbox";
import StatusChip, { ChipColor } from "~/components/atoms/StatusChip";
import DataTable from "~/components/Table/Data";
import { AdminOrder } from "~/types/admin";
import { formatDate, formatPrice } from "~/utils/format";
import { router } from "~/utils/router";
import Dropdown, { DropdownOption } from "../atoms/Dropdown";

const STATUS_COLORS: Record<string, ChipColor> = {
	Pending: "warning",
	Shipped: "primary",
	Completed: "success",
	Cancelled: "error",
};

const STATUS_OPTIONS: DropdownOption[] = [
	{ value: "Pending", label: "Pending" },
	{ value: "Shipped", label: "Shipped" },
	{ value: "Completed", label: "Completed" },
	{ value: "Cancelled", label: "Cancelled" },
];

interface Props {
	orders: AdminOrder[];
	onStatusChange: (orderId: number, newStatus: string) => void;
	selectedIds?: Set<string | number>;
	onSelectChange?: (id: number) => void;
	onSelectAll?: (selected: boolean, ids: number[]) => void;
}

export default function OrdersTable({
	orders,
	onStatusChange,
	selectedIds = new Set(),
	onSelectChange,
	onSelectAll,
}: Props) {
	const [mobilePage, setMobilePage] = useState(0);
	const MOBILE_ROWS_PER_PAGE = 5;
	const [isDesktop, setIsDesktop] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
	useEffect(() => {
		setMounted(true);
		const handleResize = () => setIsDesktop(window.innerWidth >= 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (selectedOrder) {
			const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = `${scrollBarWidth}px`;
		} else {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		}
		return () => {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		};
	}, [selectedOrder]);

	const handleMobilePageChange = (event: unknown, newPage: number) => {
		setMobilePage(newPage);
	};

	const visibleIds = useMemo(() => {
		const start = paginationModel.page * paginationModel.pageSize;
		return orders.slice(start, start + paginationModel.pageSize).map(o => o.id);
	}, [orders, paginationModel]);

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
			renderCell: (params: GridRenderCellParams<AdminOrder>) => (
				<Checkbox
					id={`select-order-${params.row.id}`}
					checked={selectedIds.has(params.row.id)}
					onChange={() => onSelectChange?.(params.row.id)}
				/>
			),
		},
		{
			field: "id",
			headerName: "ID",
			flex: 1.2,
			minWidth: 160,
			disableColumnMenu: true,
			renderCell: (params: GridRenderCellParams<AdminOrder>) => (
				<button
					onClick={() => setSelectedOrder(params.row)}
					className="font-bold text-blue-600 hover:underline transition-colors focus:outline-none"
				>
					#{params.row.orderNo || params.row.id}
				</button>
			),
		},
		{
			field: "customerName",
			headerName: "Customer",
			flex: 1,
			minWidth: 150,
			renderCell: (params: GridRenderCellParams<AdminOrder>) => {
				const name = params.row.customer?.fullName || "Retail customer";
				return (
					<div className="flex items-center gap-3 h-full">
						<span className="font-medium text-gray-900 truncate" title={name}>
							{name}
						</span>
					</div>
				);
			},
		},
		{
			field: "customerEmail",
			headerName: "Email",
			flex: 1.5,
			minWidth: 200,
			valueGetter: (_, row) => row.customer?.email || "---",
			renderCell: params => (
				<span className="text-gray-600 truncate" title={params.value as string}>
					{params.value}
				</span>
			),
		},
		{
			field: "createdAt",
			headerName: "Order date",
			flex: 0.8,
			minWidth: 120,
			valueFormatter: value => formatDate(value as string),
		},
		{
			field: "totalAmount",
			headerName: "Total amount",
			flex: 0.8,
			minWidth: 120,
			valueFormatter: value => formatPrice(value as number),
			cellClassName: "font-semibold text-gray-900",
		},
		{
			field: "status",
			headerName: "Status",
			flex: 0.8,
			minWidth: 120,
			renderCell: (params: GridRenderCellParams<AdminOrder>) => (
				<div className="flex items-center h-full">
					<StatusChip label={params.value as string} color={STATUS_COLORS[params.value as string] || "default"} />
				</div>
			),
		},
		{
			field: "actions",
			headerName: "Update Status",
			flex: 1,
			minWidth: 150,
			sortable: false,
			renderCell: (params: GridRenderCellParams<AdminOrder>) => {
				const currentStatus = params.row.status;
				const isFinalStatus = ["Completed", "Cancelled"].includes(currentStatus);

				return (
					<div className={`flex items-center h-full w-full ${isFinalStatus ? "pointer-events-none opacity-50" : ""}`}>
						<Dropdown
							value={currentStatus}
							options={STATUS_OPTIONS}
							onChange={val => onStatusChange(params.row.id, val)}
							className="!w-full !max-w-[130px] !h-[32px] text-sm"
						/>
					</div>
				);
			},
		},
	];

	return (
		<>
			{isDesktop && (
				<div className="hidden md:block w-full h-[600px]">
					<DataTable
						rows={orders}
						columns={columns}
						rowHeight={60}
						noRowsLabel="No orders yet."
						paginationModel={paginationModel}
						onPaginationModelChange={setPaginationModel}
					/>
				</div>
			)}

			<div className="md:hidden flex flex-col pb-20">
				<div className="flex flex-col gap-4">
					{orders.length === 0 ? (
						<div className="text-center text-gray-500 py-10">No orders yet.</div>
					) : (
						orders
							.slice(mobilePage * MOBILE_ROWS_PER_PAGE, mobilePage * MOBILE_ROWS_PER_PAGE + MOBILE_ROWS_PER_PAGE)
							.map(order => {
								const isFinalStatus = ["Completed", "Cancelled"].includes(order.status);

								return (
									<div
										key={order.id}
										className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3"
									>
										<div className="flex justify-between items-center border-b border-gray-50 pb-2">
											<button
												onClick={() => setSelectedOrder(order)}
												className="text-xs font-bold text-blue-600 hover:underline"
											>
												#{order.orderNo || order.id}
											</button>
											<span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
										</div>

										<div className="flex flex-col gap-1">
											<div className="flex justify-between items-center">
												<span className="text-sm font-bold text-gray-900 truncate">
													{order.customer?.fullName || "Retail customer"}
												</span>
											</div>
											<span className="text-xs text-gray-500 truncate">{order.customer?.email || "---"}</span>
										</div>

										<div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-50">
											<span className="text-lg font-bold text-black">{formatPrice(order.totalAmount)}</span>

											<div className={`w-[130px] ${isFinalStatus ? "pointer-events-none opacity-60" : ""}`}>
												<Dropdown
													value={order.status}
													options={STATUS_OPTIONS}
													onChange={val => onStatusChange(order.id, val)}
													className="!w-full !h-[36px] text-xs shadow-sm !border-gray-200"
												/>
											</div>
										</div>
									</div>
								);
							})
					)}
				</div>

				{orders.length > 0 && (
					<div className="flex justify-center mt-6">
						<div className="bg-white rounded-full shadow-sm border border-gray-200 px-2 py-1">
							<TablePagination
								component="div"
								count={orders.length}
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

			{mounted &&
				selectedOrder &&
				createPortal(
					<div
						className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 transition-all"
						onClick={() => setSelectedOrder(null)}
					>
						<div
							className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
							onClick={e => e.stopPropagation()}
						>
							<div className="p-6 border-b border-gray-100 flex justify-between items-start">
								<div>
									<h3 className="text-xl font-bold text-gray-800">Order Details</h3>
									<p className="text-sm text-gray-500 mt-1">Order #{selectedOrder.orderNo || selectedOrder.id}</p>
								</div>
								<button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 p-1">
									<CloseIcon />
								</button>
							</div>

							<div className="p-6 overflow-y-auto flex-1 bg-gray-50/20 custom-scrollbar">
								<div className="mb-6">
									<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
										Delivery Address
									</h4>
									{selectedOrder.address && (
										<div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
											<p className="text-sm font-semibold text-gray-900 mb-2">{selectedOrder.address.receiverName}</p>
											<p className="text-xs text-gray-600 mb-2">{selectedOrder.address.address}</p>
											<p className="text-xs text-gray-600">{selectedOrder.address.phone}</p>
										</div>
									)}
								</div>

								<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
									Products in this order
								</h4>
								<ul className="flex flex-col gap-3">
									{selectedOrder.orderItems?.map(item => {
										const selectedVariant = (item.product as any)?.variants?.find(
											(v: any) => Number(v.id) === Number((item as any).variantId),
										);
										const variantDisplay = selectedVariant?.sku || (item as any)?.variant?.sku;
										const productLink = router.product(item.productId);

										return (
											<li
												key={item.id}
												className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
											>
												<div className="flex items-center gap-4">
													<Link
														href={productLink}
														className="w-16 h-16 rounded border border-gray-100 overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
													>
														<img
															src={item.product?.mainImageUrl || "/images/placeholder-product.png"}
															className="w-full h-full object-cover"
															onError={e => {
																(e.target as HTMLImageElement).src = "/images/placeholder-product.png";
															}}
														/>
													</Link>
													<div className="flex flex-col gap-1">
														<Link
															href={productLink}
															className="font-bold text-gray-800 text-sm hover:text-blue-600 hover:underline"
														>
															{item.product?.name}
														</Link>
														<div className="flex flex-wrap items-center gap-2">
															<span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
																Qty: {item.quantity}
															</span>
															{item.colorId && (
																<span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
																	Color: {item.colorId}
																</span>
															)}
															{variantDisplay && (
																<span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
																	Variant: {variantDisplay}
																</span>
															)}
														</div>
													</div>
												</div>
												<span className="font-bold text-gray-900 text-sm">{formatPrice(item.unitPrice)}</span>
											</li>
										);
									})}
								</ul>
							</div>

							<div className="p-4 border-t border-gray-100 flex justify-end bg-white">
								<button
									onClick={() => setSelectedOrder(null)}
									className="px-8 py-2 bg-[#111827] text-white font-bold rounded-md hover:bg-black active:scale-95 transition-all"
								>
									Close
								</button>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
