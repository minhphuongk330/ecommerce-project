"use client";
import React, { useState } from "react";
import Button from "~/components/atoms/Button";
import { useNotification } from "~/contexts/Notification";

export default function ContactPage() {
	const { showNotification } = useNotification();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.email || !formData.message) {
			showNotification("Please fill in all required fields.", "error");
			return;
		}
		showNotification("Thank you for your message! We'll get back to you soon.", "success");
		setFormData({ name: "", email: "", subject: "", message: "" });
	};

	return (
		<div className="w-full bg-white min-h-screen">
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8 md:py-[40px]">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl md:text-4xl font-bold text-black mb-6 md:mb-8">Contact Us</h1>

					<div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-8">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
							<p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
								Have a question or need help? Fill out the form below and we'll get back to you as soon as possible.
							</p>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
										Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
										placeholder="Your name"
									/>
								</div>
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
										Email <span className="text-red-500">*</span>
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
										placeholder="your.email@example.com"
									/>
								</div>
								<div>
									<label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
										Subject
									</label>
									<input
										type="text"
										id="subject"
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
										placeholder="What is this regarding?"
									/>
								</div>
								<div>
									<label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
										Message <span className="text-red-500">*</span>
									</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows={6}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
										placeholder="Your message..."
									/>
								</div>
								<div className="pt-4">
									<Button
										type="submit"
										theme="dark"
										className="!w-full md:!w-auto !px-8 !py-3 !rounded-lg !bg-black !text-white"
									>
										Send Message
									</Button>
								</div>
							</form>
						</div>

						<div className="space-y-6">
							<div className="bg-gray-50 rounded-lg p-6">
								<h3 className="text-base font-semibold text-black mb-4">Contact Info</h3>
								<div className="space-y-4 text-gray-700">
									<div className="flex items-start gap-3">
										<svg
											className="w-5 h-5 mt-0.5 text-gray-500 shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
										<div>
											<p className="text-sm font-medium text-black">Email</p>
											<p className="text-sm">support@example.com</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<svg
											className="w-5 h-5 mt-0.5 text-gray-500 shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											/>
										</svg>
										<div>
											<p className="text-sm font-medium text-black">Phone</p>
											<p className="text-sm">+1 (555) 123-4567</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<svg
											className="w-5 h-5 mt-0.5 text-gray-500 shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<div>
											<p className="text-sm font-medium text-black">Hours</p>
											<p className="text-sm">Mon - Fri, 9 AM - 6 PM</p>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-black rounded-lg p-6 text-white">
								<h3 className="text-base font-semibold mb-2">Quick Response</h3>
								<p className="text-sm text-gray-300 leading-relaxed">
									We typically respond within 24 hours on business days.
								</p>
							</div>

							<div className="bg-gray-50 rounded-lg p-6">
								<h3 className="text-base font-semibold text-black mb-3">FAQ</h3>
								<div className="space-y-3 text-sm text-gray-700">
									<p>
										<span className="font-medium text-black">Returns?</span> Within 30 days of purchase.
									</p>
									<p>
										<span className="font-medium text-black">Shipping?</span> Free on orders over $50.
									</p>
									<p>
										<span className="font-medium text-black">Tracking?</span> Check the Orders section.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
