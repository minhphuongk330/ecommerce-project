"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { sendChatMessage } from "~/services/chatbot";

interface ChatMessage {
	sender: "user" | "bot";
	text: string;
}

export default function Chatbot() {
	const pathname = usePathname();
	const mode = pathname?.startsWith("/admin") ? "admin" : "client";
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([
		{ sender: "bot", text: "Xin chào! Mình có thể giúp gì cho bạn hôm nay?" },
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim()) return;

		const userMsg = input.trim();

		const currentHistory = [...messages];

		setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
		setInput("");
		setIsLoading(true);

		try {
			const res = await sendChatMessage(userMsg, currentHistory, mode);
			if (res && res.reply) {
				setMessages(prev => [...prev, { sender: "bot", text: res.reply }]);
			}
		} catch (error) {
			setMessages(prev => [...prev, { sender: "bot", text: "Xin lỗi, hiện tại tôi không thể kết nối tới server." }]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-50">
			{!isOpen ? (
				<button
					onClick={() => setIsOpen(true)}
					className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-gray-800 transition-all"
				>
					<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
						<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
					</svg>
				</button>
			) : (
				<div className="flex h-[450px] w-[350px] flex-col rounded-2xl bg-white shadow-2xl border border-gray-200">
					<div className="flex items-center justify-between rounded-t-2xl bg-black px-4 py-3 text-white">
						<span className="font-semibold text-sm tracking-wide">AI Assistant</span>
						<button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
							<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path d="M18 6L6 18M6 6l12 12"></path>
							</svg>
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
						{messages.map((msg, idx) => (
							<div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
								<div
									className={`max-w-[80%] px-4 py-2 text-sm shadow-sm ${msg.sender === "user" ? "bg-black text-white rounded-2xl rounded-br-sm" : "bg-white text-black border border-gray-100 rounded-2xl rounded-bl-sm"}`}
								>
									{msg.text}
								</div>
							</div>
						))}
						{isLoading && (
							<div className="flex justify-start">
								<div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white border border-gray-100 px-4 py-2 text-sm text-gray-500 animate-pulse">
									Đang trả lời...
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					<div className="border-t p-3 bg-white rounded-b-2xl flex gap-2">
						<input
							type="text"
							className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
							placeholder="Nhập tin nhắn..."
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={e => e.key === "Enter" && handleSend()}
						/>
						<button
							onClick={handleSend}
							disabled={isLoading || !input.trim()}
							className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition-all"
						>
							<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
							</svg>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
