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

function convertToCSV<T>(data: T[], columns: ExportColumn<T>[]): string {
	const headers = columns.map(col => `"${col.label}"`).join(",");

	const rows = data.map(row => {
		return columns
			.map(col => {
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
					return '""';
				}

				const stringValue = String(value).replace(/"/g, '""');
				return `"${stringValue}"`;
			})
			.join(",");
	});

	return [headers, ...rows].join("\n");
}

export function downloadCSV<T>(options: ExportOptions<T>): void {
	const csv = convertToCSV(options.data, options.columns);

	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = `${options.filename}_${new Date().getTime()}.csv`;
	link.click();

	URL.revokeObjectURL(url);
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
