import Entity from "../Entity.js";
import Trait from "../Trait.js";
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";
import Physics from "../traits/Physics.js";
import PendulumMove from "../traits/PendulumMove.js";
import {loadSpriteSheet} from "../loaders/sprite.js";
import Player from "../traits/Player.js";

export function loadP1UP() {
	return loadSpriteSheet("powerups")
	.then(createPU1PFactory);
}

class Behavior extends Trait {
	constructor() {
		super();
		this.can1UP = true;
	}

	collides(us, them) {
		if(them.traits.has(Player)) {
			us.traits.get(Killable).kill();
			this.queue(() => {
				if(this.can1UP === true) {
					them.sounds.add("1up");
					them.traits.get(Player).lives = them.traits.get(Player).lives + 1;
					them.traits.get(Player).score + 1000;
					this.can1UP = false;
				}
			});
		}
	}
}

function createPU1PFactory(sprite) {
	function drawP1UP(ctx) {
		sprite.draw("1up", ctx, 0, 0);
	}

	return function createPB() {
		const powerup = new Entity();
		powerup.size.set(16, 16);
		powerup.iap = true;

		powerup.addTrait(new Solid());
		powerup.addTrait(new Physics());
		powerup.addTrait(new PendulumMove());
		powerup.addTrait(new Behavior());
		powerup.addTrait(new Killable());

		powerup.draw = drawP1UP;
		powerup.traits.get(Killable).removeAfter = 0;
		powerup.traits.get(PendulumMove).speed = 30;

		return powerup;
	};
}