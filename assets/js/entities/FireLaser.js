import Entity from "../Entity.js";
import Emitter from "../traits/Emitter.js";
import {loadSpriteSheet} from "../loaders/sprite.js";

export function loadFireLaser4() {
	return Promise.all([
		loadSpriteSheet("overworld"),
	])
	.then(([sprite]) => {
		return createFireBallFactory(sprite, 4);
	});
}

function createFireBallFactory(sprite, count) {
	function drawEntity(ctx) {
		sprite.draw("invisible-chance", ctx, 0, 0);
	}

	function createLasers(entity, gameCtx, level) {
		for(var i = 0; i < count; i++) {
			const fireBall = gameCtx.entityFactory.fireBall();
			fireBall.pos.set(entity.pos.x, entity.pos.y - (i * 8));
			level.entities.add(fireBall);
		}
	}

	return function createGoomba() {
		const entity = new Entity();
		entity.size.set(4, 4);
		entity.offset.set(2, 2);
		const emitter = new Emitter();
		emitter.canEmit = true;
		emitter.canInterval = false;
		emitter.emitters.push(createLasers);
		entity.addTrait(emitter);

		entity.draw = drawEntity;

		return entity;
	};
}