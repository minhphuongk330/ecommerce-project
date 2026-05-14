"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useMemo, useState } from "react";
import { DetailsSectionProps } from "~/types/component";

// Vietnamese label dictionary for specifications
const specLabels: Record<string, string> = {
	// Điện thoại
	os: 'Hệ điều hành',
	cpu: 'Chip xử lý (CPU)',
	ram: 'RAM',
	storage: 'Dung lượng lưu trữ',
	screenSize: 'Màn hình rộng',
	screenTech: 'Công nghệ màn hình',
	rearCamera: 'Camera sau',
	frontCamera: 'Camera trước',
	battery: 'Dung lượng pin',
	charging: 'Sạc pin',
	network: 'Mạng di động',
	sim: 'SIM',
	utilities: 'Tiện ích & Bảo mật',
	material: 'Chất liệu',
	dimensions: 'Kích thước, khối lượng',
	brand: 'Hãng sản xuất',
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
	power: 'Nguồn điện',
	wifi: 'WiFi',
	bluetooth: 'Bluetooth',
	control: 'Điều khiển',
	vision: 'Tầm nhìn ban đêm',
	videoRes: 'Độ phân giải video',
	mountType: 'Kiểu gắn / lắp',
};

// specGroups per danh mục — chỉ render key nào có dữ liệu
const SPEC_GROUPS_BY_CATEGORY: Record<number, { title: string; keys: string[] }[]> = {
	1: [ // Điện thoại
		{ title: 'Cấu hình & Bộ nhớ', keys: ['os', 'cpu', 'ram', 'storage', 'chip', 'gpu'] },
		{ title: 'Camera & Màn hình', keys: ['screenSize', 'screenTech', 'rearCamera', 'frontCamera', 'screen', 'resolution', 'viewAngle', 'nightVision'] },
		{ title: 'Pin & Sạc', keys: ['battery', 'charging', 'chargingPort', 'power'] },
		{ title: 'Tiện ích', keys: ['utilities', 'health', 'sports', 'waterproof', 'compatibility', 'audioTech', 'micro'] },
		{ title: 'Kết nối', keys: ['network', 'sim', 'wifi', 'bluetooth', 'ports', 'connectivity'] },
		{ title: 'Thiết kế & Chất liệu', keys: ['brand', 'material', 'dimensions', 'design', 'weight'] },
	],
	2: [ // Laptop
		{ title: 'Cấu hình', keys: ['brand', 'cpu', 'ram', 'storage', 'os'] },
		{ title: 'Chi tiết CPU & GPU', keys: ['cpuDetail', 'gpu'] },
		{ title: 'Bộ nhớ', keys: ['ramDetail', 'storageDetail'] },
		{ title: 'Màn hình', keys: ['screenSize', 'screenDetail'] },
		{ title: 'Kết nối & Cổng', keys: ['ports', 'connectivity', 'webcam'] },
		{ title: 'Bàn phím & Âm thanh', keys: ['keyboard', 'audio'] },
		{ title: 'Pin & Hệ điều hành', keys: ['batteryOs', 'battery'] },
		{ title: 'Thiết kế & Kích thước', keys: ['material', 'dimensionsWeight', 'weight'] },
	],
	3: [ // Tablet
		{ title: 'Cấu hình & Bộ nhớ', keys: ['brand', 'os', 'cpu', 'ram', 'storage', 'gpu'] },
		{ title: 'Màn hình', keys: ['screenSize', 'screenTech'] },
		{ title: 'Camera', keys: ['rearCamera', 'frontCamera'] },
		{ title: 'Kết nối & Cuộc gọi', keys: ['connectivity', 'network', 'sim', 'wifi', 'bluetooth'] },
		{ title: 'Tiện ích', keys: ['utilities'] },
		{ title: 'Pin & Sạc', keys: ['battery', 'charging'] },
		{ title: 'Thiết kế & Chất liệu', keys: ['material', 'dimensions', 'weight'] },
	],
	4: [ // Smartwatch
		{ title: 'Cấu hình', keys: ['brand', 'os', 'screenSize', 'screenTech'] },
		{ title: 'Sức khỏe & Tập luyện', keys: ['health', 'sports', 'sensors'] },
		{ title: 'Tiện ích & Kết nối', keys: ['utilities', 'connectivity', 'waterproof'] },
		{ title: 'Pin & Thiết kế', keys: ['battery', 'material', 'dimensions', 'weight'] },
	],
	6: [ // Camera an ninh / hành trình
		{ title: 'Thông tin chung', keys: ['brand', 'resolution', 'vision', 'storage'] },
		{ title: 'Tiện ích & Kết nối', keys: ['utilities', 'connectivity'] },
		{ title: 'Nguồn điện & Kích thước', keys: ['power', 'dimensions', 'dimensionsWeight', 'weight'] },
	],
};

