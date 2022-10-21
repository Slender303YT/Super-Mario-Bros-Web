import {findPlayers} from "../player.js";
import Player from "../traits/Player.js";

function getPlayer(entities) {
	for(const entity of findPlayers(entities)) {
		return entity;
	}
}

export function createPlayerProgressLayer(font, level) {
	const size = font.size;
	const spriteBuffer = document.createElement("canvas");
	spriteBuffer.width = 32;
	spriteBuffer.height = 64;
	const spriteBufferContext = spriteBuffer.getContext("2d");
	return function drawPlayerProgressLayer(ctx) {
		const entity = getPlayer(level.entities);
		const player = entity.traits.get(Player);
		if(pol === false) {
			font.print(`WORLD ${level.name}`, ctx, size * 12, size * 12);
		} else if(pol === true) {
			font.print(`LEVEL ${levelName}`, ctx, size * 12, size * 12);
		}
		font.print("x" + player.lives.toString().padStart(3, " "), ctx, size * 16, size * 16);
		spriteBufferContext.clearRect(0, 0, spriteBuffer.width, spriteBuffer.height);
		entity.draw(spriteBufferContext);
		ctx.drawImage(spriteBuffer, size * 12, size * 15);
	};
}