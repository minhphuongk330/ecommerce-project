import { Product } from "./product";
import React from "react";
import { ProductDetail } from "./product";
import { Color } from "./common";
import { PaginationProps } from "./catalog";

export interface ProductVariant {
	id: number;
	sku?: string;
	price: number | string;
	stock: number;
	options?: any;
}

export interface ArrowButtonProps {
	onPrev?: () => void;
	onNext?: () => void;
	className?: string;
	scrollContainerRef?: React.RefObject<HTMLElement | null> | React.RefObject<HTMLDivElement | null>;
	scrollAmount?: number;
}

export interface IconProps {
	icon: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

export interface SingleBtnProps {
	direction: "left" | "right";
	onClick?: () => void;
}

export interface MainInfoProps {
	product: ProductDetailUI;
}

export interface SectionProductListProps {
	title: string;
	products: Product[];
	className?: string;
}

export interface ColorSelectorProps {
	colors: Color[];
	selectedColor: string;
	onSelect: (color: string) => void;
	label?: string;
	className?: string;
}

export interface ImageGalleryProps {
	images: string[];
	productName: string;
}

export interface ViewMoreBtnProps {
	isExpanded: boolean;
	onClick: () => void;
	className?: string;
}

export interface CapacitySelectorProps {
	capacities: string[];
	selectedCapacity: string;
	onSelect: (cap: string) => void;
	className?: string;
}

export interface TechnicalSpecsProps {
	attributes: any;
	className?: string;
}

export interface SpecsGridProps {
	specs: ProductDetail["specs"];
	className?: string;
}

export interface DeliveryInfoProps {
	className?: string;
}

export interface QuantitySelectorProps {
	quantity: number;
	onIncrease: () => void;
	onDecrease: () => void;
	className?: string;
}

export interface DetailsSectionProps {
	product: ProductDetail;
}

export interface ProductGridProps {
	products: Product[];
	itemsPerRow?: number;
	className?: string;
}

export interface ProductCardProps {
	product: Product;
}

export interface ProductListAreaProps extends PaginationProps {
	products: Product[];
	totalCount: number;
}

export interface ProductDetailUI extends ProductDetail {
	images: string[];
	colors: {
		name: string;
		hex: string;
		id?: number;
	}[];
	variants?: ProductVariant[];
	attributes?: any;
}
