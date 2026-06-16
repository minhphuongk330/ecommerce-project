import { z } from "zod";

export const brandSchema = z.object({
	name: z.string().min(1, "Vui lòng nhập tên thương hiệu"),
	logoUrl: z.string().optional(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
