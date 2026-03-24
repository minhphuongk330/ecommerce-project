import axiosClient from "~/services/axiosClient";

export const sendChatMessage = async (
	message: string,
	history: any[],
	mode: "client" | "admin",
	signal?: AbortSignal,
) => {
	const response = await axiosClient.post("/chatbot", { message, history, mode }, { signal });
	return response as any;
};
