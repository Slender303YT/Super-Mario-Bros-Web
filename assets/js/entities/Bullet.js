import Entity, {Sides} from "../Entity.js";
import Trait from "../Trait.js";
import Killable from "../traits/Killable.js";
import Gravity from "../traits/Gravity.js";
import Velocity from "../traits/Velocity.js";
import {loadSpriteSheet} from "../loaders/sprite.js";
import Stomper from "../traits/Stomper.js";

const STATE_PANIC = Symbol("panic");

export function loadBullet() {
	return loadSpriteSheet("bullet")
	.then(createBulletFactory);
}

class Behavior extends Trait {
	constructor() {
		super();
		this.gravity = new Gravity();
	}

	collides(us, them) {
		if(us.traits.get(Killable).dead) {
			return;
		}

		if(them.traits.has(Stomper)) {
			if(them.vel.y > us.vel.y) {
				us.traits.get(Killable).kill();
				us.vel.set(100, -200);
			} else {
				them.traits.get(Killable).kill();
			}
		}
	}

	update(entity, gameCtx, level) {
		if(entity.traits.get(Killable).dead) {
			this.gravity.update(entity, gameCtx, level);
		}
	}
}

function createBulletFactory(sprite) {
	function drawBullet(ctx) {
		sprite.draw("bullet", ctx, 0, 0, this.vel.x < 0);
	}

	return function createBullet() {
		const bullet = new Entity();
		bullet.size.set(16, 14);

		bullet.addTrait(new Velocity());
		bullet.addTrait(new Behavior());
		bullet.addTrait(new Killable());

		bullet.draw = drawBullet;

		return bullet;
	};
}