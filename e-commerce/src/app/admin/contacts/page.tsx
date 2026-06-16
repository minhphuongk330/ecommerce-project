"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useClientPagination, paginateItems } from "~/hooks/usePagination";
import MailOutline from "@mui/icons-material/MailOutline";
import { adminService } from "~/services/admin";
import ContactList from "~/components/Admin/Contacts/List";
import ContactDetailModal from "~/components/Admin/Contacts/DetailModal";
import { TableSkeleton } from "~/components/Skeletons";
import { useNotification } from "~/contexts/Notification";
import PaginationComponent from "~/components/atoms/Pagination";
import AdminEmptyState from "~/components/Admin/AdminEmptyState";

const ITEMS_PER_PAGE = 6;

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

export default function AdminContactsPage() {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [subjectFilter, setSubjectFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const { showNotification } = useNotification();

	const fetchContacts = useCallback(async () => {
		try {
			setLoading(true);
			const data = await adminService.getContacts();
			setContacts(data);
		} catch (err: any) {
			showNotification("Không thể tải danh sách phản hồi liên hệ", "error");
		} finally {
			setLoading(false);
		}
	}, [showNotification]);

	useEffect(() => {
		fetchContacts();
	}, [fetchContacts]);

	const handleSelectContact = (contact: Contact) => {
		setSelectedContact(contact);
		setIsDetailOpen(true);
	};

	const handleCloseDetail = () => {
		setIsDetailOpen(false);
		setSelectedContact(null);
	};

	const handleResolve = async (id: number, adminReply: string) => {
		try {
			await adminService.resolveContact(id, adminReply);
			showNotification("Gửi phản hồi và giải quyết yêu cầu thành công!", "success");
			handleCloseDetail();
			fetchContacts();
		} catch (err: any) {
			const errorMsg = err?.response?.data?.message || "Giải quyết liên hệ thất bại";
			showNotification(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg, "error");
		}
	};
	const pendingCount = useMemo(() => {
		return contacts.filter(c => c.status === "PENDING").length;
	}, [contacts]);

	const filteredContacts = useMemo(() => {
		return contacts.filter((contact) => {
			let matchesSubject = true;
			if (subjectFilter !== "all") {
				const subjectLower = contact.subject.toLowerCase();
				if (subjectFilter === "order") {
					matchesSubject = subjectLower.includes("đơn hàng") || subjectLower.includes("vận chuyển") || subjectLower.includes("order");
				} else if (subjectFilter === "product") {
					matchesSubject = subjectLower.includes("sản phẩm") || subjectLower.includes("tư vấn") || subjectLower.includes("product");
				} else if (subjectFilter === "warranty") {
					matchesSubject = subjectLower.includes("bảo hành") || subjectLower.includes("đổi trả") || subjectLower.includes("warranty");
				} else if (subjectFilter === "tech") {
					matchesSubject = subjectLower.includes("kỹ thuật") || subjectLower.includes("tech");
				} else if (subjectFilter === "feedback") {
					matchesSubject = subjectLower.includes("góp ý") || subjectLower.includes("khiếu nại") || subjectLower.includes("feedback");
				}
			}
			const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
			const query = searchQuery.trim().toLowerCase();
			const matchesSearch =
				query === "" ||
				(contact.user?.fullName || "").toLowerCase().includes(query) ||
				(contact.user?.email || "").toLowerCase().includes(query) ||
				contact.content.toLowerCase().includes(query) ||
				contact.subject.toLowerCase().includes(query);

			return matchesSubject && matchesStatus && matchesSearch;
		});
	}, [contacts, subjectFilter, statusFilter, searchQuery]);

	const { currentPage, totalPages, setCurrentPage } = useClientPagination(
		filteredContacts.length,
		ITEMS_PER_PAGE,
		[searchQuery, subjectFilter, statusFilter],
	);
	const paginatedContacts = paginateItems(filteredContacts, currentPage, ITEMS_PER_PAGE);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
						<MailOutline className="!text-amber-600" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Hòm thư hỗ trợ (Admin Inbox)</h1>
						<p className="text-sm text-gray-500">
							Tổng cộng {contacts.length} phản hồi ·{" "}
							<span className="font-semibold text-amber-600">{pendingCount} thư chờ giải quyết</span>
						</p>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
				<div className="flex-1">
					<label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tìm kiếm</label>
					<input
						type="text"
						placeholder="Tìm theo tên, email, nội dung..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
					/>
				</div>

				<div className="w-full md:w-56">
					<label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Chủ đề</label>
					<select
						value={subjectFilter}
						onChange={(e) => setSubjectFilter(e.target.value)}
						className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
					>
						<option value="all">Tất cả chủ đề</option>
						<option value="order">Đơn hàng / Vận chuyển</option>
						<option value="product">Tư vấn sản phẩm</option>
						<option value="warranty">Chính sách bảo hành / Đổi trả</option>
						<option value="tech">Hỗ trợ kỹ thuật</option>
						<option value="feedback">Góp ý / Khiếu nại</option>
					</select>
				</div>

				<div className="w-full md:w-44">
					<label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Trạng thái</label>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
					>
						<option value="all">Tất cả trạng thái</option>
						<option value="PENDING">Chờ xử lý</option>
						<option value="RESOLVED">Đã giải quyết</option>
					</select>
				</div>
			</div>

			{loading ? (
				<TableSkeleton rows={5} columns={5} />
			) : contacts.length === 0 ? (
				<ContactList contacts={[]} onSelectContact={handleSelectContact} />
			) : filteredContacts.length === 0 ? (
				<AdminEmptyState 
					title="Không tìm thấy thư liên hệ phù hợp" 
					description="Thử lại với từ khóa khác hoặc thay đổi bộ lọc chủ đề / trạng thái" 
				/>
			) : (
				<>
					<ContactList contacts={paginatedContacts} onSelectContact={handleSelectContact} />
					<div className="mt-6">
						<PaginationComponent
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={(page) => setCurrentPage(page)}
						/>
					</div>
				</>
			)}

			<ContactDetailModal
				contact={selectedContact}
				open={isDetailOpen}
				onClose={handleCloseDetail}
				onResolve={handleResolve}
			/>
		</div>
	);
}