// Fallback groups cho các danh mục chưa định nghĩa
const DEFAULT_SPEC_GROUPS = [
	{ title: 'Thông số kỹ thuật', keys: ['brand', 'os', 'cpu', 'ram', 'storage', 'screen', 'chip', 'battery', 'connectivity', 'resolution', 'viewAngle', 'nightVision', 'waterproof', 'power', 'utilities', 'health', 'sports', 'audioTech', 'micro', 'chargingPort', 'compatibility', 'ports'] },
	{ title: 'Thiết kế & Chất liệu', keys: ['material', 'dimensions', 'dimensionsWeight', 'design', 'weight'] },
];

// Helper to format spec key to Vietnamese label
const formatSpecLabel = (key: string): string => {
	// Use Vietnamese label if available
	if (specLabels[key]) {
		return specLabels[key];
	}
	// Fallback: capitalize first letter and replace underscores with spaces
	return key
		.replace(/_/g, " ")
		.replace(/([A-Z])/g, " $1")
		.trim()
		.replace(/^\w/, (c) => c.toUpperCase());
};

const DetailsSection: React.FC<DetailsSectionProps> = ({ product }) => {
	const [openGroups, setOpenGroups] = useState<string[]>([]);

	const toggleGroup = (title: string) => {
		setOpenGroups(prev =>
			prev.includes(title)
				? prev.filter(t => t !== title)
				: [...prev, title]
		);
	};

	const validGroups = useMemo(() => {
		if (!product.specifications || Object.keys(product.specifications).length === 0) return [];

		const specEntries = Object.entries(product.specifications).filter(([_, value]) => {
			if (value === null || value === undefined) return false;
			if (typeof value === "string" && value.trim() === "") return false;
			if (typeof value === "object" && Object.keys(value).length === 0) return false;
			return true;
		});

		const specsMap = new Map(specEntries);
		const usedKeys = new Set<string>();

		// Chọn specGroups theo danh mục sản phẩm
		const categoryId = product.category?.id ?? product.categoryId;
		const specGroups = (categoryId && SPEC_GROUPS_BY_CATEGORY[categoryId])
			? SPEC_GROUPS_BY_CATEGORY[categoryId]
			: DEFAULT_SPEC_GROUPS;

		const groups = specGroups.map(group => {
			const groupSpecs = group.keys
				.filter(key => specsMap.has(key))
				.map(key => {
					usedKeys.add(key);
					return {
						key,
						name: formatSpecLabel(key),
						value: String(specsMap.get(key)),
					};
				});
			return { ...group, specs: groupSpecs };
		}).filter(group => group.specs.length > 0);

		// Thêm những specs không nằm trong mapping vào nhóm "Thông tin khác"
		const otherSpecs = specEntries
			.filter(([key]) => !usedKeys.has(key))
			.map(([key, value]) => ({
				key,
				name: formatSpecLabel(key),
				value: String(value),
			}));

		if (otherSpecs.length > 0) {
			groups.push({ title: 'Thông tin khác', keys: [], specs: otherSpecs });
		}

		return groups;
	}, [product.specifications, product.category, product.categoryId]);

	if (!product.description && validGroups.length === 0) return null;

	return (
		<div className="w-full bg-[#FAFAFA] flex justify-center py-4 md:py-[20px] px-4 md:px-[160px]">
			{validGroups.length > 0 && (
				<div className="flex flex-col w-full mt-2 md:mt-[10px] pt-4 border-t border-gray-100">
					<h3 className="text-lg md:text-[20px] font-bold text-black mb-4 md:mb-[24px] uppercase">
						Cấu hình sản phẩm
					</h3>

					<div className="flex flex-col gap-3">
						{validGroups.map((group, index) => {
							const isOpen = openGroups.includes(group.title);
							return (
								<div key={index} className="flex flex-col border border-[#EBEBEB] rounded-lg overflow-hidden bg-white">
									<button
										onClick={() => toggleGroup(group.title)}
										className="flex justify-between items-center w-full px-4 py-3 bg-[#F8F9FA] hover:bg-gray-100 transition-colors cursor-pointer"
									>
										<span className="font-bold text-black">{group.title}</span>
										{isOpen ? (
											<ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
										) : (
											<ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
										)}
									</button>

									<div
										className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
											}`}
									>
										<div className="overflow-hidden">
											<div className="flex flex-col">
												{group.specs.map((item, specIndex) => (
													<div
														key={specIndex}
														className="flex flex-col sm:flex-row justify-between items-start p-3 sm:p-4 border-t border-[#EBEBEB] odd:bg-white even:bg-gray-50 hover:bg-gray-100/50 transition-colors"
													>
														<span className="text-sm md:text-base text-gray-500 font-medium capitalize w-full sm:w-1/3">
															{item.name}
														</span>
														<div className="text-sm md:text-base text-black font-semibold text-left sm:text-right w-full sm:w-2/3 break-words mt-1 sm:mt-0">
															{item.value}
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default DetailsSection;
