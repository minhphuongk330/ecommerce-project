import axiosClient from "~/services/axiosClient";

export const sendChatMessage = async (message: string, history: any[], mode: "client" | "admin") => {
	const response = await axiosClient.post("/chatbot", { message, history, mode });
	return response as any;
};
