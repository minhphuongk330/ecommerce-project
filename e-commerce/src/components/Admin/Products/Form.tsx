"use client";
import { Control, UseFormSetValue, useFieldArray, Controller, useWatch } from "react-hook-form";
import { useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Add from "@mui/icons-material/Add";
import CommonInput from "~/components/atoms/Input";
import ImageUploadInput from "~/components/atoms/ImageUploadInput";
import Button from "~/components/atoms/Button";
import { AdminCategory } from "~/types/admin";
import { ProductFormValues } from "~/utils/validator/adminproduct";

interface Props {
	control: Control<ProductFormValues>;
	setValue: UseFormSetValue<ProductFormValues>;
	categories: AdminCategory[];
}

const ProductForm = ({ control, setValue, categories }: Props) => {
	const selectedCategoryId = useWatch({ control, name: "categoryId" });

	const {
		fields: colorFields,
		append: appendColor,
		remove: removeColor,
	} = useFieldArray({
		control,
		name: "colors",
	});

	const {
		fields: variantFields,
		append: appendVariant,
		remove: removeVariant,
	} = useFieldArray({
		control,
		name: "variants",
	});

	const currentCategoryConfig = useMemo(() => {
		if (!selectedCategoryId) return null;
		const category = categories.find(c => Number(c.id) === Number(selectedCategoryId));
		if (!category?.configs) return null;
		try {
			return typeof category.configs === "string" ? JSON.parse(category.configs) : category.configs;
		} catch (error) {
			console.error("Error parsing category config", error);
			return null;
		}
	}, [selectedCategoryId, categories]);

	return (
		<div className="space-y-8 py-2">
			<div className="space-y-4">
				<h3 className="text-sm font-bold text-gray-800 uppercase border-b pb-2">Basic Information</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<CommonInput name="name" control={control} label="Product name" required />
					<CommonInput name="categoryId" control={control} label="Category" select required>
						{categories.map(cat => (
							<MenuItem key={cat.id} value={cat.id}>
								{cat.name}
							</MenuItem>
						))}
					</CommonInput>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<CommonInput name="price" control={control} label="Display Price ($)" type="number" required />
					<CommonInput name="stock" control={control} label="Total Stock" type="number" required />
				</div>
			</div>

			{currentCategoryConfig && (
				<div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
					<h3 className="text-sm font-bold text-blue-800 uppercase border-b border-blue-200 pb-2">
						Technical Specifications
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{Object.keys(currentCategoryConfig).map(key => (
							<CommonInput
								key={key}
								name={`attributes.${key}`}
								control={control}
								label={key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
								placeholder={`Enter ${key}...`}
							/>
						))}
					</div>
				</div>
			)}

			<div className="space-y-4">
				<div className="flex items-center justify-between border-b pb-2">
					<h3 className="text-sm font-bold text-gray-800 uppercase">Product Variants</h3>

					<Button
						type="button"
						variant="outline"
						className="!p-0 !h-auto text-green-600 hover:bg-transparent"
						onClick={() => appendVariant({ sku: "", price: 0, stock: 0 })}
					>
						<Add fontSize="small" className="mr-1" /> Add Variant
					</Button>
				</div>

				<div className="space-y-3">
					{variantFields.map((field, index) => (
						<div key={field.id} className="grid grid-cols-12 gap-3 p-3 border rounded-lg bg-gray-50 items-start">
							<div className="col-span-5">
								<CommonInput name={`variants.${index}.sku`} control={control} label="Variant Name" required />
							</div>

							<div className="col-span-3">
								<CommonInput
									name={`variants.${index}.price`}
									control={control}
									label="Price ($)"
									type="number"
									required
								/>
							</div>

							<div className="col-span-3">
								<CommonInput name={`variants.${index}.stock`} control={control} label="Stock" type="number" required />
							</div>

							<div className="col-span-1 flex justify-center mt-2">
								<IconButton onClick={() => removeVariant(index)} color="error">
									<DeleteOutline />
								</IconButton>
							</div>
						</div>
					))}
				</div>
			</div>

			<div>
				<div className="flex items-center justify-between mb-4 border-b pb-2">
					<h3 className="text-sm font-bold text-gray-800 uppercase">Colors</h3>

					<Button
						type="button"
						variant="outline"
						className="!p-0 !h-auto text-blue-600 hover:bg-transparent"
						onClick={() => appendColor({ colorName: "", colorHex: "#000000" })}
					>
						<Add fontSize="small" className="mr-1" /> Add color
					</Button>
				</div>

				<div className="space-y-4">
					{colorFields.map((field, index) => (
						<div
							key={field.id}
							className="flex items-end gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm items-end"
						>
							<div className="flex-1">
								<CommonInput name={`colors.${index}.colorName`} control={control} label="Color Name" />
							</div>

							<div>
								<Controller
									control={control}
									name={`colors.${index}.colorHex`}
									render={({ field: { onChange, value } }) => (
										<div className="flex flex-col gap-1">
											<label className="text-xs font-semibold text-gray-600">Color</label>

											<div className="h-[40px] flex items-center">
												<input
													type="color"
													value={value}
													onChange={onChange}
													className="w-[40px] h-[40px] p-1 border border-gray-300 rounded-md cursor-pointer"
												/>
											</div>
										</div>
									)}
								/>
							</div>

							<div className="col-span-1 flex justify-center">
								<IconButton onClick={() => removeColor(index)} color="error" className="mt-6">
									<DeleteOutline />
								</IconButton>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="space-y-4">
				<CommonInput name="shortDescription" control={control} label="Short description" multiline rows={2} />
				<CommonInput name="description" control={control} label="Detailed description" multiline rows={4} />
			</div>

			<div>
				<h3 className="mb-3 text-sm font-bold text-gray-800 uppercase border-b pb-2">Images</h3>

				<div className="space-y-3">
					<ImageUploadInput
						name="mainImageUrl"
						control={control}
						setValue={setValue}
						label="Main image (URL)"
						required
					/>

					<div className="grid grid-cols-2 gap-3">
						{[1, 2, 3, 4].map(index => (
							<ImageUploadInput
								key={index}
								name={`extraImage${index}` as keyof ProductFormValues}
								control={control}
								setValue={setValue}
								label={`Extra image ${index}`}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductForm;
