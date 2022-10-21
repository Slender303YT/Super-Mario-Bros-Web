export default class MusicController {
	constructor() {
		this.player = null;
	}

	setPlayer(player) {
		this.player = player;
	}

	playTheme(speed = 1) {
		const audio = this.player.playTrack("main");
		audio.playbackRate = speed;
	}

	playHurryTheme() {
		const audio = this.player.playTrack("hurry");
		audio.loop = false;
		audio.addEventListener("ended", () => {
			this.playTheme(1.5);
		}, {once: true});
	}

	playStarTheme(mario) {
		var audio = this.player.playTrack("star");
		audio.loop = false;
		audio.addEventListener("ended", () => {
			mario.starTime = false;
			this.playTheme(1);
		}, {once: true});
	}

	pause() {
		this.player.pauseAll();
	}
}