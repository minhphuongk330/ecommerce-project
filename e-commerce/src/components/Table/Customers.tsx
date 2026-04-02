"use client";
import { TablePagination } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import DataTable from "~/components/Table/Data";
import Checkbox from "~/components/atoms/Checkbox";
import StatusChip from "~/components/atoms/StatusChip";
import UserAvatar from "~/components/atoms/UserAvatar";
import { AdminCustomer } from "~/types/admin";
import { formatDate } from "~/utils/format";

interface Props {
	customers: AdminCustomer[];
	selectedIds?: Set<string | number>;
	onSelectChange?: (id: number) => void;
	onSelectAll?: (selected: boolean, ids: number[]) => void;
	onSelectCustomer?: (customer: AdminCustomer) => void;
}

export default function CustomerTable({
	customers,
	selectedIds = new Set(),
	onSelectChange,
	onSelectAll,
	onSelectCustomer,
}: Props) {
	const [mobilePage, setMobilePage] = useState(0);
	const MOBILE_ROWS_PER_PAGE = 5;
	const [isDesktop, setIsDesktop] = useState(false);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

	useEffect(() => {
		const handleResize = () => setIsDesktop(window.innerWidth >= 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const visibleIds = useMemo(() => {
		const start = paginationModel.page * paginationModel.pageSize;
		return customers.slice(start, start + paginationModel.pageSize).map(c => c.id);
	}, [customers, paginationModel]);

	const handleMobilePageChange = (event: unknown, newPage: number) => {
		setMobilePage(newPage);
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
			renderCell: (params: GridRenderCellParams<AdminCustomer>) => (
				<Checkbox
					id={`select-customer-${params.row.id}`}
					checked={selectedIds.has(params.row.id)}
					onChange={() => onSelectChange?.(params.row.id)}
				/>
			),
		},
		{
			field: "fullName",
			headerName: "Full name",
			width: 250,
			renderCell: (params: GridRenderCellParams<AdminCustomer>) => {
				const name = params.value || "";
				return (
					<button
						onClick={() => onSelectCustomer?.(params.row)}
						className="flex items-center gap-3 h-full text-left hover:opacity-70 transition-opacity focus:outline-none"
					>
						<UserAvatar alt={name} size={32} bgColor="#dbeafe" textColor="#2563eb" />
						<span className="font-bold text-blue-600 truncate hover:underline">{name || "---"}</span>
					</button>
				);
			},
		},
		{
			field: "email",
			headerName: "Email",
			width: 250,
			flex: 1,
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

	return (
		<>
			{isDesktop && (
				<div className="hidden md:block w-full h-[600px]">
					<DataTable rows={customers} columns={columns} rowHeight={60} noRowsLabel="There are no customers yet." />
				</div>
			)}

			<div className="md:hidden flex flex-col pb-20">
				<div className="flex flex-col gap-4">
					{customers.length === 0 ? (
						<div className="text-center text-gray-500 py-10">No customers yet.</div>
					) : (
						customers
							.slice(mobilePage * MOBILE_ROWS_PER_PAGE, mobilePage * MOBILE_ROWS_PER_PAGE + MOBILE_ROWS_PER_PAGE)
							.map(customer => (
								<div
									key={customer.id}
									className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3"
								>
									<div className="flex items-start gap-3">
										<UserAvatar alt={customer.fullName} size={48} bgColor="#dbeafe" textColor="#2563eb" />
										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-start">
												<h3 className="text-base font-bold text-gray-900 truncate pr-2">
													{customer.fullName || "Unknown User"}
												</h3>
												<span className="text-xs font-bold text-gray-400 whitespace-nowrap">#{customer.id}</span>
											</div>
											<p className="text-sm text-gray-500 truncate">{customer.email}</p>
										</div>
									</div>

									<div className="w-full h-[1px] bg-gray-50"></div>

									<div className="grid grid-cols-2 gap-y-2 text-sm">
										<div className="flex flex-col">
											<span className="text-xs text-gray-400">Phone</span>
											<span
												className={customer.profile?.phoneNumber ? "font-mono text-gray-700" : "text-gray-400 italic"}
											>
												{customer.profile?.phoneNumber || "--"}
											</span>
										</div>

										<div className="flex flex-col">
											<span className="text-xs text-gray-400">Joined Date</span>
											<span className="text-gray-700">{formatDate(customer.createdAt)}</span>
										</div>
									</div>

									<div className="flex items-center justify-between pt-1">
										<span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
										<StatusChip
											label={customer.isActive ? "Active" : "Inactive"}
											color={customer.isActive ? "success" : "default"}
											className="!h-6 !text-xs"
										/>
									</div>
								</div>
							))
					)}
				</div>

				{customers.length > 0 && (
					<div className="flex justify-center mt-6">
						<div className="bg-white rounded-full shadow-sm border border-gray-200 px-2 py-1">
							<TablePagination
								component="div"
								count={customers.length}
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
