"use client";
import Add from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useMemo, useState } from "react";
import { Control, Controller, UseFormSetValue, useWatch } from "react-hook-form";
import Button from "~/components/atoms/Button";
import ImageUploadInput from "~/components/atoms/ImageUploadInput";
import CommonInput from "~/components/atoms/Input";
import { AdminCategory } from "~/types/admin";
import { ProductFormValues } from "~/utils/validator/adminproduct";

interface Props {
	control: Control<ProductFormValues>;
	setValue: UseFormSetValue<ProductFormValues>;
	categories: AdminCategory[];
}

const SPEC_LABELS: Record<string, string> = {

	brand: 'Hãng sản xuất',
	os: 'Hệ điều hành',
	cpu: 'Chip xử lý (CPU)',
	ram: 'RAM',
	storage: 'Dung lượng lưu trữ',
	screenSize: 'Màn hình rộng',
	screenTech: 'Công nghệ màn hình',
	rearCamera: 'Độ phân giải camera sau',
	frontCamera: 'Độ phân giải camera trước',
	battery: 'Dung lượng pin',
	charging: 'Hỗ trợ sạc tối đa',
	network: 'Mạng di động',
	sim: 'SIM',
	utilities: 'Tiện ích & Bảo mật',
	material: 'Chất liệu',
	dimensions: 'Kích thước, khối lượng',

	cpuDetail: 'Chi tiết CPU',
	gpu: 'Card đồ họa (GPU)',
	ramDetail: 'Chi tiết RAM',
	storageDetail: 'Chi tiết ổ cứng',
	screenDetail: 'Chi tiết màn hình',
	ports: 'Cổng kết nối',
	connectivity: 'Kết nối ',
	webcam: 'Webcam',
	keyboard: 'Bàn phím',
	audio: 'Âm thanh',
	batteryOs: 'Pin & Hệ điều hành',
	dimensionsWeight: 'Kích thước & Trọng lượng',

	screen: 'Màn hình',
	chip: 'Chip xử lý',
	weight: 'Trọng lượng',
	design: 'Thiết kế',
	health: 'Theo dõi sức khỏe',
	sports: 'Hỗ trợ tập luyện',
	sensors: 'Cảm biến & Định vị',
	waterproof: 'Chống nước',
	compatibility: 'Tương thích',
	chargingPort: 'Cổng sạc',
	audioTech: 'Công nghệ âm thanh',
	micro: 'Micro',
	resolution: 'Độ phân giải',
	viewAngle: 'Góc nhìn',
	nightVision: 'Tầm nhìn đêm',
	power: 'Nguồn điện & Pin',
	control: 'Điều khiển',
	vision: 'Tầm nhìn ban đêm',
	videoRes: 'Độ phân giải video',
	mountType: 'Kiểu gắn / lắp',
};

interface CategoryConfig {
	filters: string[];
	details: string[];
	fullWidthDetails?: string[];
}

const CATEGORY_CONFIGS: Record<number, CategoryConfig> = {
	1: {
		filters: ['brand', 'ram', 'storage', 'os', 'battery', 'screenSize'],
		details: ['cpu', 'screenTech', 'rearCamera', 'frontCamera', 'charging', 'sim', 'network', 'utilities', 'material', 'dimensions'],
		fullWidthDetails: ['utilities', 'dimensions'],
	},
	2: {
		filters: ['brand', 'cpu', 'ram', 'storage', 'screenSize'],
		details: ['cpuDetail', 'gpu', 'ramDetail', 'storageDetail', 'screenDetail', 'ports', 'connectivity', 'webcam', 'keyboard', 'audio', 'batteryOs', 'dimensionsWeight', 'material'],
		fullWidthDetails: ['cpuDetail', 'storageDetail', 'screenDetail', 'ports', 'batteryOs', 'dimensionsWeight'],
	},
	3: {
		filters: ['brand', 'cpu', 'ram', 'storage', 'screenSize', 'os'],
		details: ['screenTech', 'gpu', 'rearCamera', 'frontCamera', 'connectivity', 'utilities', 'battery', 'charging', 'material', 'dimensions'],
		fullWidthDetails: ['utilities', 'dimensions'],
	},
	4: {
		filters: ['brand', 'screenSize', 'os', 'battery'],
		details: ['screenTech', 'material', 'sports', 'health', 'utilities', 'connectivity', 'sensors'],
	},
	5: {
		filters: ['brand', 'battery', 'connectivity'],
		details: ['audioTech', 'compatibility', 'utilities', 'control', 'dimensionsWeight'],
	},
	6: {
		filters: ['brand', 'resolution', 'vision', 'storage'],
		details: ['utilities', 'connectivity', 'power', 'dimensions'],
		fullWidthDetails: ['utilities'],
	},
};

