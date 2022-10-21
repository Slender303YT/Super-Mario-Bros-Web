import Entity from "../Entity.js";
import Trait from "../Trait.js";
import PendulumMove from "../traits/PendulumMove.js";
import {loadSpriteSheet} from "../loaders/sprite.js";
import Player from "../traits/Player.js";

export function loadPU() {
	return loadSpriteSheet("platform")
	.then(createPUFactory);
}

class Behavior extends Trait {
	collides(us, them) {
		if(them.traits.has(Player)) {
			if(them.pos.y < us.pos.y) {
				them.pos.y = us.pos.y - 16;
			}
		}
	}

	update(entity, {deltaTime}) {
		entity.pos.y -= 40 * deltaTime;
		if(entity.pos.y <= -16) {
			entity.pos.y = 256;
		}
	}
}

function createPUFactory(sprite) {
	function drawPU(ctx) {
		sprite.draw("platform", ctx, 0, 0);
	}

	return function createPB() {
		const powerup = new Entity();
		powerup.size.set(64, 8);
		powerup.addTrait(new Behavior());
		powerup.draw = drawPU;
		return powerup;
	};
}