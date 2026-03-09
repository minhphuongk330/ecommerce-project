"use client";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { memo, useCallback, useState } from "react";
import Button from "~/components/atoms/Button";
import { useNotification } from "~/contexts/Notification";
import { downloadExcel, downloadJSON, ExportColumn } from "~/utils/export";

interface ExportButtonProps<T> {
	data: T[];
	columns: ExportColumn<T>[];
	filename: string;
	label?: string;
	variant?: "excel" | "json" | "both";
	showCount?: boolean;
	disabled?: boolean;
}

const EXPORT_FORMATS = {
	EXCEL: "excel",
	JSON: "json",
	BOTH: "both",
} as const;

const EXPORT_ICONS = {
	excel: "📊",
	json: "📋",
} as const;

const EXPORT_LABELS = {
	excel: "Export as Excel",
	json: "Export as JSON",
} as const;

const getExportFormat = (variant: string): "excel" | "json" => {
	return variant === "json" ? "json" : "excel";
};

const getButtonLabel = (label: string, count: number, showCount: boolean): string => {
	if (!showCount || count === 0) return label;
	return `${label} (${count})`;
};

const getButtonTitle = (isEmpty: boolean, variant: string): string => {
	if (isEmpty) return "No data to export";
	return `Export as ${variant.toUpperCase()}`;
};

const ExportButton = memo<ExportButtonProps<any>>(
	({ data, columns, filename, label = "Export", variant = "excel", showCount = true, disabled = false }) => {
		const [isLoading, setIsLoading] = useState(false);
		const [isOpen, setIsOpen] = useState(false);
		const { showNotification } = useNotification();

		const isEmpty = data.length === 0;
		const isButtonDisabled = disabled || isLoading || isEmpty;

		const handleExport = useCallback(
			(format: "excel" | "json") => {
				if (isEmpty) {
					showNotification("No data to export", "warning");
					return;
				}

				try {
					setIsLoading(true);

					if (format === "excel") {
						downloadExcel({ filename, columns, data });
						showNotification(`Exported ${data.length} rows to Excel`, "success");
					} else {
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
			},
			[data, columns, filename, isEmpty, showNotification],
		);

		const handleMainButtonClick = useCallback(() => {
			if (variant === EXPORT_FORMATS.BOTH) {
				setIsOpen(!isOpen);
			} else {
				handleExport(getExportFormat(variant));
			}
		}, [variant, isOpen, handleExport]);

		const renderDropdownMenu = () => {
			if (variant !== EXPORT_FORMATS.BOTH || !isOpen) return null;

			return (
				<>
					<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
						{Object.entries(EXPORT_FORMATS)
							.filter(([_, value]) => value !== EXPORT_FORMATS.BOTH)
							.map(([_, format]) => (
								<button
									key={format}
									onClick={() => handleExport(format as "excel" | "json")}
									disabled={isLoading}
									className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg border-t border-gray-100 first:border-t-0"
								>
									{EXPORT_ICONS[format as keyof typeof EXPORT_ICONS]}{" "}
									{EXPORT_LABELS[format as keyof typeof EXPORT_LABELS]}
								</button>
							))}
					</div>
					<div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
				</>
			);
		};

		return (
			<div className="relative inline-block" title={getButtonTitle(isEmpty, variant)}>
				<Button
					onClick={handleMainButtonClick}
					disabled={isButtonDisabled}
					className="!w-auto !h-auto px-4 py-2"
					theme="dark"
					variant="solid"
					type="button"
				>
					<FileDownloadIcon sx={{ fontSize: 18 }} />
					<span className="flex items-center gap-2">{getButtonLabel(label, data.length, showCount)}</span>
				</Button>
				{renderDropdownMenu()}
			</div>
		);
	},
);

ExportButton.displayName = "ExportButton";

export default ExportButton;
