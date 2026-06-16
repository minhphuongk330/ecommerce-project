import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "~/components/atoms/Button";
import { useNotification } from "~/contexts/Notification";
import { useAuthStore } from "~/stores/useAuth";
import axiosClient from "~/services/axiosClient";

const contactSchema = z.object({
	subject: z.enum(["order", "product", "warranty", "tech", "feedback"], {
		message: "Vui lòng chọn một chủ đề cần hỗ trợ",
	}),
	content: z.string().min(10, "Nội dung phản hồi phải chứa tối thiểu 10 ký tự"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const SUBJECT_OPTIONS = [
	{ value: "order", label: "Vấn đề về đơn hàng / Vận chuyển" },
	{ value: "product", label: "Tư vấn thông tin sản phẩm" },
	{ value: "warranty", label: "Chính sách bảo hành / Đổi trả" },
	{ value: "tech", label: "Hỗ trợ kỹ thuật" },
	{ value: "feedback", label: "Góp ý / Khiếu nại" },
];

interface ContactFormProps {
	onSuccess: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
	const { showNotification } = useNotification();
	const { isAuthenticated, accessToken, user } = useAuthStore();
	const searchParams = useSearchParams();
	const subjectParam = searchParams.get("subject");

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<ContactFormValues>({
		resolver: zodResolver(contactSchema),
		defaultValues: {
			subject: "" as any,
			content: "",
		},
	});

	useEffect(() => {
		if (subjectParam && SUBJECT_OPTIONS.some(opt => opt.value === subjectParam)) {
			setValue("subject", subjectParam as any);
		}
	}, [subjectParam, setValue]);

	const onSubmit = async (data: ContactFormValues) => {
		try {
			const selectedOption = SUBJECT_OPTIONS.find(opt => opt.value === data.subject);
			const subjectText = selectedOption ? selectedOption.label : data.subject;
			const payload = {
				subject: subjectText,
				content: data.content.trim(),
			};
			await axiosClient.post("/contacts", payload, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			showNotification("Cảm ơn bạn đã liên hệ! Chúng tôi đã nhận được phản hồi và sẽ xử lý sớm nhất.", "success");
			reset();
			onSuccess();
		} catch (err: any) {
			const errorMsg = err?.response?.data?.message || "Gửi phản hồi thất bại, vui lòng thử lại.";
			showNotification(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg, "error");
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
			{!isAuthenticated ? (
				<div className="py-8 text-center space-y-5">
					<div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 text-3xl">
						🔒
					</div>
					<div className="space-y-2 max-w-sm mx-auto">
						<h3 className="text-lg font-bold text-gray-800">Yêu cầu đăng nhập</h3>
						<p className="text-sm text-gray-500 leading-relaxed">
							Vui lòng đăng nhập tài khoản của bạn để gửi phản hồi hoặc yêu cầu hỗ trợ kỹ thuật trực tiếp tới đội ngũ quản trị viên.
						</p>
					</div>
					<div className="pt-2">
						<Link href="/auth/login">
							<Button theme="dark" className="!px-8 !py-2.5 !rounded-xl !bg-black !text-white !font-semibold hover:opacity-90 transition-opacity">
								Đăng nhập ngay
							</Button>
						</Link>
					</div>
				</div>
			) : (
				<div className="space-y-6">
					<div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
						<div className="text-xl">👋</div>
						<div className="text-sm text-blue-800">
							Xin chào <span className="font-semibold">{user?.fullName || "Khách hàng"}</span>, hệ thống sẽ tự động gửi yêu cầu này dưới tài khoản của bạn.
						</div>
					</div>

					<form
						onSubmit={handleSubmit(onSubmit, (errors) => {
							const firstError = Object.values(errors)[0] as any;
							if (firstError?.message) {
								showNotification(firstError.message, "error");
							}
						})}
						className="space-y-5"
					>
						<div>
							<label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
								Bạn cần hỗ trợ về chủ đề gì? <span className="text-red-500">*</span>
							</label>
							<Controller
								name="subject"
								control={control}
								render={({ field }) => (
									<select
										id="subject"
										{...field}
										className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow text-sm ${
											errors.subject ? "border-red-400" : "border-gray-200"
										}`}
									>
										<option value="" disabled>-- Chọn một chủ đề liên hệ --</option>
										{SUBJECT_OPTIONS.map(opt => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
											</option>
										))}
									</select>
								)}
							/>
						</div>
						<div>
							<label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
								Nội dung phản hồi chi tiết <span className="text-red-500">*</span>
							</label>
							<Controller
								name="content"
								control={control}
								render={({ field }) => (
									<textarea
										id="content"
										rows={6}
										placeholder="Nhập chi tiết thắc mắc, phản hồi hoặc mô tả sự cố kỹ thuật của bạn (tối thiểu 10 ký tự)..."
										{...field}
										className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-shadow text-sm ${
											errors.content ? "border-red-400" : "border-gray-200"
										}`}
									/>
								)}
							/>
						</div>

						<div className="pt-2">
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full md:w-auto px-8 py-3.5 bg-black hover:bg-black/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
							>
								{isSubmitting ? (
									<>
										<svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
										</svg>
										Đang gửi tin nhắn...
									</>
								) : (
									"Gửi tin nhắn liên hệ"
								)}
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
