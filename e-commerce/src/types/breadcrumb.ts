export interface BreadcrumbItem {
	label: string;
	href?: string;
}
export interface BreadcrumbContextType {
	items: BreadcrumbItem[];
	setBreadcrumbs: (items: BreadcrumbItem[]) => void;
}
