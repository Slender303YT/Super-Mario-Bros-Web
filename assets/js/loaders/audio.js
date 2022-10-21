import {loadJSON} from "../loaders.js";
import AudioBoard from "../AudioBoard.js";

export function loadAudioBoard(name, audioCtx) {
	const loadAudio = createAudioLoader(audioCtx);
	return loadJSON(`assets/sounds/${name}.json`)
	.then(audioSheet => {
		const audioBoard = new AudioBoard(audioCtx);
		const fx = audioSheet.fx;
		const jobs = [];
		return Promise.all(Object.keys(fx).map(name => {
			return loadAudio(fx[name].url)
			.then(buffer => {
				audioBoard.addAudio(name, buffer);
			});
		}))
		.then(() => {
			return audioBoard;
		});
	});
}

export function createAudioLoader(ctx) {
	return function loadAudio(url) {
		return fetch(url)
		.then(response => {
			return response.arrayBuffer();
		})
		.then(arrayBuffer => {
			return ctx.decodeAudioData(arrayBuffer);
		});
	}
}