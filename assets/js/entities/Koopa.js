import Entity, {Sides} from "../Entity.js";
import Trait from "../Trait.js";
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";
import Physics from "../traits/Physics.js";
import PendulumMove from "../traits/PendulumMove.js";
import Stomper from "../traits/Stomper.js";
import {loadSpriteSheet} from "../loaders/sprite.js";

export function loadKoopa() {
	return loadSpriteSheet("koopa")
	.then(createKoopaFactory);
}

export function loadRKoopa() {
	return loadSpriteSheet("rKoopa")
	.then(createKoopaFactory);
}

export function loadUKoopa() {
	return loadSpriteSheet("uKoopa")
	.then(createKoopaFactory);
}

const STATE_WALKING = Symbol("walking");
const STATE_HIDING = Symbol("hiding");
const STATE_PANIC = Symbol("panic");

class Behavior extends Trait {
	constructor() {
		super();
		this.hideTime = 0;
		this.hideDuration = 5;
		this.walkSpeed = null;
		this.panicSpeed = 100;
		this.state = STATE_WALKING;
	}

	collides(us, them) {
		if(us.traits.get(Killable).dead) {
			return;
		}

		if(them.traits.has(Stomper)) {
			if(them.vel.y > us.vel.y) {
				this.handleStomp(us, them);
			} else {
				this.handleNudge(us, them);
			}
		}
	}

	handleNudge(us, them) {
		if(this.state === STATE_WALKING) {
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
		} else if(this.state === STATE_HIDING) {
			this.panic(us, them);
		} else if(this.state === STATE_PANIC) {
			const travelDir = Math.sign(us.vel.x);
			const impactDir = Math.sign(us.pos.x - them.pos.x);
			if(travelDir !== 0 && travelDir !== impactDir) {
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

	handleStomp(us, them) {
		if(this.state === STATE_WALKING) {
			this.hide(us);
		} else if(this.state === STATE_HIDING) {
			us.traits.get(Killable).kill();
			us.vel.set(100, -200);
			us.traits.get(Solid).obstructs = false;
		} else if(this.state === STATE_PANIC) {
			this.hide(us);
		}
	}

	hide(us) {
		us.vel.x = 0;
		us.traits.get(PendulumMove).stop = true;
		if(this.walkSpeed === null) {
			this.walkSpeed = us.traits.get(PendulumMove).speed;
		}

		this.hideTime = 0;
		this.state = STATE_HIDING;
	}

	unhide(us) {
		us.traits.get(PendulumMove).stop = false;
		us.traits.get(PendulumMove).speed = this.walkSpeed;
		this.state = STATE_WALKING;
	}

	panic(us, them) {
		us.traits.get(PendulumMove).stop = false;
		us.traits.get(PendulumMove).speed = this.panicSpeed * Math.sign(them.vel.x);
		this.state = STATE_PANIC;
	}

	update(us, gameContext) {
		const deltaTime = gameContext.deltaTime;
		if(this.state === STATE_HIDING) {
			this.hideTime += deltaTime;
			if(this.hideTime > this.hideDuration) {
				this.unhide(us);
			}
		}
	}
}

function createKoopaFactory(sprite) {
	const walkAnim = sprite.animations.get("walk");
	const wakeAnim = sprite.animations.get("wake");

	function routeAnim(koopa) {
		if(koopa.traits.get(Behavior).state === STATE_HIDING || koopa.traits.get(Behavior).state === STATE_PANIC) {
			if(koopa.traits.get(Behavior).hideTime > 3) {
				return wakeAnim(koopa.traits.get(Behavior).hideTime);
			}

			if(koopa.traits.get(Behavior).state === STATE_PANIC) {
				return "hiding";
			}

			return "hiding";
		}

		koopa.offset.y = 8;
		return walkAnim(koopa.lifeTime);
	}

	function drawKoopa(ctx) {
		sprite.draw(routeAnim(this), ctx, 0, 0, this.vel.x < 0);
	}

	return function createKoopa() {
		const koopa = new Entity();
		koopa.size.set(10, 16);
		koopa.offset.x = 2;
		koopa.offset.y = 8;

		koopa.addTrait(new Solid());
		koopa.addTrait(new Physics());
		koopa.addTrait(new PendulumMove());
		koopa.addTrait(new Behavior());
		koopa.addTrait(new Killable());

		koopa.draw = drawKoopa;

		return koopa;
	};
}