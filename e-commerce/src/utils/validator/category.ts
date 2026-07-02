import { z } from "zod";

export const categorySchema = z.object({
	name: z.string().trim().min(1, "Vui lòng nhập tên danh mục"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
