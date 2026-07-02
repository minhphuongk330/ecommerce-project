import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const exportInvoicePdf = async (elementId: string, filename: string): Promise<void> => {
	const element = document.getElementById(elementId);
	if (!element) {
		console.error(`Element with id ${elementId} not found`);
		return;
	}

	try {
		const canvas = await html2canvas(element, {
			scale: 2,
			useCORS: true,
			logging: false,
			allowTaint: true,
			scrollX: 0,
			scrollY: 0,
			onclone: (clonedDoc) => {
				const clonedElement = clonedDoc.getElementById(elementId);
				if (clonedElement) {
					clonedDoc.body.style.overflow = "visible";
					clonedDoc.body.style.height = "auto";
					clonedDoc.documentElement.style.overflow = "visible";
					clonedDoc.documentElement.style.height = "auto";
					let current: HTMLElement | null = clonedElement;
					while (current && current !== clonedDoc.body) {
						current.style.overflow = "visible";
						current.style.height = "auto";
						current.style.maxHeight = "none";
						current = current.parentElement;
					}
					const parent = clonedElement.parentElement;
					if (parent) {
						parent.style.position = "relative";
						parent.style.left = "0";
						parent.style.top = "0";
						parent.style.width = "auto";
						parent.style.height = "auto";
					}
				}
			},
		});

		const imgData = canvas.toDataURL("image/png");
		const pdf = new jsPDF("p", "mm", "a4");
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = pdf.internal.pageSize.getHeight();
		const imgWidth = pdfWidth;
		const imgHeight = (canvas.height * pdfWidth) / canvas.width;
		let heightLeft = imgHeight;
		let position = 0;
		pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
		heightLeft -= pdfHeight;

		while (heightLeft >= 0) {
			position = heightLeft - imgHeight;
			pdf.addPage();
			pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
			heightLeft -= pdfHeight;
		}

		pdf.save(`${filename}.pdf`);
	} catch (error) {
		console.error("Error generating PDF:", error);
	}
};
