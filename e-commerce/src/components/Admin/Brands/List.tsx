"use client";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { AdminBrand } from "~/types/admin";
import ImagePreview from "~/components/atoms/ImagePreview";

interface BrandListProps {
	brands: AdminBrand[];
	onEdit: (brand: AdminBrand) => void;
	onDelete: (id: number) => void;
}

export default function BrandList({ brands, onEdit, onDelete }: BrandListProps) {
	if (brands.length === 0) {
		return (
			<div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
				<p className="text-4xl mb-3">🏢</p>
				<p className="text-gray-500 font-medium">Chưa có thương hiệu nào</p>
				<p className="text-gray-400 text-sm mt-1">Nhấn "Thêm thương hiệu" để bắt đầu</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
			{/* Table header */}
			<div className="hidden md:grid grid-cols-[1fr_2fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
				<span>Logo</span>
				<span>Tên thương hiệu</span>
				<span className="text-right pr-4">Thao tác</span>
			</div>

			<div className="divide-y divide-gray-50">
				{brands.map((brand) => (
					<div
						key={brand.id}
						className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 md:gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors"
					>
						{/* Logo */}
						<div className="flex items-center gap-3">
							<span className="md:hidden text-xs font-semibold text-gray-400 uppercase">Logo:</span>
							<div className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
								{brand.logoUrl ? (
									<img
										src={brand.logoUrl}
										alt={brand.name}
										className="w-full h-full object-contain"
										onError={(e) => {
											e.currentTarget.style.display = "none";
											e.currentTarget.parentElement!.innerHTML = `<span class="text-lg font-bold text-gray-400">${brand.name[0]}</span>`;
										}}
									/>
								) : (
									<span className="text-lg font-bold text-gray-400">{brand.name[0]}</span>
								)}
							</div>
						</div>

						{/* Brand Name */}
						<div className="flex items-center">
							<span className="md:hidden text-xs font-semibold text-gray-400 uppercase mr-3">Tên:</span>
							<span className="font-semibold text-gray-800 text-sm md:text-base">{brand.name}</span>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-start md:justify-end gap-2 pr-0 md:pr-4">
							<button
								onClick={() => onEdit(brand)}
								className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
								title="Chỉnh sửa"
							>
								<EditOutlined fontSize="small" />
							</button>
							<button
								onClick={() => onDelete(brand.id)}
								className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
								title="Xóa"
							>
								<DeleteOutline fontSize="small" />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
