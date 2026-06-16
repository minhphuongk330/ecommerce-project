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

export const parseSafeDate = (dateVal: string | Date | undefined | null): Date => {
	if (!dateVal) return new Date();
	if (typeof dateVal === "string") {
		if (/^\d+$/.test(dateVal)) {
			return new Date(Number(dateVal));
		}
		if (!dateVal.endsWith("Z") && !dateVal.includes("+") && !dateVal.includes("GMT")) {
			return new Date(dateVal.includes("T") ? dateVal + "Z" : dateVal.replace(" ", "T") + "Z");
		}
	}
	return new Date(dateVal);
};

export const formatDate = (dateString: string | Date | undefined | null): string => {
	if (!dateString) return "";
	try {
		return parseSafeDate(dateString).toLocaleDateString("vi-VN");
	} catch {
		return "";
	}
};
