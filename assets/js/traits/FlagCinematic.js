import Trait from "../Trait.js";
import Physics from "./Physics.js";
import Jump from "./Jump.js";
import Go from "./Go.js";
export default class FlagCinematic extends Trait {
	constructor() {
		super();
		this.time = 0;
		this.active = false;
		this.goingDown = true;
		this.canMove = true;
		this.canDir = true;
	}

	reset() {
		this.goingDown = true;
		this.active = false;
		this.canMove = true;
		this.time = 0;
	}

	update(entity, {deltaTime}, level) {
		if(this.active === true) {
			this.canReset = true;
			if(this.canMove === true) {
				entity.pos.x += 4;
				this.canMove = false;
			}
			if(entity.powerup === "none") {
				if(entity.pos.y <= 175 && this.goingDown === true) {
					entity.onFlagCinematicAction1 = true;
					entity.vel.set(0, 0);
					entity.traits.get(Physics).using = false;
					entity.pos.y++;
				} else {
					this.time += deltaTime;
					entity.onFlagCinematicAction1 = false;
					entity.traits.get(Physics).using = true;
					this.goingDown = false;
					if(this.time >= 0.1) {
						entity.traits.get(Go).dir = 1;
					}
				}
			} else if(entity.powerup === "big" || entity.powerup === "flower") {
				if(entity.pos.y <= 159 && this.goingDown === true) {
					entity.onFlagCinematicAction1 = true;
					entity.vel.set(0, 0);
					entity.traits.get(Physics).using = false;
					entity.pos.y++;
				} else {
					this.time += deltaTime;
					entity.onFlagCinematicAction1 = false;
					entity.traits.get(Physics).using = true;
					this.goingDown = false;
					if(this.time >= 0.1 && this.canDir === true) {
						entity.traits.get(Go).dir = 1;
					}
				}
			}
		}
	}
}