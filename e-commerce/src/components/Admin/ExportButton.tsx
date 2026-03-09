"use client";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { memo, useState } from "react";
import { useNotification } from "~/contexts/Notification";
import { downloadCSV, downloadJSON, ExportColumn } from "~/utils/export";

interface ExportButtonProps<T> {
	data: T[];
	columns: ExportColumn<T>[];
	filename: string;
	label?: string;
	variant?: "csv" | "json" | "both";
	showCount?: boolean;
	disabled?: boolean;
	className?: string;
}

const ExportButton = memo<ExportButtonProps<any>>(
	({
		data,
		columns,
		filename,
		label = "Export",
		variant = "csv",
		showCount = true,
		disabled = false,
		className = "",
	}) => {
		const [isLoading, setIsLoading] = useState(false);
		const [isOpen, setIsOpen] = useState(false);
		const { showNotification } = useNotification();

		const handleExport = (format: "csv" | "json") => {
			if (data.length === 0) {
				showNotification("No data to export", "warning");
				return;
			}

			try {
				setIsLoading(true);

				if (format === "csv") {
					downloadCSV({
						filename,
						columns,
						data,
					});
					showNotification(`Exported ${data.length} rows to CSV`, "success");
				} else if (format === "json") {
					downloadJSON(filename, data);
					showNotification(`Exported ${data.length} rows to JSON`, "success");
				}

				setIsOpen(false);
			} catch (error) {
				console.error("Export failed:", error);
				showNotification("Export failed. Please try again.", "error");
			} finally {
				setIsLoading(false);
			}
		};

		const baseButtonClasses =
			"inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

		const buttonClasses = `${baseButtonClasses} ${
			disabled
				? "bg-gray-100 text-gray-400 cursor-not-allowed"
				: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
		} ${className}`;

		if (variant === "csv" || variant === "both") {
			return (
				<div className="relative inline-block">
					<button
						onClick={() => (variant === "both" ? setIsOpen(!isOpen) : handleExport("csv"))}
						disabled={disabled || isLoading || data.length === 0}
						className={buttonClasses}
						title={data.length === 0 ? "No data to export" : "Export as CSV"}
					>
						<FileDownloadIcon sx={{ fontSize: 18 }} />
						{label}
						{showCount && <span className="text-xs">({data.length})</span>}
					</button>

					{isOpen && variant === "both" && (
						<div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
							<button
								onClick={() => handleExport("csv")}
								disabled={isLoading}
								className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 first:rounded-t-lg transition-colors"
							>
								📊 Export as CSV
							</button>
							<button
								onClick={() => handleExport("json")}
								disabled={isLoading}
								className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 last:rounded-b-lg transition-colors border-t border-gray-100"
							>
								📋 Export as JSON
							</button>
						</div>
					)}

					{isOpen && variant === "both" && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
				</div>
			);
		}

		return (
			<button
				onClick={() => handleExport(variant === "json" ? "json" : "csv")}
				disabled={disabled || isLoading || data.length === 0}
				className={buttonClasses}
				title={data.length === 0 ? "No data to export" : `Export as ${variant.toUpperCase()}`}
			>
				<FileDownloadIcon sx={{ fontSize: 18 }} />
				{label}
				{showCount && <span className="text-xs">({data.length})</span>}
			</button>
		);
	},
);

ExportButton.displayName = "ExportButton";

export default ExportButton;
