import Trait from "../Trait.js";
import {Sides} from "../Entity.js";
import Killable from "./Killable.js";

export default class Stomper extends Trait {
	static EVENT_STOMP = Symbol("stomp");

	constructor() {
		super();
		this.bounceSpeed = 400;
	}

	bounce(us, them) {
		us.bounds.bottom = them.bounds.top;
		us.vel.y = -this.bounceSpeed;
	}

	collides(us, them) {
		if(!them.traits.get(Killable) || them.traits.get(Killable).dead || them.iap === true || us.marioDead === true) {
			return;
		}

		if(us.vel.y > them.vel.y) {
			this.queue(() => this.bounce(us, them));
			us.sounds.add("stomp");
			us.events.emit(Stomper.EVENT_STOMP, us, them);
		}
	}
}