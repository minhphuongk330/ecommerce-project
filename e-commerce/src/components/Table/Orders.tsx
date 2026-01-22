"use client";
import { useState, useEffect } from "react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TablePagination from "@mui/material/TablePagination";
import { AdminOrder } from "~/types/admin";
import { formatDate, formatPrice } from "~/utils/format";
import Dropdown, { DropdownOption } from "../atoms/Dropdown";
import DataTable from "~/components/Table/Data";
import StatusChip, { ChipColor } from "~/components/atoms/StatusChip";

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
}

export default function OrdersTable({ orders, onStatusChange }: Props) {
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
		{
			field: "id",
			headerName: "ID",
			width: 100,
			valueGetter: (_, row) => `#${row?.orderNo || row?.id}`,
		},
		{
			field: "customerName",
			headerName: "Customer",
			width: 180,
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
			width: 220,
			valueGetter: (_, row) => row.customer?.email || "---",
			renderCell: params => (
				<span className="text-gray-600 truncate" title={params.value}>
					{params.value}
				</span>
			),
		},
		{
			field: "createdAt",
			headerName: "Order date",
			width: 140,
			valueFormatter: value => formatDate(value),
		},
		{
			field: "totalAmount",
			headerName: "Total amount",
			width: 140,
			valueFormatter: value => formatPrice(value),
			cellClassName: "font-semibold text-gray-900",
		},
		{
			field: "status",
			headerName: "Status",
			width: 140,
			renderCell: (params: GridRenderCellParams<AdminOrder>) => (
				<div className="flex items-center h-full">
					<StatusChip label={params.value as string} color={STATUS_COLORS[params.value as string] || "default"} />
				</div>
			),
		},
		{
			field: "actions",
			headerName: "Update Status",
			width: 160,
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
					<DataTable rows={orders} columns={columns} rowHeight={60} noRowsLabel="No orders yet." />
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
											<span className="text-xs font-bold text-gray-400">#{order.orderNo || order.id}</span>
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
		</>
	);
}
