export type FilterFieldType = "text" | "select" | "multiselect" | "date" | "daterange" | "number" | "numberrange";

export interface FilterOption {
	label: string;
	value: string | number;
}

export interface FilterField {
	name: string;
	label: string;
	type: FilterFieldType;
	placeholder?: string;
	options?: FilterOption[];
	minValue?: number;
	maxValue?: number;
}

export interface FilterConfig {
	fields: FilterField[];
	defaultValues?: Record<string, any>;
}

export interface FilterState {
	[key: string]: any;
}

export interface FilterResult<T> {
	filtered: T[];
	total: number;
	count: number;
}

export type FilterPredicate<T> = (item: T, filters: FilterState) => boolean;

export interface TextFilterStrategy {
	fields: string[];
	caseSensitive?: boolean;
}

export interface SelectFilterStrategy {
	field: string;
}

export interface DateFilterStrategy {
	field: string;
	startField?: string;
	endField?: string;
}

export type FilterStrategy =
	| { type: "text"; config: TextFilterStrategy }
	| { type: "select"; config: SelectFilterStrategy }
	| { type: "date"; config: DateFilterStrategy }
	| { type: "custom"; predicate: FilterPredicate<any> };
