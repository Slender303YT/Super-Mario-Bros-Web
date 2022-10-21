import TileResolver from "./TileResolver.js";
import {ground} from "./tiles/ground.js";
import {brick} from "./tiles/brick.js";
import {coin} from "./tiles/coin.js";
import {PC, PC2, PC3, PS, PC4, PB, P1UP, P1UP2} from "./tiles/powerup.js";
import {kill} from "./tiles/kill.js";

const handlers = {
    ground,
    brick,
    PC,
    PC2,
    PC3,
    PC4,
    PS,
    PB,
    P1UP,
    P1UP2,
    coin,
    kill
}

export default class TileCollider {
    constructor() {
        this.resolvers = [];
    }

    addGrid(tileMatrix) {
        this.resolvers.push(new TileResolver(tileMatrix));
    }

    checkX(entity, gameCtx, level) {
        let x;
        if (entity.vel.x > 0) {
            x = entity.bounds.right;
        } else if (entity.vel.x < 0) {
            x = entity.bounds.left;
        } else {
            return;
        }

        if(entity.marioDead === true) {
            return;
        }

        for(const resolver of this.resolvers) {
            const matches = resolver.searchByRange(
                x, x,
                entity.bounds.top, entity.bounds.bottom);

            matches.forEach(match => {
                this.handle(0, entity, match, resolver, gameCtx, level);
            });
        }
    }

    checkY(entity, gameCtx, level) {
        let y;
        if (entity.vel.y > 0) {
            y = entity.bounds.bottom;
        } else if (entity.vel.y < 0) {
            y = entity.bounds.top;
        } else {
            return;
        }

        if(entity.marioDead === true) {
            return;
        }

        for(const resolver of this.resolvers) {
            const matches = resolver.searchByRange(
                entity.bounds.left, entity.bounds.right,
                y, y);

            matches.forEach(match => {
                this.handle(1, entity, match, resolver, gameCtx, level);
            });
        }
    }

    handle(index, entity, match, resolver, gameCtx, level) {
        const tileCollisionCtx = {
            entity,
            match,
            resolver,
            gameCtx,
            level
        };
        const handler = handlers[match.tile.type];
        if(handler) {
            handler[index](tileCollisionCtx);
        }
    }
}