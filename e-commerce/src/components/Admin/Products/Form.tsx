"use client";
import { Control, UseFormSetValue, useFieldArray, Controller } from "react-hook-form";
import { MenuItem, IconButton } from "@mui/material";
import { Add, DeleteOutline } from "@mui/icons-material";
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
	const { fields, append, remove } = useFieldArray({
		control,
		name: "colors",
	});

	return (
		<div className="space-y-6 py-2">
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
				<CommonInput name="price" control={control} label="Price ($)" type="number" required />
				<CommonInput name="stock" control={control} label="Stock" type="number" required />
			</div>

			<div>
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Product colors</h3>
					<Button
						type="button"
						variant="outline"
						className="!p-0 !h-auto text-blue-600 hover:bg-transparent hover:text-blue-700"
						onClick={() => append({ colorName: "", colorHex: "#000000" })}
					>
						<Add fontSize="small" className="mr-1" /> Add color
					</Button>
				</div>

				<div className="space-y-3">
					{fields.map((field, index) => {
						return (
							<div key={field.id} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
								<div className="flex-1">
									<CommonInput
										name={`colors.${index}.colorName`}
										control={control}
										label="Color name"
										placeholder="Example: Red, Blue..."
									/>
								</div>

								<div className="flex flex-col gap-1">
									<label className="text-xs font-medium text-gray-600 ">Preview</label>
									<div className="flex items-center justify-center p-2 w-fit border rounded-md bg-white border-gray-300">
										<Controller
											control={control}
											name={`colors.${index}.colorHex`}
											render={({ field: { onChange, value } }) => (
												<input
													type="color"
													className="w-8 h-8 p-0 border-none cursor-pointer bg-transparent"
													value={value}
													onChange={onChange}
												/>
											)}
										/>
									</div>
								</div>

								<div className="mt-6">
									<IconButton onClick={() => remove(index)} color="error">
										<DeleteOutline />
									</IconButton>
								</div>
							</div>
						);
					})}
					{fields.length === 0 && <p className="text-sm text-gray-400 italic">No colors have been added.</p>}
				</div>
			</div>

			<div className="space-y-4">
				<CommonInput name="shortDescription" control={control} label="Short description" multiline rows={2} />
				<CommonInput name="description" control={control} label="Detailed description" multiline rows={4} />
			</div>

			<div>
				<h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Product images</h3>
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
