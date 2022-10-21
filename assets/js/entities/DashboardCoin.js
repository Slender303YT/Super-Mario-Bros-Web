import Entity from "../Entity.js";
import {loadSpriteSheet} from "../loaders/sprite.js";

export function loadDashboardCoin() {
	return loadSpriteSheet("dashCoin")
	.then(createDashboadCoinFactory);
}

function createDashboadCoinFactory(sprite) {
	const coinAnim = sprite.animations.get("coinOverworld");
	const uCoinAnim = sprite.animations.get("coinUnderworld");
	const iCoinAnim = sprite.animations.get("coinIntocastle");

	function routeAnim(entity) {
		if(entity.type === "overworld") {
			return coinAnim(entity.lifeTime);
		} else if(entity.type === "underworld") {
			return uCoinAnim(entity.lifeTime);
		} else if(entity.type === "intocastle") {
			return iCoinAnim(entity.lifeTime);
		}
	}

	function drawEntity(ctx) {
		sprite.draw(routeAnim(this), ctx, 0, 0);
	}

	return function createGoomba() {
		const entity = new Entity();
		entity.type = "underworld";
		entity.pos.set(-32, -32);
		entity.draw = drawEntity;

		return entity;
	};
}