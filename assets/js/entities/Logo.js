import Entity from "../Entity.js";
import {loadSpriteSheet} from "../loaders/sprite.js";

export function loadLogo() {
	return loadSpriteSheet("logo")
	.then(createLogoFactory);
}
function createLogoFactory(sprite) {
	function drawLogo(ctx) {
		sprite.draw(`logo-${this.type}`, ctx, 0, 0);
	}

	return function createLogo() {
		const entity = new Entity();
		entity.size.set(352, 176);
		entity.type = 1;
		entity.draw = drawLogo;
		return entity;
	};
}