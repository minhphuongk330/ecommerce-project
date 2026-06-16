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
	color: "",
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

			const specs = fullProduct.specifications || {};
			if (fullProduct.color && !specs.colorStock) {
				const colors = fullProduct.color.split(",").map((c: any) => c.trim()).filter(Boolean);
				const stockVal = Number(fullProduct.stock) || 0;
				specs.colorStock = {};
				if (colors.length === 1) {
					specs.colorStock[colors[0]] = stockVal;
				} else {
					colors.forEach((c: any) => {
						specs.colorStock[c] = 0;
					});
				}
			}

			const formData = {
				...initialValues,
				...defaultValues,
				...fullProduct,

				categoryId: fullProduct.categoryId
					? Number(fullProduct.categoryId)
					: (fullProduct.category?.id ? Number(fullProduct.category.id) : undefined),
				price: Number(fullProduct.price),
				stock: Number(fullProduct.stock),
				color: fullProduct.color || "",

				specifications: specs,
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

		if (data.color && (data.specifications as any)?.colorStock) {
			const colors = data.color.split(",").map(c => c.trim()).filter(Boolean);
			const cleanColorStock: Record<string, number> = {};
			colors.forEach(c => {
				cleanColorStock[c] = Number((data.specifications as any).colorStock[c]) || 0;
			});
			(data.specifications as any).colorStock = cleanColorStock;
		} else if (data.specifications) {
			delete (data.specifications as any).colorStock;
		}
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
					<p className="text-sm">Đang tải chi tiết sản phẩm...</p>
				</div>
			) : (
				<div className="flex flex-col gap-6">
					<ProductForm control={control} setValue={setValue} categories={categories} />

					<div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
						<Button variant="outline" theme="dark" onClick={onClose} className="!w-[100px]" disabled={isSubmitting}>
							Huỷ
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
