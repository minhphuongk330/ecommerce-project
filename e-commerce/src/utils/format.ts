interface NamedEntity {
	fullName: string | null;
}

export const getDisplayName = (person: NamedEntity | null | undefined): string => {
	if (!person) return "Unknown User";
	return person.fullName || "Unknown User";
};

export const formatPrice = (value: number | string | undefined | null): string => {
	if (value === undefined || value === null) return "0₫";
	const num = Number(value);
	if (isNaN(num)) return "0₫";
	return num.toLocaleString("vi-VN") + "₫";
};

export const formatDate = (dateString: string | Date | undefined | null): string => {
	if (!dateString) return "";
	try {
		return new Date(dateString).toLocaleDateString("vi-VN");
	} catch {
		return "";
	}
};
