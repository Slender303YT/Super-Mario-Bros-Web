import Entity from "../Entity.js";
import Emitter from "../traits/Emitter.js";
import {findPlayers} from "../player.js";
import {loadAudioBoard} from "../loaders/audio.js";
import {loadSpriteSheet} from "../loaders/sprite.js";

const HOLD_FIRE_THRESHOLD = 30;

export function loadCannon(audioCtx) {
	return loadAudioBoard("cannon", audioCtx)
	.then(audio => {
		return createCannonFactory(audio);
	});
}

function createCannonFactory(audio) {
	function emitBullet(cannon, gameCtx, level) {
		let dir = 1;
		for(const player of findPlayers(level.entities)) {
			if(player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD 
			&& player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD) {
				return;
			}

			if(player.pos.x < cannon.pos.x) {
				dir = -1;
			}
		}
		
		const bullet = gameCtx.entityFactory.bullet();
		bullet.pos.copy(cannon.pos);
		bullet.vel.set(80 * dir, 0);
		cannon.sounds.add("shoot");
		level.entities.add(bullet);
	}

	return function createCannon() {
		const cannon = new Entity();
		cannon.audio = audio;
		const emitter = new Emitter();
		emitter.interval = 5;
		emitter.emitters.push(emitBullet);
		cannon.addTrait(emitter);
		return cannon;
	}
}