import Entity from "../Entity.js";
import Trait from "../Trait.js";
import Killable from "../traits/Killable.js";
import Player from "../traits/Player.js";
import {loadSpriteSheet} from "../loaders/sprite.js";

export function loadFireBall() {
	return loadSpriteSheet("particles")
	.then(createFireBallFactory);
}

class Behavior extends Trait {
	update(entity, {deltaTime}) {
		entity.pos.x += (Math.cos(entity.lifeTime) * 20) * deltaTime;
		entity.pos.y += (Math.sin(entity.lifeTime) * 20) * deltaTime;
	}

	collides(us, them) {
		if(them.traits.get(Player)) {
			them.traits.get(Killable).kill();
		}
	}
}

function createFireBallFactory(sprite) {
	const spinningAnim = sprite.animations.get("spinningFireBall");

	function routeAnim(entity) {
		return spinningAnim(entity.lifeTime);
	}

	function drawEntity(ctx) {
		sprite.draw(routeAnim(this), ctx, 0, 0);
	}

	return function createGoomba() {
		const entity = new Entity();
		entity.size.set(4, 4);
		entity.offset.set(2, 2);

		entity.addTrait(new Behavior());

		entity.draw = drawEntity;

		return entity;
	};
}