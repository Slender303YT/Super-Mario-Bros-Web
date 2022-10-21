import {Vec2} from "./math.js";
import AudioBoard from "./AudioBoard.js";
import EventBuffer from "./EventBuffer.js";
import BoundingBox from "./BoundingBox.js";
import Trait from "./Trait.js";

export const Align = {
    center(target, subject) {
        subject.bounds.setCenter(target.bounds.getCenter());
    },

    bottom(target, subject) {
        subject.bounds.bottom = target.bounds.bottom;
    },

    top(target, subject) {
        subject.bounds.top = target.bounds.top;
    },

    left(target, subject) {
        subject.bounds.left = target.bounds.left;
    },

    right(target, subject) {
        subject.bounds.right = target.bounds.right;
    },
};

export const Sides = {
	LEFT: Symbol("left"),
	RIGHT: Symbol("right"),
	TOP: Symbol("top"),
	BOTTOM: Symbol("bottom")
};

export default class Entity {
	constructor() {
		this.isColliding = false;
		this.audio = new AudioBoard();
		this.sounds = new Set();
		this.events = new EventBuffer();
		this.pos = new Vec2(0, 0);
		this.vel = new Vec2(0, 0);
		this.size = new Vec2(0, 0);
		this.offset = new Vec2(0, 0);
		this.spriteOffset = new Vec2(0, 0);
		this.bounds = new BoundingBox(this.pos, this.size, this.offset);
		this.lifeTime = 0;

		this.traits = new Map();
	}

	addTrait(trait) {
		this.traits.set(trait.constructor, trait);
	}

	collides(candidate) {
		this.traits.forEach(trait => {
			trait.collides(this, candidate);
		});
	}

	obstruct(side, match) {
		this.traits.forEach(trait => {
			trait.obstruct(this, side, match);
		});
	}

	draw() {
		
	}

	finalize() {
		this.events.emit(Trait.EVENT_TASK, this);
		this.traits.forEach(trait => {
			trait.finalize(this);
		});
		this.events.clear();
	}

	playSounds(audioBoard, audioCtx) {
		this.sounds.forEach(name => {
			audioBoard.playAudio(name, audioCtx);
		});

		this.sounds.clear();
	}

	update(gameCtx, level) {
		this.traits.forEach(trait => {
			trait.update(this, gameCtx, level);
		});

		this.playSounds(this.audio, gameCtx.audioCtx);

		this.lifeTime += gameCtx.deltaTime;
	}
}