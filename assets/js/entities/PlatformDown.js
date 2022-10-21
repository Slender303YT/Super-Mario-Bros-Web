import Entity from "../Entity.js";
import Trait from "../Trait.js";
import PendulumMove from "../traits/PendulumMove.js";
import {loadSpriteSheet} from "../loaders/sprite.js";
import Player from "../traits/Player.js";

export function loadPD() {
	return loadSpriteSheet("platform")
	.then(createPDFactory);
}

class Behavior extends Trait {
	collides(us, them) {
		if(them.traits.has(Player)) {
			if(them.pos.y < us.pos.y) {
				if(them.powerup === "none") {
					them.pos.y = us.pos.y - 20;
				} else {
					them.pos.y = us.pos.y - 36;
				}
			}
		}
	}

	update(entity, {deltaTime}) {
		entity.pos.y += 40 * deltaTime;
		if(entity.pos.y >= 256) {
			entity.pos.y = -16;
		}
	}
}

function createPDFactory(sprite) {
	function drawPD(ctx) {
		sprite.draw("platform", ctx, 0, 0);
	}

	return function createPB() {
		const platform = new Entity();
		platform.size.set(64, 8);
		platform.addTrait(new Behavior());
		platform.draw = drawPD;
		return platform;
	};
}