"use client";
import React, { useState } from "react";
import Button from "~/components/atoms/Button";
import { useNotification } from "~/contexts/Notification";

export default function ContactPage() {
	const { showNotification } = useNotification();
	const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.email || !formData.message) {
			showNotification("Vui lòng điền đầy đủ các trường bắt buộc.", "error");
			return;
		}
		showNotification("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.", "success");
		setFormData({ name: "", email: "", subject: "", message: "" });
	};

	return (
		<div className="w-full bg-white min-h-screen">
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8 md:py-[40px]">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl md:text-4xl font-bold text-black mb-6 md:mb-8">Liên hệ</h1>

					<div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-8">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
							<p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
								Bạn có câu hỏi hoặc cần hỗ trợ? Điền vào form bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể.
							</p>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
										Họ và tên <span className="text-red-500">*</span>
									</label>
									<input
										type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
										placeholder="Họ và tên của bạn"
									/>
								</div>
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
										Email <span className="text-red-500">*</span>
									</label>
									<input
										type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
										placeholder="email@example.com"
									/>
								</div>
								<div>
									<label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
										Tiêu đề
									</label>
									<input
										type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
										placeholder="Nội dung liên quan đến?"
									/>
								</div>
								<div>
									<label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
										Nội dung <span className="text-red-500">*</span>
									</label>
									<textarea
										id="message" name="message" value={formData.message} onChange={handleChange} required rows={6}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
										placeholder="Nội dung tin nhắn..."
									/>
								</div>
								<div className="pt-4">
									<Button type="submit" theme="dark" className="!w-full md:!w-auto !px-8 !py-3 !rounded-lg !bg-black !text-white">
										Gửi tin nhắn
									</Button>
								</div>
							</form>
						</div>

						<div className="space-y-6">
							<div className="bg-gray-50 rounded-lg p-6">
								<h3 className="text-base font-semibold text-black mb-4">Thông tin liên hệ</h3>
								<div className="space-y-4 text-gray-700">
									<div className="flex items-start gap-3">
										<svg className="w-5 h-5 mt-0.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
										<div>
											<p className="text-sm font-medium text-black">Email</p>
											<p className="text-sm">support@cyberstore.vn</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<svg className="w-5 h-5 mt-0.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
										</svg>
										<div>
											<p className="text-sm font-medium text-black">Điện thoại</p>
											<p className="text-sm">1900 xxxx</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<svg className="w-5 h-5 mt-0.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<div>
											<p className="text-sm font-medium text-black">Giờ làm việc</p>
											<p className="text-sm">Thứ 2 - Thứ 7, 8:00 - 21:00</p>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-black rounded-lg p-6 text-white">
								<h3 className="text-base font-semibold mb-2">Phản hồi nhanh</h3>
								<p className="text-sm text-gray-300 leading-relaxed">
									Chúng tôi thường phản hồi trong vòng 24 giờ trong ngày làm việc.
								</p>
							</div>

							<div className="bg-gray-50 rounded-lg p-6">
								<h3 className="text-base font-semibold text-black mb-3">Câu hỏi thường gặp</h3>
								<div className="space-y-3 text-sm text-gray-700">
									<p><span className="font-medium text-black">Đổi trả?</span> Trong vòng 30 ngày kể từ ngày mua.</p>
									<p><span className="font-medium text-black">Bảo hành?</span> 12 tháng chính hãng.</p>
									<p><span className="font-medium text-black">Theo dõi đơn?</span> Xem trong mục Đơn hàng.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
