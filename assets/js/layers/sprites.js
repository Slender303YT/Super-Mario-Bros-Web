export function createSpriteLayer(entities, width = 64, height = 64) {
	const spriteBuffer = document.createElement("canvas");
	spriteBuffer.width = width;
	spriteBuffer.height = height;
	const spriteBufferContext = spriteBuffer.getContext("2d");

	return function drawSpriteLayer(ctx, camera) {
		entities.forEach(entity => {
			spriteBufferContext.clearRect(0, 0, width, height);

			if(entity.pos.x + 16 >= camera.pos.x && entity.pos.x <= camera.pos.x + 256) {
				entity.draw(spriteBufferContext);

				ctx.drawImage(
					spriteBuffer,
					Math.floor(entity.pos.x - camera.pos.x),
					Math.floor(entity.pos.y - camera.pos.y));
				}
		});
	}
}