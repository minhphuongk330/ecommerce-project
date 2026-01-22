"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EditOutlined from "@mui/icons-material/EditOutlined";
import BaseDialog from "~/components/atoms/Dialog";
import StepButton from "~/components/checkout/Button";
import { useNotification } from "~/contexts/Notification";
import { addressService } from "~/services/address";
import { Address, AddressFormData } from "~/types/address";
import { addressSchema } from "~/utils/validator/address";
import AddressForm from "../Form";

interface UpdateAddressProps {
	address: Address;
	onSuccess: () => void;
}

export default function UpdateAddress({ address, onSuccess }: UpdateAddressProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { showNotification } = useNotification();

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm<AddressFormData>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			receiverName: address.receiverName,
			phone: address.phone,
			address: address.address,
			isDefault: address.isDefault,
		},
	});

	useEffect(() => {
		if (isOpen) {
			reset({
				receiverName: address.receiverName,
				phone: address.phone,
				address: address.address,
				isDefault: address.isDefault,
			});
		}
	}, [isOpen, address, reset]);

	const closeDialog = () => {
		setIsOpen(false);
	};

	const handleUpdate = async (data: AddressFormData) => {
		try {
			await addressService.updateAddress(address.id, data);
			showNotification("Update successful!", "success");
			setIsOpen(false);
			onSuccess();
		} catch (error) {
			console.error(error);
			showNotification("Update failed.", "error");
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={e => {
					e.stopPropagation();
					setIsOpen(true);
				}}
				className="text-black hover:opacity-60 transition-opacity p-2"
				title="Edit Address"
			>
				<EditOutlined sx={{ fontSize: 24 }} />
			</button>

			<BaseDialog isOpen={isOpen} onClose={closeDialog} title="Update Address" showCloseIcon={true} width={600}>
				<div className="flex flex-col lg:block">
					<div className="flex-1 overflow-y-auto max-h-[60vh] p-1 lg:max-h-none lg:overflow-visible">
						<AddressForm control={control} />
					</div>

					<div className="mt-4 pt-3 border-t border-gray-100 lg:border-none lg:pt-0 lg:mt-6">
						<StepButton
							layout="full"
							type="submit"
							primaryLabel="Update"
							isLoading={isSubmitting}
							secondaryLabel="Cancel"
							onSecondaryClick={closeDialog}
							className="!h-[48px]"
							onPrimaryClick={handleSubmit(handleUpdate)}
						/>
					</div>
				</div>
			</BaseDialog>
		</>
	);
}
