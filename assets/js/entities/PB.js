import Entity from "../Entity.js";
import Trait from "../Trait.js";
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";
import Physics from "../traits/Physics.js";
import PendulumMove from "../traits/PendulumMove.js";
import {loadSpriteSheet} from "../loaders/sprite.js";
import Player from "../traits/Player.js";

export function loadPB() {
	return loadSpriteSheet("powerups")
	.then(createPBFactory);
}

class Behavior extends Trait {
	constructor() {
		super();
		this.canPB = true;
	}

	collides(us, them) {
		if(them.traits.has(Player)) {
			this.queue(() => {
				if(this.canPB === true) {
					them.makePowerup(them, "big");
					them.traits.get(Player).score + 200;
					us.traits.get(Killable).kill();
					this.canPB = false;
				}
			});
		}
	}
}

function createPBFactory(sprite) {
	function drawPB(ctx) {
		sprite.draw("powerup1", ctx, 0, 0);
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

		powerup.draw = drawPB;
		powerup.traits.get(Killable).removeAfter = 0;
		powerup.traits.get(PendulumMove).speed = 30;

		return powerup;
	};
}