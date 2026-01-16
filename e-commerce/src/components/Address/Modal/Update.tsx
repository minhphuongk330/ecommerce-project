"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
				<AddressForm control={control} />

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
			</BaseDialog>
		</>
	);
}
