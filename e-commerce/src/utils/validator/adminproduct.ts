import z from "zod";
const numericInput = z.union([z.string(), z.number()]).transform(val => Number(val));
export const productSchema = z.object({
	name: z.string().min(1, { message: "Product name is required" }),
	price: numericInput.pipe(z.number().min(0, { message: "Invalid price" })),
	stock: numericInput.pipe(z.number().min(0, { message: "Invalid quantity" })),
	categoryId: z
		.any()
		.refine(val => val !== "" && val !== null && val !== undefined, { message: "Please select a category" })
		.transform(val => Number(val)),
	mainImageUrl: z.string().min(1, { message: "Main image is required" }),
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
