import {Sides} from "../Entity.js";
import Player from "../traits/Player.js";

function handleX({entity, match}) {
    if (entity.vel.x > 0) {
        if (entity.bounds.right > match.x1) {
            entity.obstruct(Sides.RIGHT, match);
        }
    } else if (entity.vel.x < 0) {
        if (entity.bounds.left < match.x2) {
            entity.obstruct(Sides.LEFT, match);
        }
    }
}
function handleXNone({entity, match}) {
    
}
function handleYC({entity, match, resolver}) {
    if (entity.vel.y > 0) {
        if (entity.bounds.bottom > match.y1) {
            entity.obstruct(Sides.BOTTOM, match);
        }
    } else if (entity.vel.y < 0) {
        if(entity.traits.has(Player)) {
            entity.traits.get(Player).addCoins(1);
            const grid = resolver.matrix;
            grid.set(match.indexX, match.indexY, {"name": "chance-collected", "type": "ground", "ranges": [[match.indexX, match.indexY]]});
        }
        if (entity.bounds.top < match.y2) {
            entity.obstruct(Sides.TOP, match);
        }
    }
}
function handleYPS({entity, match, resolver, gameCtx, level}) {
    if (entity.vel.y > 0) {
        if (entity.bounds.bottom > match.y1) {
            entity.obstruct(Sides.BOTTOM, match);
        }
    } else if (entity.vel.y < 0) {
        if(entity.traits.has(Player)) {
            const pb = gameCtx.entityFactory.ps();
            pb.pos.set(match.x1 + 8, match.y1 - 16);
            level.entities.add(pb);
            entity.sounds.add("powerup-appears");
            const grid = resolver.matrix;
            grid.set(match.indexX, match.indexY, {"name": "chance-collected", "type": "ground", "ranges": [[match.indexX, match.indexY]]});
        }
        if (entity.bounds.top < match.y2) {
            entity.obstruct(Sides.TOP, match);
        }
    }
}
function handleYC2({entity, match, resolver, gameCtx}) {
    if (entity.vel.y < 0) {
        if(entity.traits.has(Player)) {
            entity.traits.get(Player).addCoins(7);
            const grid = resolver.matrix;
            grid.set(match.indexX, match.indexY, {"name": "chance-collected", "type": "ground", "ranges": [[match.indexX, match.indexY]]});
        }
    }
}
function handleYC4({entity, match, resolver, gameCtx}) {
    if (entity.vel.y > 0) {
        if (entity.bounds.bottom > match.y1) {
            entity.obstruct(Sides.BOTTOM, match);
        }
    } else if (entity.vel.y < 0) {
        if(entity.traits.has(Player)) {
            entity.traits.get(Player).addCoins(7);
            const grid = resolver.matrix;
            grid.set(match.indexX, match.indexY, {"name": "chance-collected", "type": "ground", "ranges": [[match.indexX, match.indexY]]});
        }
        if (entity.bounds.top < match.y2) {
            entity.obstruct(Sides.TOP, match);
        }
    }
}
function handleYC3({entity, match, resolver, gameCtx}) {
    if (entity.vel.y < 0) {
        if(entity.traits.has(Player)) {
            entity.traits.get(Player).addCoins(1);
            const grid = resolver.matrix;
            grid.set(match.indexX, match.indexY, {"name": "chance-collected", "type": "ground", "ranges": [[match.indexX, match.indexY]]});
        }
    }
}
function handleYPB({entity, match, resolver, gameCtx, level}) {
    if (entity.vel.y > 0) {
        if (entity.bounds.bottom > match.y1) {
            entity.obstruct(Sides.BOTTOM, match);
        }
    } else if (entity.vel.y < 0) {
        if(entity.traits.has(Player)) {
            const pb = gameCtx.entityFactory.pb();
            pb.pos.set(match.x1 + 8, match.y1 - 16);
            level.entities.add(pb);
            entity.sounds.add("powerup-appears");
            const grid = resolver.matrix;
            grid.set(match.indexX, match.indexY, {"name": "chance-collected", "type": "ground", "ranges": [[match.indexX, match.indexY]]});
        }
        if (entity.bounds.top < match.y2) {
            entity.obstruct(Sides.TOP, match);
        }
    }
}
function handleYP1UP1({entity, match, resolver, gameCtx, level}) {
    if (entity.vel.y < 0) {
        if(entity.traits.has(Player)) {
            const grid = resolver.matrix;
            grid.set(match.indexX, match.indexY, {"name": "chance-collected", "type": "ground", "ranges": [[match.indexX, match.indexY]]});
            const pb = gameCtx.entityFactory.p1up();
            pb.pos.set(match.x1 + 8, match.y1 - 16);
            level.entities.add(pb);
            entity.sounds.add("powerup-appears");
        }
    }
}
function handleYP1UP2({entity, match, resolver, gameCtx, level}) {
    if (entity.vel.y > 0) {
        if (entity.bounds.bottom > match.y1) {
            entity.obstruct(Sides.BOTTOM, match);
        }
    } else if (entity.vel.y < 0) {
        if(entity.traits.has(Player)) {
            const grid = resolver.matrix;
            grid.set(match.indexX, match.indexY, {"name": "chance-collected", "type": "ground", "ranges": [[match.indexX, match.indexY]]});
            const pb = gameCtx.entityFactory.p1up();
            pb.pos.set(match.x1 + 8, match.y1 - 16);
            level.entities.add(pb);
            entity.sounds.add("powerup-appears");
        }
        if (entity.bounds.top < match.y2) {
            entity.obstruct(Sides.TOP, match);
        }
    }
}

export const PC = [handleX, handleYC];
export const PC2 = [handleXNone, handleYC2];
export const PC3 = [handleXNone, handleYC3];
export const PC4 = [handleX, handleYC4];
export const PS = [handleX, handleYPS];
export const PB = [handleX, handleYPB];
export const P1UP = [handleX, handleYP1UP1];
export const P1UP2 = [handleX, handleYP1UP2];