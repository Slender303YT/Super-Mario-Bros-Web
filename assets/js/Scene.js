import EventEmitter from "./EventEmitter.js";
import Compositor from "./Compositor.js";
import {findPlayers} from "./player.js";

export default class CompositionScene {
	static EVENT_COMPLETE = Symbol("scene complete");

	constructor() {
		this.events = new EventEmitter();
		this.comp = new Compositor();
	}

	draw(gameCtx) {
		this.comp.draw(gameCtx.videoCtx, this.camera);
	}

	update(gameCtx) {
		
	}

	pause() {
		
	}
}