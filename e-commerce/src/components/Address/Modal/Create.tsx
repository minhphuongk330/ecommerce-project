"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import BaseDialog from "~/components/atoms/Dialog";
import StepButton from "~/components/checkout/Button";
import { useNotification } from "~/contexts/Notification";
import { addressService } from "~/services/address";
import { useAuthStore } from "~/stores/useAuth";
import { AddressFormData } from "~/types/address";
import { addressSchema } from "~/utils/validator/address";
import AddButton from "../AddButton";
import AddressForm from "../Form";

interface CreateAddressProps {
	onSuccess: () => void;
}

export default function CreateAddress({ onSuccess }: CreateAddressProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { showNotification } = useNotification();
	const user = useAuthStore(state => state.user);

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm<AddressFormData>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			receiverName: "",
			phone: "",
			address: "",
			isDefault: false,
		},
	});

	useEffect(() => {
		if (!isOpen) reset();
	}, [isOpen, reset]);

	const handleCreate = async (data: AddressFormData) => {
		try {
			if (!user || !user.id) {
				showNotification("Please log in again to proceed.", "error");
				return;
			}

			await addressService.createAddress({
				...data,
				customerId: Number(user.id),
			});

			showNotification("Address added successfully!", "success");
			setIsOpen(false);
			onSuccess();
		} catch (error) {
			console.error(error);
			showNotification("Add failed. Please try again.", "error");
		}
	};

	return (
		<>
			<AddButton onClick={() => setIsOpen(true)} />

			<BaseDialog
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Add New Address"
				showCloseIcon={true}
				width={600}
			>
				<div className="flex flex-col lg:block">
					<div className="flex-1 overflow-y-auto max-h-[60vh] p-1 lg:max-h-none lg:overflow-visible">
						<AddressForm control={control} />
					</div>

					<div className="mt-4 pt-3 border-t border-gray-100 lg:border-none lg:pt-0 lg:mt-6">
						<StepButton
							layout="full"
							type="submit"
							primaryLabel="Save"
							isLoading={isSubmitting}
							secondaryLabel="Cancel"
							onSecondaryClick={() => setIsOpen(false)}
							className="w-full"
							buttonClassName="!h-[48px]"
							onPrimaryClick={handleSubmit(handleCreate)}
						/>
					</div>
				</div>
			</BaseDialog>
		</>
	);
}
