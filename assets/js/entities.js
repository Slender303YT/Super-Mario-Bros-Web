import {loadMario} from "./entities/Mario.js";
import {loadPB} from "./entities/PB.js";
import {loadP1UP} from "./entities/P1UP.js";
import {loadPiranhaPlant, loadUPiranhaPlant} from "./entities/PiranhaPlant.js";
import {loadGoomba, loadUGoomba} from "./entities/Goomba.js";
import {loadKoopa, loadUKoopa, loadRKoopa} from "./entities/Koopa.js";
import {loadBullet} from "./entities/Bullet.js";
import {loadCannon} from "./entities/Cannon.js";
import {loadPipePortal} from "./entities/PipePortal.js";
import {loadPD} from "./entities/PlatformDown.js";
import {loadPU} from "./entities/PlatformUp.js";
import {loadDashboardCoin} from "./entities/DashboardCoin.js";
import {loadLogo} from "./entities/Logo.js";
import {loadPS} from "./entities/PS.js";
import {loadBrickShrapnel} from "./entities/BrickShrapnel.js";
import {loadFireBall} from "./entities/FireBall.js";
import {loadFireLaser4} from "./entities/FireLaser.js";
import {loadST} from "./entities/SelectType.js";

function createPool(size) {
	const pool = [];

	return function createPooledFactory(factory) {
		for(let i = 0; i < size; i++) {
			pool.push(factory());
		}

		let count = 0;
		return function pooledFactory() {
			const entity = pool[count++ % pool.length];
			entity.lifeTime = 0;
			return entity;
		}
	}
}

export async function loadEntities(audioCtx) {
	const entityFactories = {};

	function setup(loader) {
        return loader(audioCtx);
    }

	function addAs(name) {
		return factory => entityFactories[name] = factory;
	}

	await Promise.all([
		setup(loadMario).then(addAs("mario")),
		setup(loadPiranhaPlant).then(addAs("piranhaPlant")),
		setup(loadUPiranhaPlant).then(addAs("uPiranhaPlant")),
		setup(loadPB).then(addAs("pb")),
		setup(loadP1UP).then(addAs("p1up")),
		setup(loadPS).then(addAs("ps")),
		setup(loadGoomba).then(addAs("goomba")),
		setup(loadUGoomba).then(addAs("uGoomba")),
		setup(loadKoopa).then(addAs("koopa")),
		setup(loadUKoopa).then(addAs("uKoopa")),
		setup(loadRKoopa).then(addAs("rKoopa")),
		setup(loadBullet).then(addAs("bullet")),
		setup(loadCannon).then(addAs("cannon")),
		setup(loadPD).then(addAs("platformDown")),
		setup(loadPU).then(addAs("platformUp")),
		setup(loadPipePortal).then(addAs("pipePortal")),
		setup(loadDashboardCoin).then(addAs("dashCoin")),
		setup(loadLogo).then(addAs("logo")),
		setup(loadFireBall).then(addAs("fireBall")),
		setup(loadFireLaser4).then(addAs("fireLaser4")),
		setup(loadST).then(addAs("st")),
		setup(loadBrickShrapnel).then(createPool(8)).then(addAs("brickShrapnel"))
	]);

	return entityFactories;
}