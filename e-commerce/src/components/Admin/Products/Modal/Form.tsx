"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import Button from "~/components/atoms/Button";
import BaseDialog from "~/components/atoms/Dialog";
import { adminService } from "~/services/admin";
import { AdminCategory } from "~/types/admin";
import { ProductFormOutput, ProductFormValues, productSchema } from "~/utils/validator/adminproduct";
import ProductForm from "../Form";

interface ProductFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	categories: AdminCategory[];
	defaultValues?: Partial<ProductFormValues> | any;
	onSubmit: (data: ProductFormOutput) => Promise<void>;
	submitLabel: string;
}

const initialValues: ProductFormValues = {
	name: "",
	price: 0,
	stock: 0,
	categoryId: undefined,
	description: "",
	mainImageUrl: "",
	extraImage1: "",
	extraImage2: "",
	extraImage3: "",
	extraImage4: "",
	isActive: true,
	specifications: {},
};

export default function ProductFormModal({
	isOpen,
	onClose,
	title,
	categories,
	defaultValues,
	onSubmit,
	submitLabel,
}: ProductFormModalProps) {
	const [isFetchingDetail, setIsFetchingDetail] = useState(false);

	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { isSubmitting },
	} = useForm<ProductFormValues, any, ProductFormOutput>({
		resolver: zodResolver(productSchema),
		defaultValues: initialValues as DefaultValues<ProductFormValues>,
	});

	const fetchProductDetail = async (id: number) => {
		setIsFetchingDetail(true);
		try {
			const fullProduct = await adminService.getProductById(id);

			const formData = {
				...initialValues,
				...defaultValues,
				...fullProduct,
				// Handle both cases: Backend returns categoryId directly or nested category object (TypeORM relations)
				categoryId: fullProduct.categoryId
					? Number(fullProduct.categoryId)
					: (fullProduct.category?.id ? Number(fullProduct.category.id) : undefined),
				price: Number(fullProduct.price),
				stock: Number(fullProduct.stock),
				// Ensure specifications is loaded correctly instead of attributes
				specifications: fullProduct.specifications || {},
			};

			reset(formData);
		} catch (error) {
			console.error("Failed to fetch product detail:", error);
		} finally {
			setIsFetchingDetail(false);
		}
	};

	useEffect(() => {
		if (!isOpen) return;

		if (defaultValues?.id) {
			fetchProductDetail(defaultValues.id);
		} else {
			reset(initialValues);
		}
	}, [isOpen, defaultValues?.id, reset]);

	const handleFormSubmit = async (data: ProductFormOutput) => {
		console.log('Final Submit Data:', data);
		console.log('Specifications:', data.specifications);
		await onSubmit(data);
	};

	const onError = (errors: any) => {
		console.log("Validation Errors:", errors);
	};

	return (
		<BaseDialog isOpen={isOpen} onClose={onClose} title={title} showCloseIcon={true} width={900}>
			{isFetchingDetail ? (
				<div className="h-[400px] flex flex-col items-center justify-center gap-3 text-gray-500">
					<CircularProgress size={40} color="inherit" />
					<p className="text-sm">Loading product details...</p>
				</div>
			) : (
				<div className="flex flex-col gap-6">
					<ProductForm control={control} setValue={setValue} categories={categories} />

					<div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
						<Button variant="outline" theme="dark" onClick={onClose} className="!w-[100px]" disabled={isSubmitting}>
							Cancel
						</Button>
						<Button
							variant="solid"
							theme="dark"
							onClick={handleSubmit(handleFormSubmit, onError)}
							disabled={isSubmitting}
							className="!w-[120px] flex items-center justify-center gap-2"
						>
							{isSubmitting ? <CircularProgress size={30} color="inherit" /> : submitLabel}
						</Button>
					</div>
				</div>
			)}
		</BaseDialog>
	);
}
