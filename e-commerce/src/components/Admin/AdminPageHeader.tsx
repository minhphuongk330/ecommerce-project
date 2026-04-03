"use client";
import ExportButton from "~/components/Admin/ExportButton";
import { ExportColumn } from "~/utils/export";

interface AdminPageHeaderProps<T> {
	title: string;
	selectCount: number;
	totalCount: number;
	exportData: T[];
	exportColumns: ExportColumn<T>[];
	exportFilename: string;
	exportLabel?: string;
	actions?: React.ReactNode;
}

export default function AdminPageHeader<T>({
	title,
	selectCount,
	totalCount,
	exportData,
	exportColumns,
	exportFilename,
	exportLabel = "Export",
	actions,
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
					<ExportButton
						data={exportData}
						columns={exportColumns}
						filename={exportFilename}
						label={selectCount > 0 ? `${exportLabel} (${selectCount})` : exportLabel}
						variant="both"
						showCount={false}
						disabled={selectCount === 0}
					/>
					{actions}
				</div>
			</div>
		</div>
	);
}
