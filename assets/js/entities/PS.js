import Entity from "../Entity.js";
import Trait from "../Trait.js";
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";
import Physics from "../traits/Physics.js";
import Jump from "../traits/Jump.js";
import PendulumMove from "../traits/PendulumMove.js";
import {loadSpriteSheet} from "../loaders/sprite.js";
import Player from "../traits/Player.js";
import {Sides} from "../Entity.js";
import LevelTimer from "../traits/LevelTimer.js";

export function loadPS() {
	return loadSpriteSheet("powerups")
	.then(createPSFactory);
}

export class StarTrait extends Trait {
	constructor() {
		super();
		this.touched = false;
	}

	obstruct(entity, side, match) {
		if(side == Sides.BOTTOM) {
			entity.bounds.bottom = match.y1;
            entity.vel.y = 0;
            entity.traits.get(Jump).jumpCustom(1);
		}
	}

	collides(us, them) {
		if(them.traits.has(Player)) {
			this.queue(() => {
				this.touched = true;
				them.starTime = true;
				them.traits.get(Player).score + 2000;
				us.traits.get(Killable).kill();
			});
		}
	}

	update(_, __, level) {
		if(this.touched === true) {
			level.events.emit(LevelTimer.EVENT_STAR_MOMENT);
		}
	}
}

function createPSFactory(sprite) {
	const starAnim = sprite.animations.get("star");

	function routeFrame(entity) {
		return starAnim(entity.lifeTime);
	}

	function drawPS(ctx) {
		sprite.draw(routeFrame(this), ctx, 0, 0);
	}

	return function createPB() {
		const powerup = new Entity();
		powerup.size.set(16, 16);
		powerup.iap = true;

		powerup.addTrait(new Solid());
		powerup.addTrait(new Physics());
		powerup.addTrait(new PendulumMove());
		powerup.addTrait(new StarTrait());
		powerup.addTrait(new Killable());
		powerup.addTrait(new Jump());

		powerup.draw = drawPS;
		powerup.traits.get(Killable).removeAfter = 0;
		powerup.traits.get(PendulumMove).speed = 60;

		return powerup;
	};
}