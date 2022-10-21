export function createTextLayer(font, text) {
	const size = font.size;
	return function drawText(ctx) {
		const textW = text.length;
		const screenW = Math.floor(ctx.canvas.width / size);
		const screenH = Math.floor(ctx.canvas.height / size);
		const x = screenW / 2 - textW / 2;
		const y = screenH / 2;
		font.print(text, ctx, x * size, y * size);
	}
}