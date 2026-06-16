import React from "react";
import CollapsibleText from "./CollapsibleText";

interface SupportHistoryProps {
	history: any[];
	historyLoading: boolean;
}

export default function SupportHistory({ history, historyLoading }: SupportHistoryProps) {
	return (
		<div className="mt-12 border-t border-gray-100 pt-10">
			<div className="flex items-center gap-2 mb-6">
				<span className="text-xl">📜</span>
				<h2 className="text-xl md:text-2xl font-bold text-black">Lịch sử yêu cầu hỗ trợ</h2>
			</div>

			{historyLoading ? (
				<div className="space-y-4">
					{[1, 2].map((n) => (
						<div key={n} className="bg-gray-50/50 border border-gray-100 p-6 rounded-2xl animate-pulse space-y-3">
							<div className="flex justify-between items-center">
								<div className="h-4 w-28 bg-gray-200 rounded-full" />
								<div className="h-4 w-20 bg-gray-200 rounded-full" />
							</div>
							<div className="h-4 w-3/4 bg-gray-200 rounded" />
							<div className="h-3 w-1/3 bg-gray-200 rounded" />
						</div>
					))}
				</div>
			) : history.length === 0 ? (
				<div className="bg-gray-50/50 border border-gray-100 p-8 rounded-2xl text-center">
					<p className="text-gray-500 font-medium">Bạn chưa gửi yêu cầu hỗ trợ nào</p>
					<p className="text-xs text-gray-400 mt-1">Các liên hệ bạn gửi sẽ được lưu lại lịch sử tại đây để theo dõi phản hồi</p>
				</div>
			) : (
				<div className="space-y-6">
					{history.map((item) => {
						const sentDate = new Date(item.createdAt).toLocaleDateString("vi-VN", {
							year: "numeric",
							month: "long",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
						});

						return (
							<div key={item.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 space-y-4 hover:border-gray-200 transition-colors">
								<div className="flex flex-wrap items-center justify-between gap-2">
									<span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-black text-white">
										{item.subject}
									</span>
									<div className="flex items-center gap-3">
										<span className="text-xs text-gray-400 font-medium">{sentDate}</span>
										{item.status === "PENDING" ? (
											<span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
												Chờ xử lý
											</span>
										) : (
											<span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
												Đã giải quyết
											</span>
										)}
									</div>
								</div>

								<div className="bg-gray-50/60 p-4 rounded-xl border border-gray-50">
									<CollapsibleText text={item.content} className="text-gray-700" />
								</div>

								{item.status === "RESOLVED" && item.adminReply && (
									<div className="bg-blue-50/40 border border-blue-100 p-4 rounded-xl space-y-1.5 ml-4">
										<div className="flex items-center gap-1.5">
											<span className="text-xs">⚡</span>
											<span className="text-xs font-bold text-blue-800">Cyber Store phản hồi:</span>
										</div>
										<CollapsibleText text={item.adminReply} className="text-blue-900 font-medium pl-5" />
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
