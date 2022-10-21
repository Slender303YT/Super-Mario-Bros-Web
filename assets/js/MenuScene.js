import Camera from "./Camera.js";
import EventEmitter from "./EventEmitter.js";
import MusicController from "./MusicController.js";
import Compositor from "./Compositor.js";
import EntityCollider from "./EntityCollider.js";
import Scene from "./Scene.js";
import TileCollider from "./TileCollider.js";
import {findPlayers} from "./player.js";

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
	constructor() {
		super();
		this.name = "";
		this.type = "overworld";
		this.menu = true;
		this.totalTime = 0;
		this.camera = new Camera();
		this.comp = new Compositor();
		this.entities = new EntityCollection();
		this.checkpoints = [];

		this.entityCollider = new EntityCollider(this.entities);
		this.tileCollider = new TileCollider();
	}

	draw(gameCtx) {
		this.comp.draw(gameCtx.videoCtx, this.camera);
	}

	update(_) {

	}
}