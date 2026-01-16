interface NamedEntity {
	fullName: string | null;
}

export const getDisplayName = (person: NamedEntity | null | undefined): string => {
	if (!person) return "Unknown User";
	return person.fullName || "Unknown User";
};

export const formatPrice = (value: number | string | undefined | null): string => {
	if (value === undefined || value === null) return "$0.00";
	const num = Number(value);
	if (isNaN(num)) return "$0.00";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	}).format(num);
};

export const formatDate = (dateString: string | Date | undefined | null): string => {
	if (!dateString) return "";
	try {
		return new Date(dateString).toLocaleDateString("vi-VN");
	} catch (e) {
		return "";
	}
};
