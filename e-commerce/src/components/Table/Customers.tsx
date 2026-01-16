"use client";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { AdminCustomer } from "~/types/admin";
import { formatDate } from "~/utils/format";
import DataTable from "~/components/Table/Data";
import UserAvatar from "~/components/atoms/UserAvatar";
import StatusChip from "~/components/atoms/StatusChip";

interface Props {
	customers: AdminCustomer[];
}

export default function CustomerTable({ customers }: Props) {
	const columns: GridColDef[] = [
		{
			field: "id",
			headerName: "ID",
			width: 150,
			valueGetter: (_, row) => `#${row.id}`,
		},
		{
			field: "fullName",
			headerName: "Full name",
			width: 250,
			renderCell: (params: GridRenderCellParams<AdminCustomer>) => {
				const name = params.value || "";
				return (
					<div className="flex items-center gap-3 h-full">
						<UserAvatar alt={name} size={32} bgColor="#dbeafe" textColor="#2563eb" />
						<span className="font-medium text-gray-900 truncate">{name || "---"}</span>
					</div>
				);
			},
		},
		{
			field: "email",
			headerName: "Email",
			width: 250,
		},
		{
			field: "phoneNumber",
			headerName: "Phone number",
			width: 150,
			valueGetter: (_, row) => row.profile?.phoneNumber || "--",
			renderCell: params => (
				<span className={params.value !== "--" ? "font-mono text-gray-700" : "text-gray-400 italic"}>
					{params.value}
				</span>
			),
		},
		{
			field: "createdAt",
			headerName: "Registration date",
			width: 150,
			valueFormatter: value => formatDate(value),
		},
		{
			field: "isActive",
			headerName: "Status",
			width: 120,
			renderCell: (params: GridRenderCellParams<AdminCustomer>) => (
				<div className="flex items-center h-full">
					<StatusChip label={params.value ? "Active" : "Inactive"} color={params.value ? "success" : "default"} />
				</div>
			),
		},
	];

	return <DataTable rows={customers} columns={columns} rowHeight={60} noRowsLabel="There are no customers yet." />;
}
