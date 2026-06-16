import axiosClient from "~/services/axiosClient";

export const sendChatMessage = async (
	message: string,
	history: any[],
	mode: "client" | "admin",
	currentProductId?: string | null,
	signal?: AbortSignal,
) => {
	const response = await axiosClient.post("/chatbot", { message, history, mode, currentProductId }, { signal });
	return response as any;
};

export const saveChatHistory = async (history: any[]) => {
	const response = await axiosClient.post("/chatbot/save-history", { history });
	return response as any;
};

export const getChatHistory = async (): Promise<{ sender: "user" | "bot"; text: string }[]> => {
	const response = await axiosClient.get("/chatbot/history");
	return response as any;
};

