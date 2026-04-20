"use client";
import { memo } from "react";
import { FilterField, FilterState } from "~/types/filter";

interface AdminFilterProps {
	fields: FilterField[];
	filterState: FilterState;
	onFilterChange: (fieldName: string, value: any) => void;
	onReset: () => void;
	isFiltered: boolean;
	loading?: boolean;
}

const FILTER_INPUT_CLASSES =
	"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

const AdminFilter = memo<AdminFilterProps>(
	({ fields, filterState, onFilterChange, onReset, isFiltered, loading = false }) => {
		const renderFilterInput = (field: FilterField) => {
			const value = filterState[field.name] ?? "";
			const commonInputClasses = FILTER_INPUT_CLASSES;

			switch (field.type) {
				case "text":
					return (
						<input
							type="text"
							placeholder={field.placeholder || `Search ${field.label.toLowerCase()}...`}
							value={value}
							onChange={e => onFilterChange(field.name, e.target.value)}
							disabled={loading}
							className={commonInputClasses}
						/>
					);

				case "select":
					return (
						<select
							value={value}
							onChange={e => onFilterChange(field.name, e.target.value)}
							disabled={loading}
							className={commonInputClasses}
						>
							<option value="">All {field.label}</option>
							{field.options?.map(option => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					);

				case "multiselect":
					return (
						<select
							multiple
							value={Array.isArray(value) ? value : []}
							onChange={e => {
								const selected = Array.from(e.target.selectedOptions, option => option.value);
								onFilterChange(field.name, selected);
							}}
							disabled={loading}
							className={`${commonInputClasses} h-32`}
						>
							{field.options?.map(option => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					);

				case "number":
					return (
						<input
							type="number"
							placeholder={field.placeholder}
							value={value}
							onChange={e => onFilterChange(field.name, e.target.value ? Number(e.target.value) : "")}
							disabled={loading}
							min={field.minValue}
							max={field.maxValue}
							className={commonInputClasses}
						/>
					);

				case "date":
					return (
						<input
							type="date"
							value={value}
							onChange={e => onFilterChange(field.name, e.target.value)}
							disabled={loading}
							className={commonInputClasses}
						/>
					);

				case "daterange":
					return (
						<div className="flex gap-2 items-start">
							<div className="flex flex-col gap-1 flex-1 min-w-0">
								<input
									type="date"
									value={Array.isArray(value) ? value[0] || "" : ""}
									onChange={e => {
										const endDate = Array.isArray(value) ? value[1] : null;
										const newEnd = endDate && e.target.value && endDate < e.target.value ? null : endDate;
										onFilterChange(field.name, [e.target.value, newEnd]);
									}}
									max={Array.isArray(value) && value[1] ? value[1] : undefined}
									disabled={loading}
									className={commonInputClasses}
								/>
								<span className="text-[10px] text-gray-400 pl-1">From</span>
							</div>
							<span className="text-gray-400 flex-shrink-0 mt-2">—</span>
							<div className="flex flex-col gap-1 flex-1 min-w-0">
								<input
									type="date"
									value={Array.isArray(value) ? value[1] || "" : ""}
									onChange={e => {
										const startDate = Array.isArray(value) ? value[0] : null;
										onFilterChange(field.name, [startDate, e.target.value]);
									}}
									min={Array.isArray(value) && value[0] ? value[0] : undefined}
									disabled={loading}
									className={commonInputClasses}
								/>
								<span className="text-[10px] text-gray-400 pl-1">To</span>
							</div>
						</div>
					);

				case "numberrange":
					return (
						<div className="flex gap-2 items-center">
							<input
								type="number"
								placeholder="Min"
								value={Array.isArray(value) ? (value[0] ?? "") : ""}
								onChange={e => {
									const max = Array.isArray(value) ? value[1] : null;
									onFilterChange(field.name, [e.target.value, max]);
								}}
								disabled={loading}
								className={commonInputClasses}
							/>
							<span className="text-gray-400 flex-shrink-0">—</span>
							<input
								type="number"
								placeholder="Max"
								value={Array.isArray(value) ? (value[1] ?? "") : ""}
								onChange={e => {
									const min = Array.isArray(value) ? value[0] : null;
									onFilterChange(field.name, [min, e.target.value]);
								}}
								disabled={loading}
								className={commonInputClasses}
							/>
						</div>
					);

				default:
					return null;
			}
		};

		return (
			<div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
				<div className="flex justify-end items-center">
					{isFiltered && (
						<button
							onClick={onReset}
							disabled={loading}
							className="text-xs px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Clear All
						</button>
					)}
				</div>

				<div className="flex flex-wrap gap-4">
					{fields.map(field => (
						<div key={field.name} className="flex flex-col gap-1 flex-1 min-w-[180px]">
							<label className="text-xs font-medium text-gray-600">{field.label}</label>
							{renderFilterInput(field)}
						</div>
					))}
				</div>
			</div>
		);
	},
);

export default AdminFilter;
