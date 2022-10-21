import Scene from "./Scene.js";

export default class TimedScene extends Scene {
	constructor() {
		super();
		this.countDown = 2;
	}

	update(gameCtx) {
		this.countDown -= gameCtx.deltaTime;
		if(this.countDown <= 0) {
			this.events.emit(Scene.EVENT_COMPLETE);
		}
	}
}