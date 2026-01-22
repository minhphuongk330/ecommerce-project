export interface BannerData {
	id: string;
	title: string;
	content: string;
	imageUrl: string;
	displayType: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface BannerProps {
	data: BannerData;
	bgImage?: string;
	className?: string;
	contentClass?: string;
	titleClass?: string;
	descClass?: string;
	imageClass?: string;
	btnTheme?: "light" | "dark";
	buttonText?: string;
	onClick?: () => void;
	link?: string;
}
