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
				label="Tên người nhận"
				placeholder="Ex: Nguyễn Văn A"
				required
				className="text-base lg:text-sm"
			/>

			<CommonInput
				name="phone"
				control={control}
				label="Số điện thoại"
				placeholder="Ex: 0912345678"
				required
				className="text-base lg:text-sm"
			/>

			<CommonInput
				name="address"
				control={control}
				label="Địa chỉ chi tiết"
				placeholder="Ex: 123 ĐườngABC, Phường XYZ, Quận..."
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
							label="Đặt làm địa chỉ mặc định"
							checked={field.value}
							onChange={field.onChange}
						/>
					</div>
				)}
			/>
		</div>
	);
}
