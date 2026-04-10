export interface CropArea {
	x: number;
	y: number;
	width: number;
	height: number;
}

export async function getCroppedBlob(imageSrc: string, cropArea: CropArea): Promise<Blob> {
	const image = await loadImage(imageSrc);
	const canvas = document.createElement("canvas");
	canvas.width = cropArea.width;
	canvas.height = cropArea.height;
	const ctx = canvas.getContext("2d")!;
	ctx.drawImage(image, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, cropArea.width, cropArea.height);
	return new Promise(resolve => canvas.toBlob(blob => resolve(blob!), "image/jpeg", 0.9));
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}
