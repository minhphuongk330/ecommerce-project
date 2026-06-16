import z from "zod";
const numericInput = z.union([z.string(), z.number()]).transform(val => Number(val));
export const productSchema = z.object({
	name: z.string().min(1, { message: "Vui lòng nhập tên sản phẩm" }),
	price: numericInput.pipe(z.number().min(0, { message: "Giá không hợp lệ" })),
	stock: numericInput.pipe(z.number().min(0, { message: "Số lượng không hợp lệ" })),
	categoryId: z
		.any()
		.refine(val => val !== "" && val !== null && val !== undefined, { message: "Vui lòng chọn danh mục" })
		.transform(val => Number(val)),
	mainImageUrl: z.string().min(1, { message: "Vui lòng chọn ảnh chính" }),
	description: z.string().optional(),
	color: z.string().optional(),
	specifications: z.record(z.string(), z.any()).optional(),
	extraImage1: z.string().optional().or(z.literal("")),
	extraImage2: z.string().optional().or(z.literal("")),
	extraImage3: z.string().optional().or(z.literal("")),
	extraImage4: z.string().optional().or(z.literal("")),
	isActive: z.boolean().optional(),
	isFeatured: z.boolean().optional().default(false),
});

export interface ProductFormValues {
	id?: any;
	name: string;
	price: number | string;
	stock: number | string;
	mainImageUrl: string;
	categoryId: number | string | undefined | null;
	description?: string;
	color?: string;
	specifications?: Record<string, any>;
	extraImage1?: string;
	extraImage2?: string;
	extraImage3?: string;
	extraImage4?: string;
	isActive?: boolean;
	isFeatured?: boolean;
}

export type ProductFormOutput = z.infer<typeof productSchema>;
