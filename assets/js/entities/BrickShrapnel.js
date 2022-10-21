import Entity from "../Entity.js";
import LifeLimit from "../traits/LifeLimit.js";
import Gravity from "../traits/Gravity.js";
import Velocity from "../traits/Velocity.js";
import Trait from "../Trait.js";
import {loadAudioBoard} from "../loaders/audio.js";
import {loadSpriteSheet} from "../loaders/sprite.js";

export function loadBrickShrapnel(audioCtx) {
    return Promise.all([
        loadSpriteSheet("brickShrapnel"),
        loadAudioBoard("brickShrapnel", audioCtx)
    ])
    .then(([sprite, audio]) => {
        return createFactory(sprite, audio);
    });
}

class Behavior extends Trait {
    update(entity, _, level) {
        if(level.type === "overworld") {
            entity.type = "overworld";
        } else if(level.type === "underworld") {
            entity.type = "underworld";
        } else if(level.type === "intocastle") {
            entity.type = "intocastle";
        }
    }
}

function createFactory(sprite, audio) {
    const spinBrick = sprite.animations.get("spinningBrick");
    const uSpinBrick = sprite.animations.get("uSpinningBrick");
    const iSpinBrick = sprite.animations.get("iSpinningBrick");

    function routeFrame(entity) {
        if(entity.type === "overworld") {
            return spinBrick(entity.lifeTime);
        } else if(entity.type === "underworld") {
            return uSpinBrick(entity.lifeTime);
        } else if(entity.type === "intocastle") {
            return iSpinBrick(entity.lifeTime);
        }
    }

    function draw(ctx) {
        sprite.draw(routeFrame(this), ctx, 0, 0);
    }

    return function createBrickShrapnel() {
        const entity = new Entity();
        entity.type = "overworld";
        entity.audio = audio;
        entity.size.set(8, 8);
        entity.addTrait(new LifeLimit());
        entity.addTrait(new Gravity());
        entity.addTrait(new Velocity());
        entity.addTrait(new Behavior());
        entity.draw = draw;
        return entity;
    };
}
