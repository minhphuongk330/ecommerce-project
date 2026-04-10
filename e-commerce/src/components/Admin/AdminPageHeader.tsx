"use client";
import BulkDeleteButton from "~/components/Admin/BulkDeleteButton";
import ExportButton from "~/components/Admin/ExportButton";
import { ExportColumn } from "~/utils/export";

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
}

export default function AdminPageHeader<T>({
	title,
	selectCount,
	totalCount,
	allData,
	exportColumns,
	exportFilename,
	exportLabel = "Export",
	actions,
	selectedIds = new Set(),
	onBulkDelete,
}: AdminPageHeaderProps<T>) {
	return (
		<div className="flex justify-between items-center">
			<h1 className="text-2xl font-bold text-gray-800">{title}</h1>
			<div className="flex items-center gap-4">
				{selectCount > 0 && (
					<span className="text-sm text-gray-500 font-semibold">
						Selected: <span className="text-blue-600">{selectCount}</span> / {totalCount}
					</span>
				)}
				<div className="flex gap-2">
					{onBulkDelete && (
						<BulkDeleteButton
							selectedIds={selectedIds}
							onDelete={onBulkDelete}
						/>
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
			</div>
		</div>
	);
}
