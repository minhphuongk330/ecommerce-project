import * as XLSX from "xlsx";

export interface ExportColumn<T> {
	key: keyof T | string;
	label: string;
	formatter?: (value: any, row?: T) => string;
}

export interface ExportOptions<T> {
	filename: string;
	columns: ExportColumn<T>[];
	data: T[];
}

export function downloadExcel<T>(options: ExportOptions<T>): void {
	const excelData = options.data.map(row => {
		const rowData: Record<string, any> = {};

		options.columns.forEach(col => {
			let value: any = null;

			if (typeof col.key === "string" && col.key.includes(".")) {
				const keys = col.key.split(".");
				value = keys.reduce((obj, key) => obj?.[key], row);
			} else {
				value = row[col.key as keyof T];
			}

			if (col.formatter) {
				value = col.formatter(value, row);
			}

			if (value === null || value === undefined) {
				value = "";
			}

			rowData[col.label] = String(value);
		});

		return rowData;
	});

	const ws = XLSX.utils.json_to_sheet(excelData);

	const colWidths = options.columns.map(col => {
		const labelLen = col.label.length;
		const maxContentLen = excelData.reduce((max, row) => {
			const content = String(row[col.label] || "");
			return content.length > max ? content.length : max;
		}, 0);

		return { wch: Math.max(labelLen, maxContentLen) + 2 };
	});
	ws["!cols"] = colWidths;

	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Data");
	XLSX.writeFile(wb, `${options.filename}_${new Date().getTime()}.xlsx`);
}

export function downloadJSON<T>(filename: string, data: T[]): void {
	const json = JSON.stringify(data, null, 2);
	const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${filename}_${new Date().getTime()}.json`;
	link.click();
	URL.revokeObjectURL(url);
}

export function copyToClipboard<T>(data: T[]): Promise<void> {
	const json = JSON.stringify(data, null, 2);
	return navigator.clipboard.writeText(json);
}
