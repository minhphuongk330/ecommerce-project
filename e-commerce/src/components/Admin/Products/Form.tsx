"use client";
import Add from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useMemo } from "react";
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

// ─── Từ điển dịch thuật ───────────────────────────────────────────────────────
const SPEC_LABELS: Record<string, string> = {
	// Điện thoại
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
	// Laptop
	cpuDetail: 'Chi tiết CPU',
	gpu: 'Card đồ họa (GPU)',
	ramDetail: 'Chi tiết RAM',
	storageDetail: 'Chi tiết ổ cứng',
	screenDetail: 'Chi tiết màn hình',
	ports: 'Cổng kết nối',
	connectivity: 'Kết nối không dây',
	webcam: 'Webcam',
	keyboard: 'Bàn phím',
	audio: 'Âm thanh',
	batteryOs: 'Pin & Hệ điều hành',
	dimensionsWeight: 'Kích thước & Trọng lượng',
	// Legacy / các danh mục khác
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

// ─── Configuration Mapping theo từng danh mục ────────────────────────────────
interface CategoryConfig {
	filters: string[];          // nhóm Bộ lọc — giá trị ngắn, dùng để filter sidebar
	details: string[];          // nhóm Thông tin chi tiết — nhập liệu tự do
	fullWidthDetails?: string[]; // keys nào chiếm cả 2 cột
}

const CATEGORY_CONFIGS: Record<number, CategoryConfig> = {
	1: { // Điện thoại
		filters: ['brand', 'ram', 'storage', 'os', 'battery', 'screenSize'],
		details: ['cpu', 'screenTech', 'rearCamera', 'frontCamera', 'charging', 'sim', 'network', 'utilities', 'material', 'dimensions'],
		fullWidthDetails: ['utilities', 'dimensions'],
	},
	2: { // Laptop
		filters: ['brand', 'cpu', 'ram', 'storage', 'screenSize'],
		details: ['cpuDetail', 'gpu', 'ramDetail', 'storageDetail', 'screenDetail', 'ports', 'connectivity', 'webcam', 'keyboard', 'audio', 'batteryOs', 'dimensionsWeight', 'material'],
		fullWidthDetails: ['cpuDetail', 'storageDetail', 'screenDetail', 'ports', 'batteryOs', 'dimensionsWeight'],
	},
	3: { // Tablet
		filters: ['brand', 'cpu', 'ram', 'storage', 'screenSize', 'os'],
		details: ['screenTech', 'gpu', 'rearCamera', 'frontCamera', 'connectivity', 'utilities', 'battery', 'charging', 'material', 'dimensions'],
		fullWidthDetails: ['utilities', 'dimensions'],
	},
	4: { // Smartwatch
		filters: ['brand', 'screenSize', 'os', 'battery'],
		details: ['screenTech', 'material', 'sports', 'health', 'utilities', 'connectivity', 'sensors'],
	},
	5: { // Tai nghe
		filters: ['brand', 'battery', 'connectivity'],
		details: ['audioTech', 'compatibility', 'utilities', 'control', 'dimensionsWeight'],
	},
	6: { // Camera an ninh / hành trình
		filters: ['brand', 'resolution', 'vision', 'storage'],
		details: ['utilities', 'connectivity', 'power', 'dimensions'],
		fullWidthDetails: ['utilities'],
	},
};

const getAllKeys = (config: CategoryConfig): string[] => [
	...config.filters,
	...config.details,
];

// ─── Component chính ──────────────────────────────────────────────────────────
const ProductForm = ({ control, setValue, categories }: Props) => {
	const selectedCategoryId = useWatch({ control, name: "categoryId" });
	const currentSpecs = useWatch({ control, name: "specifications" });

	const categoryConfig = useMemo(() => {
		if (!selectedCategoryId) return null;
		return CATEGORY_CONFIGS[Number(selectedCategoryId)] || null;
	}, [selectedCategoryId]);

	// Reset specifications khi đổi danh mục, giữ lại giá trị cũ nếu key trùng
	useEffect(() => {
		if (!categoryConfig) return;
		const allKeys = getAllKeys(categoryConfig);
		const newSpecs: Record<string, string> = {};
		allKeys.forEach(key => {
			newSpecs[key] = currentSpecs?.[key] || "";
		});
		setValue("specifications", newSpecs, { shouldValidate: true, shouldDirty: true });
	}, [selectedCategoryId, categoryConfig, setValue]);

	return (
		<div className="space-y-8 py-2">
			{/* ── Basic Information ─────────────────────────────────── */}
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
								Featured Product
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
								Active
							</label>
						)}
					/>
				</div>
			</div>

			{/* ── Thông số kỹ thuật (render theo config) ────────────── */}
			{categoryConfig && (
				<div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
					<h3 className="text-sm font-bold text-blue-800 uppercase border-b border-blue-200 pb-2">
						Thông số kỹ thuật
					</h3>

					<div className="space-y-6">
						{/* Nhóm Bộ lọc */}
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

						{/* Nhóm Thông tin chi tiết */}
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

			{/* ── Description ───────────────────────────────────────── */}
			<div className="space-y-4">
				<CommonInput name="description" control={control} label="Detailed description" multiline rows={4} />
			</div>

			{/* ── Images ────────────────────────────────────────────── */}
			<div>
				<h3 className="mb-3 text-sm font-bold text-gray-800 uppercase border-b pb-2">Images</h3>
				<div className="space-y-3">
					<ImageUploadInput
						name="mainImageUrl"
						control={control}
						setValue={setValue}
						label="Main image"
						required
						onRemove={() => setValue("mainImageUrl", "", { shouldValidate: true })}
					/>
					<ExtraImages control={control} setValue={setValue} />
				</div>
			</div>
		</div>
	);
};

// ─── Extra Images ─────────────────────────────────────────────────────────────
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
					label={`Extra image ${index + 1}`}
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
					<Add fontSize="small" className="mr-1" /> Add more images
				</Button>
			)}
		</div>
	);
};

export default ProductForm;
