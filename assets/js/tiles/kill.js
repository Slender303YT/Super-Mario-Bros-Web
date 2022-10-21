import {Sides} from "../Entity.js";
import Killable from "../traits/Killable.js";

function handleKill({entity}) {
    entity.makePowerup(entity, "tiny", false);
}

export const kill = [handleKill, handleKill];