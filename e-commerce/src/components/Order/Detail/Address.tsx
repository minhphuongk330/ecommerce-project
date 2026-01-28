import { Address } from "~/types/address";

interface OrderAddressProps {
	address?: Address;
}

export default function OrderAddress({ address }: OrderAddressProps) {
	return (
		<div className="bg-white p-6 rounded-lg border border-gray-200">
			<h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Shipping Address</h3>
			{address ? (
				<div className="text-sm text-gray-600 space-y-2">
					<p className="font-bold text-black">Name : {address.receiverName}</p>
					<p>Address : {address.address}</p>
					<p>Phone : {address.phone}</p>
				</div>
			) : (
				<p className="text-sm text-gray-400 italic">Address info not available</p>
			)}
		</div>
	);
}
