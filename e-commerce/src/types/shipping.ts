export type ShippingType = "regular" | "express" | "schedule";

export interface ShippingMethod {
	id: string;
	type: ShippingType;
	name: string;
	description: string;
	price: number;
	estimatedDate?: string;
}

export interface ShippingState {
	methodId: string;
	scheduledDate?: string;
}
