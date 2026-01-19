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
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
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
				<div className="max-w-2xl mx-auto">
					<h1 className="text-3xl md:text-4xl font-bold text-black mb-6 md:mb-8">Contact Us</h1>

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

						<div className="mt-8 pt-8 border-t border-gray-200">
							<h3 className="text-lg font-semibold text-black mb-4">Other Ways to Reach Us</h3>
							<div className="space-y-3 text-gray-700">
								<p className="text-base">
									<strong>Email:</strong> support@example.com
								</p>
								<p className="text-base">
									<strong>Phone:</strong> +1 (555) 123-4567
								</p>
								<p className="text-base">
									<strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
