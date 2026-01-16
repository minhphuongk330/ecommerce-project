export interface AddressFormData {
	receiverName: string;
	phone: string;
	address: string;
	isDefault: boolean;
	customerId?: number;
}

export interface Address extends AddressFormData {
	id: number;
	createdAt?: string;
}
