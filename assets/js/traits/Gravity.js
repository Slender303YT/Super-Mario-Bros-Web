import Trait from "../Trait.js";

export default class Gravity extends Trait {
	constructor() {
		super();
		this.using = true;
	}

	update(entity, {deltaTime}, level) {
		if(this.using === true) {
			entity.vel.y += level.gravity * deltaTime;
		}
	}
}