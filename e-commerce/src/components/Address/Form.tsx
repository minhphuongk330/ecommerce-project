"use client";
import { Controller, Control } from "react-hook-form";
import { AddressFormData } from "~/types/address";
import CommonInput from "~/components/atoms/Input";
import Checkbox from "~/components/atoms/Checkbox";

interface AddressFormProps {
	control: Control<AddressFormData>;
}

export default function AddressForm({ control }: AddressFormProps) {
	return (
		<div className="flex flex-col gap-3 lg:gap-4">
			<CommonInput
				name="receiverName"
				control={control}
				label="Receiver Name"
				placeholder="Ex: John Doe"
				required
				className="text-base lg:text-sm"
			/>

			<CommonInput
				name="phone"
				control={control}
				label="Phone Number"
				placeholder="Ex: 0912345678"
				required
				className="text-base lg:text-sm"
			/>

			<CommonInput
				name="address"
				control={control}
				label="Address"
				placeholder="Ex: 123 Street..."
				required
				multiline
				rows={3}
				className="text-base lg:text-sm"
			/>

			<Controller
				name="isDefault"
				control={control}
				render={({ field }) => (
					<div className="mt-2 lg:mt-0">
						<Checkbox
							id="is-default-address"
							label="Set as default address"
							checked={field.value}
							onChange={field.onChange}
						/>
					</div>
				)}
			/>
		</div>
	);
}
