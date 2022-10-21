import Trait from "../Trait.js";
import {Sides} from "../Entity.js";
import Player from "./Player.js";

export default class PendulumMove extends Trait {
	constructor() {
		super();
		this.enabled = false;
		this.stop = false;
		this.entityC = true;
		this.speed = -30;
	}

	obstruct(entity, side) {
		if(side === Sides.LEFT || side === Sides.RIGHT || entity.pos.x <= 0) {
			this.speed = -this.speed;
		}
	}

	collides(_, them) {
		if(!them.traits.has(Player) && this.entityC === true) {
			this.entityC = false;
			this.speed = -this.speed;
		}
	}

	update(entity, {mario}) {
		if(entity.pos.x < mario.pos.x + 160 && this.stop === false) {
			this.enabled = true;
		}
		if(this.stop === true) {
			this.enabled = false;
		}
		if(this.enabled) {
			entity.vel.x = this.speed;
		}
	}
}