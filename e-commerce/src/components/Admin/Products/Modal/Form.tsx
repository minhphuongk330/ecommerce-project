"use client";
import { useEffect, useState } from "react";
import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "~/components/atoms/Button";
import BaseDialog from "~/components/atoms/Dialog";
import ProductForm from "../Form";
import { AdminCategory } from "~/types/admin";
import { adminService } from "~/services/admin";
import { ProductFormValues, productSchema, ProductFormOutput } from "~/utils/validator/adminproduct";

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
	shortDescription: "",
	mainImageUrl: "",
	extraImage1: "",
	extraImage2: "",
	extraImage3: "",
	extraImage4: "",
	isActive: true,
	colors: [],
	attributes: {},
	variants: [],
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
				categoryId: fullProduct.categoryId ? Number(fullProduct.categoryId) : undefined,
				price: Number(fullProduct.price),
				stock: Number(fullProduct.stock),

				colors:
					fullProduct.productColors?.map((c: any) => ({
						id: c.id,
						colorName: c.colorName || c.name || "",
						colorHex: c.colorHex || c.hex || c.colorCode || "#000000",
					})) || [],

				attributes: fullProduct.attributes || {},

				variants:
					fullProduct.variants?.map((v: any) => ({
						sku: v.sku || v.options?.name || "",
						price: Number(v.price),
						stock: Number(v.stock),
						options: v.options,
					})) || [],
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
		const cleanData = {
			...data,
			colors: data.colors?.map(({ id, ...rest }: any) => rest),

			variants: data.variants?.map(v => ({
				price: v.price,
				stock: v.stock,
				sku: v.sku,
				options: { name: v.sku },
			})),
		};
		await onSubmit(cleanData);
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
