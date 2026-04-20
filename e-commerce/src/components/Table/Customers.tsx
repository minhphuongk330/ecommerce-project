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
	onBanToggle?: (customer: AdminCustomer) => void;
	isMobileSelectMode?: boolean;
}

const MOBILE_ROWS_PER_PAGE = 5;
const EMPTY_SET = new Set<string | number>();

export default function CustomerTable({
	customers,
	selectedIds = EMPTY_SET,
	onSelectChange,
	onSelectAll,
	onSelectCustomer,
	onBanToggle,
	isMobileSelectMode = false,
}: Props) {
	const [mobilePage, setMobilePage] = useState(0);
	const [isDesktop, setIsDesktop] = useState(false);
	const [paginationModel] = useState({ page: 0, pageSize: 5 });

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

	const handleMobilePageChange = (_event: unknown, newPage: number) => {
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
			flex: 1,
			minWidth: 160,
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
			flex: 1.5,
			minWidth: 180,
		},
		{
			field: "phoneNumber",
			headerName: "Phone number",
			flex: 1,
			minWidth: 130,
			valueGetter: (_, row) => row.profile?.phoneNumber || "--",
			renderCell: params => (
				<span className={params.value !== "--" ? "font-mono text-gray-700" : "text-gray-400 italic"}>
					{params.value}
				</span>
			),
		},
		{
			field: "gender",
			headerName: "Gender",
			flex: 0.7,
			minWidth: 90,
			valueGetter: (_, row) => row.profile?.gender || "--",
			renderCell: params => (
				<span className={params.value !== "--" ? "text-gray-700 capitalize" : "text-gray-400 italic"}>
					{params.value}
				</span>
			),
		},
		{
			field: "createdAt",
			headerName: "Registration date",
			flex: 1,
			minWidth: 130,
			valueFormatter: value => formatDate(value),
		},
		{
			field: "isActive",
			headerName: "Status",
			width: 180,
			sortable: false,
			renderCell: (params: GridRenderCellParams<AdminCustomer>) => {
				const { isActive, isBanned } = params.row;
				const label = isBanned ? "Banned" : isActive ? "Active" : "Inactive";
				const color = isBanned ? "error" : isActive ? "success" : "default";
				return (
					<div className="flex items-center gap-2 h-full">
						<StatusChip label={label} color={color} />
						<button
							onClick={() => onBanToggle?.(params.row)}
							className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
								isBanned ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-red-50 text-red-700 hover:bg-red-100"
							}`}
						>
							{isBanned ? "Unban" : "Ban"}
						</button>
					</div>
				);
			},
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
							.map(customer => {
								const label = customer.isBanned ? "Banned" : customer.isActive ? "Active" : "Inactive";
								const color = customer.isBanned ? "error" : customer.isActive ? "success" : "default";

								return (
									<div
										key={customer.id}
										className={`bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-3 ${
											selectedIds.has(customer.id) ? "border-blue-300 bg-blue-50" : "border-gray-100"
										}`}
										onClick={() => isMobileSelectMode && onSelectChange?.(customer.id)}
									>
										<div className="flex justify-between items-center border-b border-gray-50 pb-2">
											<div className="flex items-center gap-2">
												{isMobileSelectMode && (
													<Checkbox
														id={`mobile-select-customer-${customer.id}`}
														checked={selectedIds.has(customer.id)}
														onChange={() => onSelectChange?.(customer.id)}
													/>
												)}
												<button
													onClick={e => {
														e.stopPropagation();
														onSelectCustomer?.(customer);
													}}
													className="text-xs font-bold text-blue-600 hover:underline"
												>
													#{customer.id}
												</button>
											</div>
											<span className="text-xs text-gray-500">{formatDate(customer.createdAt)}</span>
										</div>

										<div className="flex items-start gap-3">
											<UserAvatar alt={customer.fullName} size={40} bgColor="#dbeafe" textColor="#2563eb" />
											<div className="flex-1 min-w-0">
												<button
													onClick={e => {
														e.stopPropagation();
														onSelectCustomer?.(customer);
													}}
													className="text-sm font-bold text-gray-900 truncate hover:text-blue-600 transition-colors text-left w-full"
												>
													{customer.fullName || "Unknown User"}
												</button>
												<p className="text-xs text-gray-500 truncate">{customer.email}</p>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-y-2 text-sm">
											<div className="flex flex-col">
												<span className="text-xs text-gray-400">Phone</span>
												<span
													className={
														customer.profile?.phoneNumber
															? "font-mono text-gray-700 text-xs"
															: "text-gray-400 italic text-xs"
													}
												>
													{customer.profile?.phoneNumber || "--"}
												</span>
											</div>
											<div className="flex flex-col">
												<span className="text-xs text-gray-400">Gender</span>
												<span className="text-xs text-gray-700 capitalize">
													{customer.profile?.gender?.toLowerCase() || "--"}
												</span>
											</div>
										</div>

										<div className="flex items-center justify-between pt-1 border-t border-gray-50">
											<StatusChip label={label} color={color} className="!h-6 !text-xs" />
											<button
												onClick={e => {
													e.stopPropagation();
													onBanToggle?.(customer);
												}}
												className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
													customer.isBanned
														? "bg-green-50 text-green-700 hover:bg-green-100"
														: "bg-red-50 text-red-700 hover:bg-red-100"
												}`}
											>
												{customer.isBanned ? "Unban" : "Ban"}
											</button>
										</div>
									</div>
								);
							})
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
