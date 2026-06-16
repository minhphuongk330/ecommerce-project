"use client";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { AdminCategory } from "~/types/admin";

interface CategoryListProps {
	categories: AdminCategory[];
	onEdit: (category: AdminCategory) => void;
	onDelete: (id: number) => void;
}

export default function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
	if (categories.length === 0) {
		return (
			<div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
				<p className="text-4xl mb-3">📂</p>
				<p className="text-gray-500 font-medium">Chưa có danh mục nào</p>
				<p className="text-gray-400 text-sm mt-1">Nhấn "Thêm danh mục" để bắt đầu</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
			{/* Table header */}
			<div className="hidden md:grid grid-cols-[1fr_3fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
				<span>Mã ID</span>
				<span>Tên danh mục</span>
				<span className="text-right pr-4">Thao tác</span>
			</div>

			<div className="divide-y divide-gray-50">
				{categories.map((category) => (
					<div
						key={category.id}
						className="grid grid-cols-1 md:grid-cols-[1fr_3fr_auto] gap-3 md:gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors"
					>
						{/* ID */}
						<div className="flex items-center">
							<span className="md:hidden text-xs font-semibold text-gray-400 uppercase mr-3">Mã ID:</span>
							<span className="font-mono text-xs text-gray-500">#{category.id}</span>
						</div>

						{/* Category Name */}
						<div className="flex items-center">
							<span className="md:hidden text-xs font-semibold text-gray-400 uppercase mr-3">Tên:</span>
							<span className="font-semibold text-gray-800 text-sm md:text-base">{category.name}</span>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-start md:justify-end gap-2 pr-0 md:pr-4">
							<button
								onClick={() => onEdit(category)}
								className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
								title="Chỉnh sửa"
							>
								<EditOutlined fontSize="small" />
							</button>
							<button
								onClick={() => onDelete(category.id)}
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
