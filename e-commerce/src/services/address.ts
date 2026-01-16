import axiosClient from "./axiosClient";
import { Address, AddressFormData } from "~/types/address";

export const addressService = {
	getMyAddresses: (userId: number): Promise<Address[]> => {
		return axiosClient.get(`/customer-addresses/customer/${userId}`);
	},

	createAddress: (data: AddressFormData): Promise<Address> => {
		return axiosClient.post("/customer-addresses", data);
	},

	updateAddress: (id: number, data: AddressFormData): Promise<Address> => {
		return axiosClient.patch(`/customer-addresses/${id}`, data);
	},

	deleteAddress: (id: number): Promise<void> => {
		return axiosClient.delete(`/customer-addresses/${id}`);
	},
};
