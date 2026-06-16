"use client";
import React from "react";

interface Contact {
	id: number;
	userId: number;
	user?: {
		fullName?: string;
		email?: string;
	};
	subject: string;
	content: string;
	status: string;
	createdAt: string | Date;
}

interface ContactListProps {
	contacts: Contact[];
	onSelectContact: (contact: Contact) => void;
}

const getSubjectBadge = (subject: string) => {
	const sub = subject.toLowerCase();
	if (sub.includes("đơn hàng") || sub.includes("vận chuyển") || sub.includes("order")) {
		return "text-blue-700 bg-blue-50 border-blue-200";
	}
	if (sub.includes("sản phẩm") || sub.includes("tư vấn") || sub.includes("product")) {
		return "text-purple-700 bg-purple-50 border-purple-200";
	}
	if (sub.includes("bảo hành") || sub.includes("đổi trả") || sub.includes("warranty")) {
		return "text-orange-700 bg-orange-50 border-orange-200";
	}
	if (sub.includes("kỹ thuật") || sub.includes("tech")) {
		return "text-red-700 bg-red-50 border-red-200";
	}
	return "text-emerald-700 bg-emerald-50 border-emerald-200"; // Góp ý / feedback
};

export default function ContactList({ contacts, onSelectContact }: ContactListProps) {
	if (contacts.length === 0) {
		return (
			<div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
				<p className="text-4xl mb-3">📬</p>
				<p className="text-gray-500 font-medium">Hộp thư trống</p>
				<p className="text-gray-400 text-sm mt-1">Chưa có liên hệ phản hồi nào khớp với bộ lọc</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
			{/* Table Header */}
			<div className="hidden md:grid grid-cols-[1.5fr_1.5fr_2.5fr_1fr_1fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
				<span>Người gửi</span>
				<span>Chủ đề</span>
				<span>Nội dung tóm tắt</span>
				<span>Ngày gửi</span>
				<span className="text-right pr-4">Trạng thái</span>
			</div>

			{/* Table Rows */}
			<div className="divide-y divide-gray-50">
				{contacts.map((contact) => {
					const parseSupportDate = (dateVal: string | Date) => {
						if (!dateVal) return new Date();
						if (typeof dateVal === "string") {
							if (!dateVal.endsWith("Z") && !dateVal.includes("+")) {
								return new Date(dateVal.includes("T") ? dateVal + "Z" : dateVal.replace(" ", "T") + "Z");
							}
						}
						return new Date(dateVal);
					};

					const dateFormatted = parseSupportDate(contact.createdAt).toLocaleDateString("vi-VN", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					});

					const truncatedContent =
						contact.content.length > 60
							? contact.content.substring(0, 60) + "..."
							: contact.content;

					return (
						<div
							key={contact.id}
							onClick={() => onSelectContact(contact)}
							className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_2.5fr_1fr_1fr] gap-3 md:gap-4 px-6 py-4 items-center hover:bg-gray-50/70 transition-all cursor-pointer border-l-2 border-transparent hover:border-black"
						>
							{/* Sender info */}
							<div className="min-w-0">
								<h4 className="font-semibold text-gray-800 text-sm truncate">
									{contact.user?.fullName || "Khách ẩn danh"}
								</h4>
								<p className="text-xs text-gray-400 truncate mt-0.5">
									{contact.user?.email || `ID: ${contact.userId}`}
								</p>
							</div>

							{/* Subject Badge */}
							<div>
								<span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getSubjectBadge(contact.subject)}`}>
									{contact.subject}
								</span>
							</div>

							{/* Preview message */}
							<div className="min-w-0">
								<p className="text-sm text-gray-600 truncate">{truncatedContent}</p>
							</div>

							{/* Sent time */}
							<div>
								<p className="text-xs text-gray-500 font-medium">{dateFormatted}</p>
							</div>

							{/* Status Badge */}
							<div className="text-right pr-0 md:pr-4">
								{contact.status === "PENDING" ? (
									<span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
										Chờ xử lý
									</span>
								) : (
									<span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
										Đã giải quyết
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
