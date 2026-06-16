import React from "react";

interface AdminEmptyStateProps {
	title?: string;
	description?: string;
}

const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
	title = "Không tìm thấy kết quả phù hợp",
	description = "Thử lại với từ khóa khác hoặc xóa bộ lọc tìm kiếm",
}) => {
	return (
		<div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
			<p className="text-4xl mb-3">🔍</p>
			<p className="text-gray-500 font-medium">{title}</p>
			<p className="text-gray-400 text-sm mt-1">{description}</p>
		</div>
	);
};

export default AdminEmptyState;
