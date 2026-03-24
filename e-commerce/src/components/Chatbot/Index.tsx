"use client";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { sendChatMessage } from "~/services/chatbot";

interface ChatMessage {
	id: number;
	sender: "user" | "bot";
	text: string;
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
						? {
								id: Date.now(),
								sender: "bot" as const,
								text: "Xin chào Quản trị viên. Tôi có thể báo cáo số liệu gì cho bạn hôm nay?",
							}
						: {
								id: Date.now(),
								sender: "bot" as const,
								text: "Xin chào! Mình là trợ lý AI của Cyber Store. Mình có thể giúp gì cho bạn?",
							};
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
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	const handleSend = useCallback(async () => {
		if (!input.trim() || isLoading) return;
		const userMsg = input.trim();
		const currentHistory = [...messages];
		setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: userMsg }]);
		setInput("");
		setIsLoading(true);
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		abortControllerRef.current = new AbortController();

		try {
			const res = await sendChatMessage(userMsg, currentHistory, mode, abortControllerRef.current.signal);
			if (res?.reply) {
				setMessages(prev => [...prev, { id: Date.now(), sender: "bot", text: res.reply }]);
			}
		} catch (error: any) {
			if (error.name !== "AbortError") {
				setMessages(prev => [
					...prev,
					{
						id: Date.now(),
						sender: "bot",
						text: "Xin lỗi, hiện tại tôi không thể kết nối tới server.",
					},
				]);
				console.error("Chat error:", error);
			}
		} finally {
			setIsLoading(false);
		}
	}, [input, isLoading, messages, mode]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend],
	);

	const toggleChat = useCallback(() => {
		setIsOpen(prev => !prev);
	}, []);

	return (
		<div className="fixed bottom-6 right-6 z-50">
			{!isOpen ? (
				<button
					onClick={toggleChat}
					className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg"
				>
					💬
				</button>
			) : (
				<div className="flex h-[450px] w-[350px] flex-col rounded-2xl bg-white shadow-2xl border">
					<div className="flex justify-between bg-black text-white p-3">
						<span>AI Assistant</span>
						<button onClick={toggleChat}>✖</button>
					</div>

					<div className="flex-1 overflow-y-auto p-4 space-y-2">
						{messages.map(msg => (
							<div key={msg.id} className={msg.sender === "user" ? "text-right" : "text-left"}>
								<span>{msg.text}</span>
							</div>
						))}

						{isLoading && <div>Đang trả lời...</div>}
						<div ref={messagesEndRef} />
					</div>

					<div className="p-3 flex gap-2 border-t">
						<input
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							className="flex-1 border px-3 py-2 rounded"
						/>
						<button onClick={handleSend} disabled={isLoading}>
							Gửi
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default ChatbotComponent;
