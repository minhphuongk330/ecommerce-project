import { z } from "zod";

export const addressSchema = z.object({
	receiverName: z.string().min(1, { message: "Please enter recipient name" }).trim(),
	address: z.string().min(1, { message: "Please enter detailed address" }).trim(),
	phone: z
		.string()
		.min(1, { message: "Please enter phone number" })
		.regex(/^0\d{9}$/, { message: "Phone number must start with 0 and contain exactly 10 digits" }),
	isDefault: z.boolean(),
	customerId: z.number().optional(),
});
