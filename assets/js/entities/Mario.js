import Entity from "../Entity.js";
import Emitter from "../traits/Emitter.js";
import Go from "../traits/Go.js";
import Jump from "../traits/Jump.js";
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";
import PipeTraveller from "../traits/PipeTraveller.js";
import PoleTraveller from "../traits/PoleTraveller.js";
import Physics from "../traits/Physics.js";
import Stomper from "../traits/Stomper.js";
import {loadAudioBoard} from "../loaders/audio.js";
import {loadSpriteSheet} from "../loaders/sprite.js";
import LevelTimer from "../traits/LevelTimer.js";
import FlagCinematic from "../traits/FlagCinematic.js";

const SLOW_DRAG = 1/1000;
const FAST_DRAG = 1/5000;

export function loadMario(audioCtx) {
	return Promise.all([
		loadSpriteSheet("mario"),
		loadAudioBoard("mario", audioCtx)
	])
	.then(([sprite, audio]) => {
		return createMarioFactory(sprite, audio);
	});
}

function createMarioFactory(sprite, audio) {
	const runAnimTiny = sprite.animations.get("runTiny");
	const scallingAnimTiny = sprite.animations.get("tinyScalling");
	const runAnim = sprite.animations.get("run");
	const scallingAnim = sprite.animations.get("scalling");
	const runTinyStarAnim = sprite.animations.get("runTinyStar");
	const jumpTinyStarAnim = sprite.animations.get("jumpTinyStar");
	const idleTinyStarAnim = sprite.animations.get("idleTinyStar");
	const breakTinyStarAnim = sprite.animations.get("breakTinyStar");
	const runStarAnim = sprite.animations.get("runStar");
	const jumpStarAnim = sprite.animations.get("jumpStar");
	const idleStarAnim = sprite.animations.get("idleStar");
	const breakStarAnim = sprite.animations.get("breakStar");
	const shiftingStarAnim = sprite.animations.get("shiftingStar");

	function getHeading(mario) {
        const poleTraveller = mario.traits.get(PoleTraveller);
        if (poleTraveller.distance) {
            return false;
        }
        return mario.traits.get(Go).heading < 0;
    }

	function routeFrame(mario) {
		if(mario.idleAnim === true) {
			return "idleTiny";
		}
		if(mario.marioDead === true) {
			return "dead";
		}
		if(mario.powerup === "none") {
			if(mario.onFlagCinematicAction1 === true) {
				return scallingAnimTiny(mario.lifeTime);
			}
			if(mario.starTime === true) {
				const pipeTraveller = mario.traits.get(PipeTraveller);
		        if (pipeTraveller.movement.x != 0) {
		            return runTinyStar3Anim(pipeTraveller.distance.x * 2);
		        }
		        if (pipeTraveller.movement.y != 0) {
		            return idleTinyStarAnim(mario.lifeTime);
		        }

				if(mario.traits.get(Jump).falling) {
					return jumpTinyStarAnim(mario.lifeTime);
				}

				if(mario.isXColliding) {
					return idleTinyStarAnim(mario.lifeTime);
				}

				if(mario.traits.get(Go).distance > 0) {
					if((mario.vel.x > 0 && mario.traits.get(Go).dir < 0) || (mario.vel.x < 0 && mario.traits.get(Go).dir > 0)) {
						return breakTinyStarAnim(mario.lifeTime);
					}

					return runTinyStarAnim(mario.traits.get(Go).distance);
				}

				return idleTinyStarAnim(mario.lifeTime);
			} else {
				const pipeTraveller = mario.traits.get(PipeTraveller);
		        if (pipeTraveller.movement.x != 0) {
		            return runAnimTiny(pipeTraveller.distance.x * 2);
		        }
		        if (pipeTraveller.movement.y != 0) {
		            return "idleTiny";
		        }

				if(mario.traits.get(Jump).falling) {
					return "jumpTiny";
				}

				if(mario.isXColliding) {
					return "idleTiny";
				}

				if(mario.traits.get(Go).distance > 0) {
					if((mario.vel.x > 0 && mario.traits.get(Go).dir < 0) || (mario.vel.x < 0 && mario.traits.get(Go).dir > 0)) {
						return "breakTiny";
					}

					return runAnimTiny(mario.traits.get(Go).distance);
				}

				return "idleTiny";
			}
		} else if(mario.powerup === "big") {
			if(mario.shifting === false) {
				if(mario.starTime === true) {
					if(mario.onFlagCinematicAction1 === true) {
						return scallingAnim(mario.lifeTime);
					}
					const pipeTraveller = mario.traits.get(PipeTraveller);
			        if (pipeTraveller.movement.x != 0) {
			            return runStarAnim(pipeTraveller.distance.x * 2);
			        }
			        if (pipeTraveller.movement.y != 0) {
			            return idleStarAnim(mario.lifeTime);
			        }

					if(mario.traits.get(Jump).falling) {
						return jumpStarAnim(mario.lifeTime);
					}

					if(mario.isXColliding) {
						return idleStarAnim(mario.lifeTime);
					}

					if(mario.traits.get(Go).distance > 0) {
						if((mario.vel.x > 0 && mario.traits.get(Go).dir < 0) || (mario.vel.x < 0 && mario.traits.get(Go).dir > 0)) {
							return breakStarAnim(mario.lifeTime);
						}

						return runStarAnim(mario.traits.get(Go).distance);
					}

					return idleStarAnim(mario.lifeTime);
				} else {
					if(mario.onFlagCinematicAction1 === true) {
						return scallingAnim(mario.lifeTime);
					}
					const pipeTraveller = mario.traits.get(PipeTraveller);
			        if (pipeTraveller.movement.x != 0) {
			            return runAnim(pipeTraveller.distance.x * 2);
			        }
			        if (pipeTraveller.movement.y != 0) {
			            return "idle";
			        }

					if(mario.traits.get(Jump).falling) {
						return "jump";
					}

					if(mario.isXColliding) {
						return "idle";
					}

					if(mario.traits.get(Go).distance > 0) {
						if((mario.vel.x > 0 && mario.traits.get(Go).dir < 0) || (mario.vel.x < 0 && mario.traits.get(Go).dir > 0)) {
							return "break";
						}

						return runAnim(mario.traits.get(Go).distance);
					}

					return "idle";
				}
			} else if(mario.shifting === true) {
				if(mario.starTime === true) {
					return shiftingStarAnim(mario.lifeTime);
				} else {
					return "shifting";
				}
			}
		}
	}

	function setTurboState(turboOn) {
		this.traits.get(Go).dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
	}

	function drawMario(ctx) {
		sprite.draw(routeFrame(this), ctx, 0, 0, this.traits.get(Go).heading < 0);
	}

	function makePowerup(entity, type, playSound = true) {
		if(type === "tiny") {
			entity.powerup = "none";
			if(playSound === true) {
				entity.sounds.add("pipe-enter");
			}
			entity.size.set(12, 12);
			entity.offset.x = 2;
			entity.offset.y = 4;
		} else if(type === "big") {
			entity.powerup = "big";
			entity.pos.y = entity.pos.y - 8;
			entity.size.set(12, 24);
			entity.offset.y = 8;
			entity.sounds.add("powerup-consume");
		}
	}

	function shift(mario, keyState) {
		if(mario.powerup === "big" || mario.powerup === "flower") {
			/*if(keyState === false) {
				mario.traits.get(Go).acceleration = 0;
			} else {
				mario.traits.get(Go).acceleration = 400;
			}*/
			//if(mario.jumping === false || mario.moving === false) {
				mario.shifting = keyState ? true : false;
			//}
		}
	}

	return function createMario() {
		const mario = new Entity();
		mario.audio = audio;
		mario.onFlagCinematicAction1 = false;
		mario.onFlagCinematicAction2 = false;
		mario.shifting = false;
		mario.jumping = false;
		mario.moving = false;
		mario.traspassedCheckpoint = false;
		mario.levelName = "1-1";
		mario.isXColliding = false;
		mario.powerup = "none";
		mario.starTime = false;
		mario.size.set(12, 12);
		mario.offset.x = 2;
		mario.offset.y = 4;
		mario.marioDead = false;
		mario.idleAnim = false;

		mario.addTrait(new Solid());
		mario.addTrait(new Physics());
		mario.addTrait(new Go());
		mario.addTrait(new Jump());
		mario.addTrait(new Killable());
		mario.addTrait(new Stomper());
		mario.addTrait(new LevelTimer());
		mario.addTrait(new PipeTraveller());
        mario.addTrait(new PoleTraveller());
        mario.addTrait(new FlagCinematic());

		mario.traits.get(Killable).removeAfter = 0;
		//mario.traits.get(Killable).removeAfter = Infinity;
        mario.traits.get(Jump).velocity = 175;
		
		mario.turbo = setTurboState;
		mario.draw = drawMario;
		mario.shift = shift;
		mario.makePowerup = makePowerup;

		mario.turbo(false);

		return mario;
	}
}