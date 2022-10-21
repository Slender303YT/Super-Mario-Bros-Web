import Trait from "../Trait.js";
import {Sides} from "../Entity.js";

export default class Platform extends Trait {
	constructor() {
		super();
		this.obstructs = true;
	}

	collides(us, them) {
		if(!this.obstructs) {
			return;
		}

		if(side == Sides.BOTTOM) {
			entity.bounds.bottom = match.y1;
            entity.vel.y = 0;
		} else if(side == Sides.TOP) {
			entity.bounds.top = match.y2;
            entity.vel.y = 0;
		} else if(side == Sides.RIGHT) {
			entity.bounds.right = match.x1;
            entity.vel.x = 0;
		} else if(side == Sides.LEFT) {
			entity.bounds.left = match.x2;
            entity.vel.x = 0;
        }
	}
}