import axiosClient from "./axiosClient";

export interface AttributeDef {
	id: number;
	name: string;
	categoryId: number;
	value: string;
}

export const attributeService = {
	getAllAttributes(): Promise<AttributeDef[]> {
		return axiosClient.get("/attribute-defs");
	},
};
