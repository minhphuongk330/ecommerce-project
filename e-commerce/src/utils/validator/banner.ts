import { z } from "zod";

export const bannerSchema = z.object({
	imageUrl: z.string().min(1, "Vui lòng tải lên hình ảnh banner"),
	displayType: z.enum(["1", "2", "3", "4", "5"]),
	isActive: z.boolean(),
	productId: z.string().optional().nullable(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
