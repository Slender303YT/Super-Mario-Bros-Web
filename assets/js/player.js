import Entity from "./Entity.js";
import Player from "./traits/Player.js";
import PlayerController from "./traits/PlayerController.js";
import LevelTimer from "./traits/LevelTimer.js";

export function createPlayerEnv(playerEntity) {
	const playerEnv = new Entity();
	const playerControl = new PlayerController();
	playerControl.checkpoint.set(40, 192); // default is 40, 176
	playerControl.setPlayer(playerEntity);
	playerEnv.addTrait(playerControl);

	return playerEnv;
}

export function makePlayer(entity, name) {
	const player = new Player();
	player.name = name;
	entity.addTrait(player);
}

export function setWorld(entity, world) {
	entity.traits.get(Player).world = world;
}

export function bootstrapPlayer(entity, level, world = "empty") {
	console.log(entity, level, world)
    entity.traits.get(LevelTimer).hurryEmitted = null;
    if(entity.traspassedCheckpoint === true) {
    	entity.pos.copy(level.checkpoints[0]);
    }
    level.entities.add(entity);
}

export function resetPlayer(entity, worldName, var1 = false) {
    if(var1 === false) {
    	entity.traits.get(LevelTimer).reset();
    }
    if(worldName != "Test") {
    	entity.traits.get(Player).world = worldName;
    }
}

export function* findPlayers(entities) {
	for(const entity of entities) {
		if(entity.traits.has(Player)) {
			yield entity;
		}
	}
}