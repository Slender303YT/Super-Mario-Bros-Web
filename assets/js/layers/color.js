export function createColorLayer(color) {
	return function drawDashboard(ctx) {
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}
}