import { SvgIconComponent } from "@mui/icons-material";

export interface CategoryState {
	categories: Category[];
	isLoading: boolean;
	error: string | null;
	fetchCategories: () => Promise<void>;
}
export interface Category {
	id: number;
	name: string;
	thumbnailUrl: string;
	configs?: string;
	createdAt?: string;
	updatedAt?: string;
}
export interface CategoryCardProps {
	name: string;
	IconComponent?: React.ElementType | SvgIconComponent;
	thumbnailUrl?: string;
}
export interface CategoryShort {
	id: number;
	name: string;
	thumbnailUrl?: string;
}
