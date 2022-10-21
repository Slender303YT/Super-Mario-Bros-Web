import Player from "../traits/Player.js";
import LevelTimer from "../traits/LevelTimer.js";
import {findPlayers} from "../player.js";

export function createDashboardLayer(font, entity, dashCoin, var1 = false) {
    const LINE1 = font.size;
    const LINE2 = font.size * 2;
    const LINE3 = font.size * 3;
    const LINE4 = font.size * 4;
    const spriteBuffer = document.createElement("canvas");
    spriteBuffer.width = 256;
    spriteBuffer.height = 16;
    const spriteBufferContext = spriteBuffer.getContext("2d");

    return function drawDashboard(ctx, camera) {
        const playerTrait = entity.traits.get(Player);
        const timerTrait = entity.traits.get(LevelTimer);

        font.print(playerTrait.name, ctx, 24, LINE1);
        font.print(playerTrait.score.toString().padStart(6, '0'), ctx, 24, LINE2);

        spriteBufferContext.clearRect(0, 0, spriteBuffer.width, spriteBuffer.height);
        font.print("x" + playerTrait.coins.toString().padStart(2, '0'), ctx, 104, LINE2);
        dashCoin.draw(spriteBufferContext);
        ctx.drawImage(spriteBuffer, 96, 16);

        if(pol === false) {
            font.print('WORLD', ctx, 144, LINE1);
            font.print(playerTrait.world, ctx, 152, LINE2);
        } else if(pol === true) {
            font.print('LEVEL', ctx, 144, LINE1);
            font.print(playerTrait.world, ctx, 152, LINE2);
        }

        if(pol === false) {
            font.print('TIME', ctx, 200, LINE1);
        } else {
            font.print('TIME', ctx, 24, LINE3);
        }
        if(var1 === false) {
            if(pol === false) {
                font.print(timerTrait.currentTime.toFixed().toString().padStart(3, '0'), ctx, 208, LINE2);
            } else {
                font.print(timerTrait.currentTime.toFixed().toString().padStart(3, '0'), ctx, 24, LINE4);
            }
        } else {
            font.print("COPYRIGHT NINTENDO+", ctx, 40, 128);
            font.print("1985-2022", ctx, 40, 136);
            font.print("NORMAL LEVELS", ctx, 64, 148);
            font.print("GLITCHED LEVELS", ctx, 64, 160);
            font.print("LEVEL EDITOR", ctx, 64, 172);
            font.print("PRESS SPACE TO START", ctx, 64, 192);
        }
    };
}
