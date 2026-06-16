import { z } from "zod";

export const addressSchema = z.object({
	receiverName: z.string().min(1, { message: "Vui lòng nhập tên người nhận" }).trim(),
	address: z.string().min(1, { message: "Vui lòng nhập địa chỉ chi tiết" }).trim(),
	phone: z
		.string()
		.min(1, { message: "Vui lòng nhập số điện thoại" })
		.regex(/^0\d{9}$/, { message: "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số" }),
	isDefault: z.boolean(),
	customerId: z.number().optional(),
});
