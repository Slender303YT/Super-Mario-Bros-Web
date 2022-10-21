import Trait from "../Trait.js";
import {Sides} from "../Entity.js";
import Player from "./Player.js";
import Jump from "./Jump.js";
import Go from "./Go.js";

export default class Killable extends Trait {
	constructor() {
		super();
		this.dead = false;
		this.deadTime = 0;
		this.removeAfter = 1.3;
		this.marioTime = 0;
		this.canPlay = true;
		this.canQueue = true;
	}

	kill() {
		this.queue(() => this.dead = true);
	}

	revive() {
		this.dead = false;
		this.deadTime = 0;
	}

	update(entity, gameContext, level) {
		const {deltaTime} = gameContext;
		if(this.dead) {
			this.deadTime += deltaTime;
			if(this.deadTime > this.removeAfter) {
				if(entity.traits.has(Player)) {
					this.marioTime += deltaTime;
					if(this.marioTime <= 3.5) {
						if(this.canPlay === true) {
							level.pause();
							entity.sounds.add("die");
							entity.traits.get(Jump).jumpCustom(1);
							entity.traits.get(Go).acceleration = 0;
							entity.marioDead = true;
							this.canPlay = false;
						}
					} else {
						if(this.canQueue === true) {
							this.queue(() => {
								entity.marioDead = false;
								entity.traits.get(Go).acceleration = 400;
								entity.traits.get(Go).heading = 1;
								entity.idleAnim = true;
								this.marioTime = 0;
								this.canPlay = true;
								this.canQueue = true;
								entity.pos.set(40, level.variables[1]);
								entity.traits.get(Killable).dead = false;
								entity.traits.get(Killable).deadTime = 0;
								--entity.traits.get(Player).lives;
								if(entity.traits.get(Player).lives <= 0) {
									entity.makePowerup(entity, "tiny", false);
									entity.traits.get(Player).lives = 3;
									entity.traits.get(Player).coins = 0;
									entity.traits.get(Player).score = 0;
									entity.traspassedCheckpoint = false;
									entity.idleAnim = false;
									window.runLevel("1-1");
								} else {
									entity.idleAnim = false;
									window.runLevel(level.name);
								}
							});
							this.canQueue = false;
						}
					}
				} else {
					this.queue(() => {
						level.entities.delete(entity);
					});
				}
			}
		}
	}
}