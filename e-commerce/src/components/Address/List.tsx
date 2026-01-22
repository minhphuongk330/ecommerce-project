"use client";
import React, { useEffect } from "react";
import { Address } from "~/types/address";
import AddressItem from "./Item";

interface AddressListProps {
	addresses: Address[];
	selectedId: number | null;
	onSelect: (id: number) => void;
	onRefresh: () => void;
}

const AddressList: React.FC<AddressListProps> = ({ addresses, selectedId, onSelect, onRefresh }) => {
	useEffect(() => {
		if (addresses.length > 0 && selectedId === null) {
			const defaultAddress = addresses.find(addr => addr.isDefault);
			if (defaultAddress) {
				onSelect(defaultAddress.id);
			} else {
				onSelect(addresses[0].id);
			}
		}
	}, [addresses, selectedId, onSelect]);

	return (
		<div className="flex flex-col w-full items-stretch gap-3 lg:gap-4">
			<h3 className="text-base font-medium text-black mb-1 lg:text-[20px] lg:mb-2 text-left">Select Address</h3>
			<div className="flex flex-col gap-3 lg:gap-4 items-stretch w-full">
				{addresses.map(addr => (
					<AddressItem
						key={addr.id}
						addr={addr}
						isSelected={selectedId === addr.id}
						onSelect={() => onSelect(addr.id)}
						onRefresh={onRefresh}
					/>
				))}
			</div>
		</div>
	);
};

export default AddressList;
