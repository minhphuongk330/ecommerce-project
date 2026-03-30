"use client";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { sendChatMessage } from "~/services/chatbot";

interface ChatMessage {
	id: number;
	sender: "user" | "bot";
	text: string;
}

function TypingIndicator() {
	return (
		<div className="flex items-center gap-1 px-4 py-3 bg-gray-100 rounded-2xl rounded-tl-sm w-fit">
			<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
			<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
			<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
		</div>
	);
}

function ChatbotComponent() {
	const pathname = usePathname();
	const mode = pathname?.startsWith("/admin") ? "admin" : "client";
	const STORAGE_KEY = `chatbot_history_${mode}`;
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				setMessages(JSON.parse(stored));
			} else {
				const greeting =
					mode === "admin"
						? { id: Date.now(), sender: "bot" as const, text: "Xin chào Quản trị viên. Tôi có thể báo cáo số liệu gì cho bạn hôm nay?" }
						: { id: Date.now(), sender: "bot" as const, text: "Xin chào! Mình là trợ lý AI của Cyber Store. Mình có thể giúp gì cho bạn?" };
				setMessages([greeting]);
			}
		} catch (error) {
			console.error("Failed to load chat history:", error);
		}
	}, [mode, STORAGE_KEY]);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
		} catch (error) {
			console.error("Failed to save chat history:", error);
		}
	}, [messages, STORAGE_KEY]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		return () => { abortControllerRef.current?.abort(); };
	}, []);

	const handleSend = useCallback(async () => {
		if (!input.trim() || isLoading) return;
		const userMsg = input.trim();
		const currentHistory = [...messages];
		setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: userMsg }]);
		setInput("");
		setIsLoading(true);
		if (abortControllerRef.current) abortControllerRef.current.abort();
		abortControllerRef.current = new AbortController();

		try {
			const res = await sendChatMessage(userMsg, currentHistory, mode, abortControllerRef.current.signal);
			if (res?.reply) {
				setMessages(prev => [...prev, { id: Date.now(), sender: "bot", text: res.reply }]);
			}
		} catch (error: any) {
			if (error.name !== "AbortError") {
				setMessages(prev => [...prev, { id: Date.now(), sender: "bot", text: "Xin lỗi, hiện tại tôi không thể kết nối tới server." }]);
			}
		} finally {
			setIsLoading(false);
		}
	}, [input, isLoading, messages, mode]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") { e.preventDefault(); handleSend(); }
		},
		[handleSend],
	);

	const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);

	return (
		<div className="fixed bottom-6 right-6 z-50">
			{!isOpen ? (
				<button
					onClick={toggleChat}
					className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl hover:bg-gray-800 transition-colors"
					aria-label="Open chat"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
					</svg>
				</button>
			) : (
				<div className="flex h-[520px] w-[380px] flex-col rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
					<div className="flex items-center justify-between bg-black text-white px-4 py-3">
						<div className="flex items-center gap-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
									<circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
									<circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
								</svg>
							</div>
							<div>
								<p className="text-sm font-semibold leading-none">AI Assistant</p>
								<p className="text-xs text-gray-400 mt-0.5">Cyber Store</p>
							</div>
						</div>
						<button
							onClick={toggleChat}
							className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
							aria-label="Close chat"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					</div>

					<div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
						{messages.map(msg => (
							<div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
								{msg.sender === "bot" && (
									<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white mr-2 mt-1">
										<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
											<circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
											<circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
										</svg>
									</div>
								)}
								<div
									className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
										msg.sender === "user"
											? "bg-black text-white rounded-2xl rounded-tr-sm"
											: "bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100"
									}`}
								>
									{msg.text}
								</div>
							</div>
						))}

						{isLoading && (
							<div className="flex justify-start">
								<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white mr-2 mt-1">
									<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
										<circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
										<circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
									</svg>
								</div>
								<TypingIndicator />
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Input */}
					<div className="px-4 py-3 bg-white border-t border-gray-200">
						<div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
							<input
								value={input}
								onChange={e => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Nhập tin nhắn..."
								className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
							/>
							<button
								onClick={handleSend}
								disabled={isLoading || !input.trim()}
								className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white disabled:opacity-40 hover:bg-gray-800 transition-colors"
								aria-label="Send message"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
									<line x1="22" y1="2" x2="11" y2="13" />
									<polygon points="22 2 15 22 11 13 2 9 22 2" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ChatbotComponent;
