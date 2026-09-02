export async function copySvgAsPng(svgElement: SVGSVGElement): Promise<void> {
	const svgData = new XMLSerializer().serializeToString(svgElement);
	const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
	const url = URL.createObjectURL(svgBlob);

	const img = new Image();
	await new Promise<void>((resolve, reject) => {
		img.onload = () => resolve();
		img.onerror = reject;
		img.src = url;
	});

	const scale = 2; // melhora a nitidez da imagem copiada
	const canvas = document.createElement('canvas');
	canvas.width = img.width * scale;
	canvas.height = img.height * scale;

	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Não foi possível criar o contexto do canvas');

	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.scale(scale, scale);
	ctx.drawImage(img, 0, 0);
	URL.revokeObjectURL(url);

	const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
	if (!blob) throw new Error('Não foi possível gerar a imagem');

	await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}