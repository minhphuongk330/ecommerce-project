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
	shortDescription: z.string().optional(),
	colors: z.array(z.any()).optional().default([]),
	extraImage1: z.string().optional().or(z.literal("")),
	extraImage2: z.string().optional().or(z.literal("")),
	extraImage3: z.string().optional().or(z.literal("")),
	extraImage4: z.string().optional().or(z.literal("")),
	isActive: z.boolean().optional(),
	attributes: z.record(z.string(), z.any()).optional(),
	variants: z
		.array(
			z.object({
				sku: z.string().optional(),
				price: numericInput.pipe(z.number().min(0, { message: "Price must be positive" })),
				stock: numericInput.pipe(z.number().min(0, { message: "Stock must be positive" })),
				options: z.any().optional(),
			}),
		)
		.optional()
		.default([]),
});

export interface ProductFormValues {
	id?: any;
	name: string;
	price: number | string;
	stock: number | string;
	mainImageUrl: string;
	categoryId: number | string | undefined | null;
	description?: string;
	shortDescription?: string;
	colors?: {
		id?: any;
		colorName: string;
		colorHex?: string;
	}[];
	extraImage1?: string;
	extraImage2?: string;
	extraImage3?: string;
	extraImage4?: string;
	isActive?: boolean;
	attributes?: Record<string, any>;
	variants?: {
		sku?: string;
		price: number | string;
		stock: number | string;
		options?: any;
	}[];
}

export type ProductFormOutput = z.infer<typeof productSchema>;
