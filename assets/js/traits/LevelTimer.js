import Trait from "../Trait.js";
import Killable from "./Killable.js";

const MARK = Symbol("level timer earmark");

export default class LevelTimer extends Trait {
    static EVENT_TIMER_HURRY = Symbol("timer hurry");
    static EVENT_TIMER_OK = Symbol("timer ok");
    static EVENT_STAR_MOMENT = Symbol("star moment");

    constructor() {
        super();
        this.totalTime = 400;
        this.currentTime = this.totalTime;
        this.hurryTime = 100;
        this.hurryEmitted = null;
    }

    reset() {
        this.currentTime = this.totalTime;
    }

    update(entity, {deltaTime, mario}, level) {
        if(level.ile === false) {
            this.currentTime -= deltaTime * 2;
        }

        if (!level[MARK]) {
            this.hurryEmitted = null;
        }

        if (this.hurryEmitted !== true && this.currentTime < this.hurryTime) {
            level.events.emit(LevelTimer.EVENT_TIMER_HURRY);
            this.hurryEmitted = true;
        }
        if (this.hurryEmitted !== false && this.currentTime > this.hurryTime) {
            level.events.emit(LevelTimer.EVENT_TIMER_OK);
            this.hurryEmitted = false;
        }
        if (this.currentTime <= 0) {
            mario.traits.get(Killable).kill();
            mario.makePowerup(mario, "tiny", false);
        }

        level[MARK] = true;
    }
}
