"use client";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { BannerData } from "~/types/banner";

interface BannerListProps {
	banners: BannerData[];
	onToggleActive: (id: string | number, isActive: boolean) => void;
	onEdit: (banner: BannerData) => void;
	onDelete: (id: number) => void;
}

const getDisplayTypeLabel = (type: string) => {
	switch (type) {
		case "1":
			return { name: "Banner chính (Hero Slider)", color: "text-blue-700 bg-blue-50 border-blue-200" };
		case "2":
			return { name: "Banner đôi (Split)", color: "text-purple-700 bg-purple-50 border-purple-200" };
		case "3":
			return { name: "Bên trái - Banner lưới (Grid Carousel)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
		case "4":
			return { name: "Banner cuối trang", color: "text-amber-700 bg-amber-50 border-amber-200" };
		case "5":
			return { name: "Bên phải - Banner phụ dọc (Side Banner)", color: "text-cyan-700 bg-cyan-50 border-cyan-200" };
		default:
			return { name: "Chưa xác định", color: "text-gray-500 bg-gray-50 border-gray-200" };
	}
};

export default function BannerList({ banners, onToggleActive, onEdit, onDelete }: BannerListProps) {
	if (banners.length === 0) {
		return (
			<div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
				<p className="text-4xl mb-3">🖼️</p>
				<p className="text-gray-500 font-medium">Chưa có banner nào được tạo</p>
				<p className="text-gray-400 text-sm mt-1">Nhấn "Tạo banner" để bắt đầu cấu hình</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
			{/* Table header */}
			<div className="hidden md:grid grid-cols-[1.5fr_2fr_1.5fr_1fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
				<span>Hình ảnh</span>
				<span>Tiêu đề / Chú thích</span>
				<span>Vị trí hiển thị</span>
				<span>Trạng thái</span>
				<span className="text-right pr-4">Thao tác</span>
			</div>

			<div className="divide-y divide-gray-50">
				{banners.map((banner) => {
					const displayInfo = getDisplayTypeLabel(String(banner.displayType));
					return (
						<div
							key={banner.id}
							className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1.5fr_1fr_auto] gap-3 md:gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors"
						>
							{/* Image preview */}
							<div className="flex items-center gap-3">
								{/* Active Switch Toggle */}
								<label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
									<input
										type="checkbox"
										checked={banner.isActive}
										onChange={(e) => onToggleActive(banner.id, e.target.checked)}
										className="sr-only peer"
									/>
									<div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-4 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
								</label>
								<div className="w-28 h-16 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative shadow-sm">
									{banner.imageUrl ? (
										<img
											src={banner.imageUrl}
											alt={banner.title}
											className="w-full h-full object-cover"
										/>
									) : (
										<span className="text-xs text-gray-400">Không có ảnh</span>
									)}
								</div>
							</div>

							{/* Title & subtitle content */}
							<div className="min-w-0">
								<h4 className="font-semibold text-gray-800 text-sm md:text-base truncate" dangerouslySetInnerHTML={{ __html: banner.title }} />
								{banner.content && (
									<p className="text-xs text-gray-400 mt-1 truncate">{banner.content}</p>
								)}
							</div>

							{/* Display Position Badge */}
							<div>
								<span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${displayInfo.color}`}>
									{displayInfo.name}
								</span>
							</div>

							{/* Active badge */}
							<div>
								{banner.isActive ? (
									<span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
										Bật
									</span>
								) : (
									<span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-400 border border-gray-200">
										Tắt
									</span>
								)}
							</div>

							{/* Actions */}
							<div className="flex items-center justify-start md:justify-end gap-2 pr-0 md:pr-4">
								<button
									onClick={() => onEdit(banner)}
									className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
									title="Chỉnh sửa"
								>
									<EditOutlined fontSize="small" />
								</button>
								<button
									onClick={() => onDelete(Number(banner.id))}
									className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
									title="Xóa"
								>
									<DeleteOutline fontSize="small" />
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