const getAllKeys = (config: CategoryConfig): string[] => [
	...config.filters,
	...config.details,
];

const COLOR_MAP: Record<string, string> = {
	"Đen": "#000000",
	"Trắng": "#FFFFFF",
	"Đỏ": "#FF0000",
	"Xanh dương": "#0000FF",
	"Xanh lá": "#008000",
	"Vàng": "#FFFF00",
	"Cam": "#FF8C00",
	"Tím": "#800080",
	"Hồng": "#FFC0CB",
	"Xám": "#808080",
	"Bạc": "#C0C0C0",
};

const ProductForm = ({ control, setValue, categories }: Props) => {
	const selectedCategoryId = useWatch({ control, name: "categoryId" });
	const currentSpecs = useWatch({ control, name: "specifications" });
	const colorValue = useWatch({ control, name: "color" }) || "";

	const [colorRows, setColorRows] = useState<{ name: string; hex: string; stock: number }[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);


	useEffect(() => {
		if (!isInitialized && (colorValue || currentSpecs?.colorStock)) {
			const names = colorValue.split(",").map((c: string) => c.trim()).filter(Boolean);
			const rows = names.map(name => ({
				name,
				hex: currentSpecs?.colorHex?.[name] || COLOR_MAP[name] || "#000000",
				stock: Number(currentSpecs?.colorStock?.[name]) || 0,
			}));
			setColorRows(rows);
			setIsInitialized(true);
		}
	}, [colorValue, currentSpecs, isInitialized]);


	useEffect(() => {
		if (!isInitialized) return;

		const colorStr = colorRows.map(r => r.name.trim()).filter(Boolean).join(", ");
		setValue("color", colorStr || undefined, { shouldValidate: true, shouldDirty: true });

		const colorStockMap: Record<string, number> = {};
		const colorHexMap: Record<string, string> = {};

		colorRows.forEach(r => {
			const trimmedName = r.name.trim();
			if (trimmedName) {
				colorStockMap[trimmedName] = Number(r.stock) || 0;
				colorHexMap[trimmedName] = r.hex;
			}
		});

		const updatedSpecs = {
			...(currentSpecs || {}),
			colorStock: Object.keys(colorStockMap).length > 0 ? colorStockMap : undefined,
			colorHex: Object.keys(colorHexMap).length > 0 ? colorHexMap : undefined,
		};

		if (!updatedSpecs.colorStock) delete updatedSpecs.colorStock;
		if (!updatedSpecs.colorHex) delete updatedSpecs.colorHex;

		setValue("specifications", updatedSpecs, { shouldValidate: true, shouldDirty: true });

		if (colorRows.length > 0) {
			const totalStock = colorRows.reduce((sum, r) => sum + (Number(r.stock) || 0), 0);
			setValue("stock", totalStock, { shouldValidate: true, shouldDirty: true });
		}
	}, [colorRows, setValue, isInitialized]);

	const addRow = () => {
		setColorRows(prev => [...prev, { name: "", hex: "#000000", stock: 0 }]);
		setIsInitialized(true);
	};

	const updateRow = (index: number, key: "name" | "hex" | "stock", value: any) => {
		setColorRows(prev => prev.map((row, idx) => {
			if (idx !== index) return row;
			return { ...row, [key]: value };
		}));
	};

	const removeRow = (index: number) => {
		setColorRows(prev => prev.filter((_, idx) => idx !== index));
	};

	const categoryConfig = useMemo(() => {
		if (!selectedCategoryId) return null;
		return CATEGORY_CONFIGS[Number(selectedCategoryId)] || null;
	}, [selectedCategoryId]);


	useEffect(() => {
		if (!categoryConfig) return;
		const allKeys = getAllKeys(categoryConfig);
		const newSpecs: Record<string, any> = {};
		allKeys.forEach(key => {
			newSpecs[key] = currentSpecs?.[key] || "";
		});

		if (currentSpecs?.colorStock) {
			newSpecs.colorStock = currentSpecs.colorStock;
		}
		if (currentSpecs?.colorHex) {
			newSpecs.colorHex = currentSpecs.colorHex;
		}
		setValue("specifications", newSpecs, { shouldValidate: true, shouldDirty: true });
	}, [selectedCategoryId, categoryConfig, setValue]);

	return (
		<div className="space-y-8 py-2">
			<div className="space-y-4">
				<h3 className="text-sm font-bold text-gray-800 uppercase border-b pb-2">Thông tin cơ bản</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<CommonInput name="name" control={control} label="Tên sản phẩm" required />
					<CommonInput name="categoryId" control={control} label="Danh mục" select required>
						{categories.map(cat => (
							<MenuItem key={cat.id} value={cat.id}>
								{cat.name}
							</MenuItem>
						))}
					</CommonInput>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<CommonInput name="price" control={control} label="Giá hiển thị" type="number" required />
					<CommonInput
						name="stock"
						control={control}
						label={colorRows.length > 0 ? "Tổng tồn kho (tự động tính)" : "Tổng tồn kho"}
						type="number"
						required
						disabled={colorRows.length > 0}
					/>
				</div>

				<div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-150 shadow-sm transition-all duration-300 hover:shadow-md">
					<div className="flex items-center justify-between border-b pb-3 border-gray-100">
						<div>
							<h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Màu sắc & Tồn kho</h4>
							<p className="text-xs text-gray-400 mt-0.5">Thêm màu sắc và quản lý số lượng tồn kho tương ứng</p>
						</div>
						<button
							type="button"
							onClick={addRow}
							className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white hover:bg-[#333] rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 active:scale-95 shadow-sm"
						>
							<Add sx={{ fontSize: 16 }} />
							<span>Thêm màu</span>
						</button>
					</div>

					{colorRows.length === 0 ? (
						<div className="text-center py-6 text-gray-400 text-sm italic">
							Chưa cấu hình màu sắc cho sản phẩm này. (Tồn kho sẽ được nhập trực tiếp ở trên)
						</div>
					) : (
						<div className="space-y-3 mt-4">
							{colorRows.map((row, index) => (
								<div
									key={index}
									className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-300 transition-all duration-200"
								>
									<div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-inner cursor-pointer flex-shrink-0">
										<input
											type="color"
											value={row.hex}
											onChange={e => updateRow(index, "hex", e.target.value)}
											className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
										/>
									</div>

									<input
										type="text"
										value={row.name}
										onChange={e => updateRow(index, "name", e.target.value)}
										placeholder="Tên màu (ví dụ: Đen, Trắng, Vàng)"
										className="flex-1 min-w-0 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
									/>

									<div className="flex items-center gap-2">
										<span className="text-xs text-gray-400 font-medium">Kho:</span>
										<input
											type="number"
											min={0}
											value={row.stock}
											onChange={e => updateRow(index, "stock", Number(e.target.value))}
											placeholder="0"
											className="w-24 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-center font-semibold text-gray-800"
										/>
									</div>

									<button
										type="button"
										onClick={() => removeRow(index)}
										className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer active:scale-90"
										title="Xóa màu này"
									>
										<DeleteOutline fontSize="small" />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="flex items-center gap-6 mt-1">
					<Controller
						control={control}
						name="isFeatured"
						render={({ field }) => (
							<label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
								<input
									type="checkbox"
									checked={!!field.value}
									onChange={e => field.onChange(e.target.checked)}
									className="w-4 h-4 accent-black"
								/>
								Sản phẩm nổi bật
							</label>
						)}
					/>
					<Controller
						control={control}
						name="isActive"
						render={({ field }) => (
							<label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
								<input
									type="checkbox"
									checked={field.value !== false}
									onChange={e => field.onChange(e.target.checked)}
									className="w-4 h-4 accent-black"
								/>
								Đang bán
							</label>
						)}
					/>
				</div>
			</div>

			{categoryConfig && (
				<div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
					<h3 className="text-sm font-bold text-blue-800 uppercase border-b border-blue-200 pb-2">
						Thông số kỹ thuật
					</h3>

					<div className="space-y-6">
						<div>
							<h4 className="text-xs font-semibold text-blue-700 mb-3 uppercase">Bộ lọc</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{categoryConfig.filters.map(key => (
									<CommonInput
										key={key}
										name={`specifications.${key}`}
										control={control}
										label={SPEC_LABELS[key] || key}
										placeholder={`Nhập ${SPEC_LABELS[key] || key}...`}
									/>
								))}
							</div>
						</div>

						{categoryConfig.details.length > 0 && (
							<div>
								<h4 className="text-xs font-semibold text-blue-700 mb-3 uppercase">Thông tin chi tiết</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{categoryConfig.details.map(key => {
										const isFullWidth = categoryConfig.fullWidthDetails?.includes(key) ?? false;
										return (
											<CommonInput
												key={key}
												name={`specifications.${key}`}
												control={control}
												label={SPEC_LABELS[key] || key}
												placeholder={`Nhập ${SPEC_LABELS[key] || key}...`}
												className={isFullWidth ? 'md:col-span-2' : ''}
											/>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			<div className="space-y-4">
				<CommonInput name="description" control={control} label="Mô tả chi tiết" multiline rows={4} />
			</div>

			<div>
				<h3 className="mb-3 text-sm font-bold text-gray-800 uppercase border-b pb-2">Hình ảnh</h3>
				<div className="space-y-3">
					<ImageUploadInput
						name="mainImageUrl"
						control={control}
						setValue={setValue}
						label="Hình ảnh chính"
						required
						onRemove={() => setValue("mainImageUrl", "", { shouldValidate: true })}
					/>
					<ExtraImages control={control} setValue={setValue} />
				</div>
			</div>
		</div>
	);
};

const EXTRA_IMAGE_KEYS = ["extraImage1", "extraImage2", "extraImage3", "extraImage4"] as const;

interface ExtraImagesProps {
	control: Control<ProductFormValues>;
	setValue: UseFormSetValue<ProductFormValues>;
}

const ExtraImages = ({ control, setValue }: ExtraImagesProps) => {
	const values = useWatch({ control, name: EXTRA_IMAGE_KEYS });
	const filledCount = values.filter(Boolean).length;
	const [visibleCount, setVisibleCount] = React.useState(() => Math.max(filledCount, 0));
	const canAddMore = visibleCount < EXTRA_IMAGE_KEYS.length;

	const handleRemove = (index: number) => {
		for (let i = index; i < visibleCount - 1; i++) {
			setValue(EXTRA_IMAGE_KEYS[i], (values[i + 1] || "") as any, { shouldValidate: true });
		}
		setValue(EXTRA_IMAGE_KEYS[visibleCount - 1], "" as any, { shouldValidate: true });
		setVisibleCount(c => c - 1);
	};

	return (
		<div className="space-y-3">
			{EXTRA_IMAGE_KEYS.slice(0, visibleCount).map((key, index) => (
				<ImageUploadInput
					key={key}
					name={key}
					control={control}
					setValue={setValue}
					label={`Hình ảnh phụ ${index + 1}`}
					onRemove={() => handleRemove(index)}
				/>
			))}
			{canAddMore && (
				<Button
					type="button"
					variant="outline"
					className="!p-0 !h-auto text-blue-600 hover:bg-transparent"
					onClick={() => setVisibleCount(c => c + 1)}
				>
					<Add fontSize="small" className="mr-1" /> Thêm hình ảnh
				</Button>
			)}
		</div>
	);
};

export default ProductForm;
