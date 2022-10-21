import Entity from "../Entity.js";
import {loadSpriteSheet} from "../loaders/sprite.js";

export function loadST() {
	return loadSpriteSheet("extra")
	.then(createSTFactory);
}

function createSTFactory(sprite) {
	function drawPB(ctx) {
		sprite.draw("st", ctx, 0, 0);
	}

	return function createPB() {
		const entity = new Entity();

		entity.draw = drawPB;

		return entity;
	};
}