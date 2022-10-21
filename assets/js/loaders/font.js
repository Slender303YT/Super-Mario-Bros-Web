import {loadImage} from "../loaders.js";
import SpriteSheet from "../SpriteSheet.js";

const CHARS = ' 0123456789@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-!.+{()}_/;:[]^~ÉÆôòûùÿ╚ÊÐÌ█┌┘ÏÎÍıÈÚÑñ♦Ò╦╔╦╬═¤Ää▄¦§╝Üþ☺☻♥♦♣♠•◘○◙♂▬';

class Font {
	constructor(sprites, size) {
		this.sprites = sprites;
		this.size = size;
	}

	print(text, ctx, x, y) {
		[...text].forEach((char, pos) => {
			this.sprites.draw(char, ctx, x + pos * this.size, y);
		});
	}
}

export function loadFont() {
	return loadImage("assets/images/font.png")
	.then(image => {
		const fontSprite = new SpriteSheet(image);

		const size = 8;
		const rowLen = image.width;

		for(let [index, char] of [...CHARS].entries()) {
			const x = index * size % rowLen;
			const y = Math.floor(index * size / rowLen) * size;
			fontSprite.define(char, x, y, size, size);
		}

		return new Font(fontSprite, size);
	});
}