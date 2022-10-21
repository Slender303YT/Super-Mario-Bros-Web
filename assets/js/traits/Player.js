import Trait from "../Trait.js";
import Stomper from "./Stomper.js";

const COIN_LIFE_THRESHOLD = 100;

export default class Player extends Trait {
	constructor() {
		super();
		this.name = "UNNAMED";
		this.world = "UNKNOWN";
		this.coins = 0;
		this.lives = 3;
		this.score = 0;
		this.listen(Stomper.EVENT_STOMP, () => {
			this.score += 100;
		});
	}

	addCoins(count) {
		this.coins += count;
		this.score += 100 * count;
		this.queue(entity => entity.sounds.add("coin"));
		while(this.coins >= COIN_LIFE_THRESHOLD) {
			this.queue(entity => entity.sounds.add("1up"));
			this.addLives(1);
			this.coins -= COIN_LIFE_THRESHOLD;
			this.score += 1000 * count;
		}
	}

	addLives(count) {
		this.lives += count;
	}
}