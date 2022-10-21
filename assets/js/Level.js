import Camera from "./Camera.js";
import EventEmitter from "./EventEmitter.js";
import MusicController from "./MusicController.js";
import Compositor from "./Compositor.js";
import EntityCollider from "./EntityCollider.js";
import Scene from "./Scene.js";
import Killable from "./traits/Killable.js";
import Player from "./traits/Player.js";
import TileCollider from "./TileCollider.js";
import {findPlayers} from "./player.js";

function focusPlayer(level) {
	for(const player of findPlayers(level.entities)) {
		if(level.variables[0] === 16) {
			level.camera.pos.x = Math.max(0, Math.min(0, player.pos.x - 150));
		} else {
			level.camera.pos.x = Math.max(0, Math.min((level.variables[0] * 15) - 44, player.pos.x - 150));
		}
	}
}

function checkpoints(level) {
	for(const player of findPlayers(level.entities)) {
		if(level.checkpoints.length >= 1) {
			if(level.checkpoints[0].x != 0 && level.checkpoints[0].y != 0) {
				if(player.pos.x >= level.checkpoints[0].x) {
					player.traspassedCheckpoint = true;
				} else if(player.traspassedCheckpoint === false) {
					player.traspassedCheckpoint = false;
				}
			}
		}
	}
}

function levelLimit(level) {
	for(const player of findPlayers(level.entities)) {
		if(player.pos.x <= 0) {
			player.pos.x = 0;
		}
		if(player.pos.x >= (level.variables[0] * 16) - 16) {
			player.pos.x = (level.variables[0] * 16) - 16;
		}
	}
}

class EntityCollection extends Set {
    get(id) {
        for (const entity of this) {
            if (entity.id === id) {
                return entity;
            }
        }
    }
}

export default class Level extends Scene {
	static EVENT_TRIGGER = Symbol("trigger");
	static EVENT_COMPLETE = Symbol('complete');

	constructor() {
		super();
		this.name = "";
		this.type = "overworld";
		this.gravity = 1500;
		this.ile = false;
		this.checkpoints = [];
		this.totalTime = 0;
		this.camera = new Camera();
		this.music = new MusicController();
		this.comp = new Compositor();
		this.entities = new EntityCollection();
		this.variables = [];
		this.backgroundSprites = null;

		this.entityCollider = new EntityCollider(this.entities);
		this.tileCollider = new TileCollider();
	}

	draw(gameCtx) {
		this.comp.draw(gameCtx.videoCtx, this.camera);
		if(gameCtx.isInEditor === true) {
			gameCtx.levelArrayLE.layers.forEach(layer => {
				layer.tiles.forEach(tile => {
					if(layer.dontDrawInEditor) {
						// Stinky
					} else {
						tile.ranges.forEach(range => {
							var x = Math.floor(range[0] * 16), y = Math.floor(range[1] * 16);
							if(y <= 14) {
								// Hey, Stinky.....
							} else {
								if(!tile.pattern) {
									if(tile.animation) {
										if(x >= (this.camera.pos.x - 32) && x <= (this.camera.pos.x + 256)) {
											this.backgroundSprites.drawAnim(tile.animation, gameCtx.videoCtx, Math.floor(x - this.camera.pos.x), Math.floor(y - this.camera.pos.y), this.totalTime, true);
										}
									} else {
										if(x >= (this.camera.pos.x - 32) && x <= (this.camera.pos.x + 256)) {
											this.backgroundSprites.drawTile(tile.name, gameCtx.videoCtx, Math.floor(x - this.camera.pos.x), Math.floor(y - this.camera.pos.y), true);
										}
									}
								}
							}
						});
					}
				});
			});
		}
	}

	update(gameCtx) {
		this.entities.forEach(entity => {
			entity.update(gameCtx, this);
		});

		this.entities.forEach(entity => {
			if(entity.pos.y >= 240) {
				if(entity.traits.has(Player)) {
					entity.makePowerup(entity, "tiny", false);
				}
				if(entity.traits.has(Killable)) {
					if(entity.traits.get(Killable).dead === false) {
						entity.traits.get(Killable).kill();
					}
				} else {
					this.entities.delete(entity);
				}
			}
		});

		this.entities.forEach(entity => {
			this.entityCollider.check(entity);
		});

		this.entities.forEach(entity => {
			entity.finalize();
		});

		checkpoints(this);
		levelLimit(this);
		focusPlayer(this);

		this.totalTime += gameCtx.deltaTime;
	}

	pause() {
		this.music.pause();
	}
}