"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useAuthStore } from "~/stores/useAuth";
import axiosClient from "~/services/axiosClient";
import ContactForm from "~/components/Contact/ContactForm";
import ContactSidebar from "~/components/Contact/ContactSidebar";
import SupportHistory from "~/components/Contact/SupportHistory";

function ContactContainer() {
	const { isAuthenticated, accessToken } = useAuthStore();
	const [history, setHistory] = useState<any[]>([]);
	const [historyLoading, setHistoryLoading] = useState(false);

	const fetchHistory = useCallback(async () => {
		if (!isAuthenticated) return;
		try {
			setHistoryLoading(true);
			const res = await axiosClient.get<any, any>("/contacts/my-history", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			setHistory(res || []);
		} catch (err) {
			console.error("Failed to fetch support history:", err);
		} finally {
			setHistoryLoading(false);
		}
	}, [isAuthenticated, accessToken]);

	useEffect(() => {
		fetchHistory();
	}, [fetchHistory]);

	return (
		<div className="w-full bg-white min-h-screen font-sans">
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8 md:py-[40px]">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl md:text-4xl font-bold text-black mb-6 md:mb-8">Liên hệ hỗ trợ</h1>

					<div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
						<ContactForm onSuccess={fetchHistory} />
						<ContactSidebar />
					</div>

					{isAuthenticated && (
						<SupportHistory history={history} historyLoading={historyLoading} />
					)}
				</div>
			</div>
		</div>
	);
}

export default function ContactPage() {
	return (
		<Suspense fallback={
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
			</div>
		}>
			<ContactContainer />
		</Suspense>
	);
}
