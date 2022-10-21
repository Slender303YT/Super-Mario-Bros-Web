import Entity from "../Entity.js";
import Trait from "../Trait.js";
import Stomper from "../traits/Stomper.js";
import {loadSpriteSheet} from "../loaders/sprite.js";
import {findPlayers} from "../player.js";
import Killable from "../traits/Killable.js";
import PipeTraveller from "../traits/PipeTraveller.js";

export function loadPiranhaPlant() {
    return loadSpriteSheet("piranhaPlant")
    .then(createPiranhaPlantFactory);
}

export function loadUPiranhaPlant() {
    return loadSpriteSheet("uPiranhaPlant")
    .then(createPiranhaPlantFactory);
}

class Behavior extends Trait {
    constructor() {
        super();
        this.graceDistance = 32;
        this.idleTime = 4;
        this.idleCounter = 0;
        this.attackTime = 2;
        this.attackCounter = null;
        this.holdTime = 2;
        this.holdCounter = null;
        this.retreatTime = 2;
        this.retreatCounter = null;
        this.velocity = 30;
        this.deltaMove = 0;
    }

    collides(us, them) {
        if(them.traits.get(Stomper) && them.traits.get(PipeTraveller).inPipe === false) {
            if(them.powerup === "big") {
                them.makePowerup(them, "tiny");
            } else {
                them.traits.get(Killable).kill();
            }
        }
    }

    update(entity, gameContext, level) {
        const {deltaTime} = gameContext;

        if (this.idleCounter !== null) {
            for (const player of findPlayers(level.entities)) {
                const distance = player.bounds.getCenter().distance(entity.bounds.getCenter());
                if (distance < this.graceDistance) {
                    this.idleCounter = 0;
                    return;
                }
            }

            this.idleCounter += deltaTime;
            if (this.idleCounter >= this.idleTime) {
                this.attackCounter = 0;
                this.idleCounter = null;
            }
        }
        else if (this.attackCounter !== null) {
            this.attackCounter += deltaTime;
            const movement = this.velocity * deltaTime;
            this.deltaMove += movement;
            entity.pos.y -= movement;
            if (this.deltaMove >= entity.size.y) {
                entity.pos.y += entity.size.y - this.deltaMove;
                this.attackCounter = null;
                this.holdCounter = 0;
            }
        }
        else if (this.holdCounter !== null) {
            this.holdCounter += deltaTime;
            if (this.holdCounter >= this.holdTime) {
                this.retreatCounter = 0;
                this.holdCounter = null;
            }
        }
        else if (this.retreatCounter !== null) {
            this.retreatCounter += deltaTime;
            const movement = this.velocity * deltaTime;
            this.deltaMove -= movement;
            entity.pos.y += movement;
            if (this.deltaMove <= 0) {
                entity.pos.y -= this.deltaMove;
                this.retreatCounter = null;
                this.idleCounter = 0;
            }
        }
    }
}


function createPiranhaPlantFactory(sprite) {
    const chewAnim = sprite.animations.get("chew");

    function routeAnim(entity) {
        return chewAnim(entity.lifeTime);
    }

    function drawPiranhaPlant(ctx) {
        sprite.draw(routeAnim(this), ctx, 0, 0);
    }

    return function createPiranhaPlant() {
        const entity = new Entity();
        entity.size.set(16, 24);
        entity.offset.y = 8;

        entity.addTrait(new Behavior());

        entity.draw = drawPiranhaPlant;

        return entity;
    };
}
