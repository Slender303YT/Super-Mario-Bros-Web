import Entity, {Sides} from "../Entity.js";
import Trait from "../Trait.js";
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";
import Physics from "../traits/Physics.js";
import PendulumMove from "../traits/PendulumMove.js";
import Stomper from "../traits/Stomper.js";
import {loadSpriteSheet} from "../loaders/sprite.js";

const STATE_PANIC = Symbol("panic");

export function loadGoomba() {
	return loadSpriteSheet("goomba")
	.then(createGoombaFactory);
}

export function loadUGoomba() {
	return loadSpriteSheet("uGoomba")
	.then(createGoombaFactory);
}

class Behavior extends Trait {
	collides(us, them) {
		if(us.traits.get(Killable).dead) {
			return;
		}

		if(them.traits.get(Stomper)) {
			if(them.vel.y > us.vel.y) {
				us.traits.get(Killable).kill();
				us.traits.get(PendulumMove).speed = 0;
			} else {
				if(them.starTime === false) {
					if(them.powerup === "big") {
						them.makePowerup(them, "tiny");
					} else {
						them.traits.get(Killable).kill();
					}
				} else {
					us.traits.get(Killable).removeAfter = 0;
					us.traits.get(Killable).kill();
				}
			}
		}
	}
}

function createGoombaFactory(sprite) {
	const walkAnim = sprite.animations.get("walk");

	function routeAnim(goomba) {
		if(goomba.traits.get(Killable).dead) {
			return "flat";
		}

		return walkAnim(goomba.lifeTime);
	}

	function drawGoomba(ctx) {
		sprite.draw(routeAnim(this), ctx, 0, 0);
	}

	return function createGoomba() {
		const goomba = new Entity();
		goomba.size.set(10, 12);
		goomba.offset.x = 3;
		goomba.offset.y = 4;

		goomba.addTrait(new Solid());
		goomba.addTrait(new Physics());
		goomba.addTrait(new PendulumMove());
		goomba.addTrait(new Behavior());
		goomba.addTrait(new Killable());

		goomba.draw = drawGoomba;

		return goomba;
	};
}