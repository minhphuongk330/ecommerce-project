"use client";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
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

	return <DataTable rows={orders} columns={columns} rowHeight={60} noRowsLabel="No orders yet." />;
}
