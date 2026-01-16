import axiosClient from "./axiosClient";
import { Category } from "~/types/category";

export const categoryService = {
	getCategories: async (): Promise<Category[]> => {
		return await axiosClient.get("/categories");
	},
};
