"use client";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useEffect, useRef, useState } from "react";
import BulkDeleteButton from "~/components/Admin/BulkDeleteButton";
import ExportButton from "~/components/Admin/ExportButton";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { useNotification } from "~/contexts/Notification";
import { ExportColumn } from "~/utils/export";

const EMPTY_SET = new Set<string | number>();

interface AdminPageHeaderProps<T> {
	title: string;
	selectCount: number;
	totalCount: number;
	allData: T[];
	exportColumns: ExportColumn<T>[];
	exportFilename: string;
	exportLabel?: string;
	actions?: React.ReactNode;
	selectedIds?: Set<string | number>;
	onBulkDelete?: (ids: number[]) => Promise<void>;
	isMobileSelectMode?: boolean;
	onToggleMobileSelect?: () => void;
}

export default function AdminPageHeader<T>({
	title,
	selectCount,
	totalCount,
	allData,
	exportColumns,
	exportFilename,
	exportLabel = "Xuất Excel",
	actions,
	selectedIds = EMPTY_SET,
	onBulkDelete,
	isMobileSelectMode = false,
	onToggleMobileSelect,
}: AdminPageHeaderProps<T>) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [mobileDeleteOpen, setMobileDeleteOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { showNotification } = useNotification();

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleMobileDelete = async () => {
		await onBulkDelete!(Array.from(selectedIds).map(Number));
		showNotification(`Đã xoá ${selectCount} mục thành công`, "success");
		setMobileDeleteOpen(false);
		onToggleMobileSelect?.();
	};

	const handleMobileDeleteError = (error: any) => {
		const message = error?.response?.data?.message || "Một số mục không thể xoá. Vui lòng thử lại.";
		showNotification(message, "error");
	};

	return (
		<>
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-800">{title}</h1>
				<div className="flex items-center gap-4">
					{selectCount > 0 && (
						<span className="hidden md:inline text-sm text-gray-500 font-semibold">
							Đã chọn: <span className="text-blue-600">{selectCount}</span> / {totalCount}
						</span>
					)}
					<div className="flex gap-2 items-center">
						<div className="hidden md:flex gap-2 items-center">
							{onBulkDelete && (
								<BulkDeleteButton selectedIds={selectedIds} onDelete={onBulkDelete} />
							)}
							<ExportButton
								data={allData}
								columns={exportColumns}
								filename={exportFilename}
								label={exportLabel}
								variant="both"
								showCount={false}
							/>
							{actions}
						</div>
						{isMobileSelectMode ? (
							<div className="flex md:hidden items-center gap-2">
								{selectCount > 0 && onBulkDelete && (
									<button
										onClick={() => setMobileDeleteOpen(true)}
										className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
									>
										Xoá ({selectCount})
									</button>
								)}
								<button
									onClick={onToggleMobileSelect}
									className="text-sm font-medium text-gray-600 px-3 py-1.5 border border-gray-300 rounded-lg"
								>
									Huỷ
								</button>
							</div>
						) : (
							<div className="relative md:hidden" ref={dropdownRef}>
								<button
									onClick={() => setDropdownOpen(!dropdownOpen)}
									className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
								>
									<MoreVertIcon fontSize="small" />
								</button>
								{dropdownOpen && (
									<div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[160px] py-1">
										{actions && (
											<div
												className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
												onClick={() => setDropdownOpen(false)}
											>
												{actions}
											</div>
										)}
										<div
											className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
											onClick={() => setDropdownOpen(false)}
										>
											<ExportButton
												data={allData}
												columns={exportColumns}
												filename={exportFilename}
												label="Xuất Excel"
												variant="both"
												showCount={false}
											/>
										</div>
										{onToggleMobileSelect && (
											<button
												className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
												onClick={() => {
													setDropdownOpen(false);
													onToggleMobileSelect();
												}}
											>
												Chọn
											</button>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{mobileDeleteOpen && onBulkDelete && (
				<ConfirmationModal
					isOpen={mobileDeleteOpen}
					onClose={() => setMobileDeleteOpen(false)}
					onConfirm={handleMobileDelete}
					onError={handleMobileDeleteError}
					title={`Xoá ${selectCount} mục`}
					message={`Bạn có chắc chắn muốn xoá ${selectCount} mục đã chọn không? Hành động này không thể hoàn tác.`}
					confirmLabel="Xoá"
					confirmButtonColor="!bg-red-600 hover:!bg-red-700"
				/>
			)}
		</>
	);
}
