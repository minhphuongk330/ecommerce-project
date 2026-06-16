"use client";
import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Close from "@mui/icons-material/Close";

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
	adminReply?: string;
	resolvedAt?: string | Date;
	createdAt: string | Date;
}

interface ContactDetailModalProps {
	contact: Contact | null;
	open: boolean;
	onClose: () => void;
	onResolve?: (id: number, adminReply: string) => Promise<void>;
}

export default function ContactDetailModal({ contact, open, onClose, onResolve }: ContactDetailModalProps) {
	const [replyContent, setReplyContent] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");


	useEffect(() => {
		setReplyContent("");
		setError("");
		setSubmitting(false);
	}, [contact]);

	if (!contact) return null;


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
		month: "long",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	const resolvedDateFormatted = contact.resolvedAt
		? parseSupportDate(contact.resolvedAt).toLocaleDateString("vi-VN", {
				year: "numeric",
				month: "long",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
		  })
		: "";

	const avatarChar = contact.user?.fullName ? contact.user.fullName.charAt(0).toUpperCase() : "U";

	const handleSubmitReply = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!replyContent.trim()) {
			setError("Vui lòng nhập nội dung phản hồi");
			return;
		}
		if (replyContent.trim().length < 5) {
			setError("Nội dung phản hồi quá ngắn (tối thiểu 5 ký tự)");
			return;
		}

		try {
			setError("");
			setSubmitting(true);
			if (onResolve) {
				await onResolve(contact.id, replyContent.trim());
			}
		} catch (err) {
			setError("Gửi phản hồi thất bại, vui lòng thử lại.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: "20px",
					padding: "8px",
				},
			}}
		>
			<DialogTitle className="flex justify-between items-center !border-b !border-gray-100 !pb-4">
				<div className="flex items-center gap-2.5">
					<span className="text-xl">📩</span>
					<span className="font-bold text-gray-800 text-lg">Chi tiết phản hồi</span>
				</div>
				<button
					onClick={onClose}
					className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
				>
					<Close fontSize="small" />
				</button>
			</DialogTitle>

			<DialogContent className="!pt-6 !pb-4 space-y-6">

				<div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-2xl">
					<div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
						{avatarChar}
					</div>
					<div className="min-w-0">
						<h4 className="font-bold text-gray-800 text-sm md:text-base">
							{contact.user?.fullName || "Khách hàng ẩn danh"}
						</h4>
						<p className="text-xs text-gray-500 truncate mt-0.5">
							Email: {contact.user?.email || "Chưa thiết lập"}
						</p>
					</div>
				</div>


				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Chủ đề</span>
							<div className="mt-1">
								<span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-black text-white">
									{contact.subject}
								</span>
							</div>
						</div>

						<div>
							<span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Trạng thái</span>
							<div className="mt-1">
								{contact.status === "PENDING" ? (
									<span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
										Chờ xử lý
									</span>
								) : (
									<span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-200">
										Đã giải quyết
									</span>
								)}
							</div>
						</div>
					</div>

					<div>
						<span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ngày gửi yêu cầu</span>
						<p className="text-sm text-gray-700 font-medium mt-1">{dateFormatted}</p>
					</div>

					<div>
						<span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Nội dung khách hàng gửi</span>
						<div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl mt-1.5 min-h-[100px] max-h-[220px] overflow-y-auto">
							<p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
								{contact.content}
							</p>
						</div>
					</div>


					<div className="pt-4 border-t border-gray-100">
						{contact.status === "RESOLVED" ? (
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phản hồi từ Cyber Store</span>
									<span className="text-[10px] text-gray-400 font-medium">{resolvedDateFormatted}</span>
								</div>
								<div className="bg-blue-50/40 border border-blue-100 p-4 rounded-2xl">
									<p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap font-medium">
										{contact.adminReply || "Đã giải quyết nhưng không ghi nhận nội dung phản hồi."}
									</p>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubmitReply} className="space-y-3">
								<span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">Gửi câu trả lời phản hồi</span>
								<textarea
									value={replyContent}
									onChange={(e) => setReplyContent(e.target.value)}
									placeholder="Nhập câu trả lời chi tiết cho khách hàng để giải quyết yêu cầu hỗ trợ này..."
									rows={4}
									disabled={submitting}
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none transition-shadow"
								/>
								{error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
								<div className="flex justify-end pt-1">
									<button
										type="submit"
										disabled={submitting}
										className="px-6 py-2.5 bg-black hover:bg-black/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
									>
										{submitting ? (
											<>
												<svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
												</svg>
												Đang gửi phản hồi...
											</>
										) : (
											"Gửi phản hồi"
										)}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
